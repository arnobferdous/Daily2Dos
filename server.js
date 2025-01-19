const express = require('express');
const { MongoClient, ObjectId } = require('mongodb'); // Change ObjectID to ObjectId
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package
const path = require('path'); // Import path to serve static files
const bcrypt = require('bcrypt'); // Step 2.1: Import bcrypt
const session = require('express-session'); // Import express-session

console.log('Starting server...'); // Log when the server file is being executed

const app = express();
const port = 3000; // Use port 3000

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
console.log('Middleware configured.'); // Log to confirm that the middleware is set up
app.use(express.static('public')); // Serve static files from the 'public' directory

// Add session middleware
app.use(session({
    secret: '123123', // Replace with a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Middleware to check if user is authenticated
function checkAuth(req, res, next) {
    if (req.session.userId) { // Assuming userId is stored in session when logged in
        console.log('User is authenticated, redirecting to index.'); // Log redirection
        return res.redirect('/'); // Redirect to index if authenticated
    }
    next(); // Otherwise, proceed to the next middleware/route handler
}

// Logging middleware to log all incoming requests
app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    console.log('Logging middleware executed'); // New log
    next();
});

const url = 'mongodb://localhost:27017';
const dbName = 'simpletodo';
let db;

// Connect to MongoDB
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database');
        db = client.db(dbName);
    })
    .catch(error => {
        console.error('Failed to connect to Database:', error);
    });

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Apply the middleware to login and signup routes
app.get('/user/login', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/user/signup', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// User sign-up endpoint
app.post('/user/signup', async (req, res) => {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if the username already exists
        const existingUser = await db.collection('users').findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            username,
            email,
            password: hashedPassword, // Store the hashed password
            createdAt: new Date().toISOString()
        };

        db.collection('users').insertOne(newUser)
            .then(result => {
                console.log('User signed up:', { id: result.insertedId, ...newUser });
                res.status(201).json({ id: result.insertedId, ...newUser });
            })
            .catch(error => {
                console.error('Error signing up user:', error);
                res.status(500).json({ error: 'Failed to sign up user' });
            });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ error: 'Failed to hash password' });
    }
});

// User login endpoint
app.post('/user/login', async (req, res) => {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Find the user by username
        const user = await db.collection('users').findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Compare the password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Successful login - store username and userId in session
        req.session.username = user.username; // Store username in session
        req.session.userId = user._id; // Store userId in session
        res.status(200).json({ message: 'Login successful!', user: { username: user.username, userId: user._id } });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Failed to log in' });
    }
});

// Logout route
app.get('/user/logout', (req, res) => {
    req.session.destroy(); // Destroy the session
    res.redirect('/user/login'); // Redirect to login
});

// Route to get session information
app.get('/user/session', (req, res) => {
    if (req.session.username) {
        res.json({ username: req.session.username });
    } else {
        res.json({ username: null });
    }
});

// API Endpoints
app.post('/todos', (req, res) => {
    console.log('POST /todos called'); // Log for POST

    // Check if user is authenticated
    if (!req.session.userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    const { title, completed = false } = req.body; // Destructure title and completed
    const userId = req.session.userId; // Get userId from session

    const todo = {
        title,
        completed,
        userId, // Store userId in the todo object
        createdAt: new Date().toISOString(), // Add createdAt timestamp
        updatedAt: new Date().toISOString()  // Add updatedAt timestamp
    };

    db.collection('todos').insertOne(todo)
        .then(result => {
            console.log('Todo added:', { id: result.insertedId, ...todo });
            res.status(201).json({ id: result.insertedId, ...todo });
        })
        .catch(error => {
            console.error('Error adding todo:', error);
            res.status(500).json({ error: 'Failed to add todo' });
        });
});

app.get('/todos', (req, res) => {
    console.log('GET /todos called'); // Log for GET
    if (!req.session.userId) {
        return res.status(401).json({ error: 'User not authenticated' }); // Check if user is authenticated
    }

    // Fetch todos for the logged-in user only
    db.collection('todos').find({ userId: req.session.userId }).toArray()
        .then(todos => {
            console.log('Todos retrieved for user:', req.session.userId);
            res.json(todos.map(todo => ({
                id: todo._id,
                title: todo.title,
                completed: todo.completed,
                createdAt: todo.createdAt,
                updatedAt: todo.updatedAt
            })));
        })
        .catch(error => {
            console.error('Error fetching todos:', error);
            res.status(500).json({ error: 'Failed to fetch todos' });
        });
});

app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    console.log(`PUT /todos/${id} called`); // Log for PUT
    const updatedTodo = {
        title: req.body.title,
        updatedAt: new Date().toISOString() // Update updatedAt timestamp
    };
    db.collection('todos').updateOne({ _id: new ObjectId(id) }, { $set: updatedTodo })
        .then(result => {
            if (result.matchedCount === 0) {
                return res.status(404).json({ error: 'Todo not found' });
            }
            console.log('Todo updated:', { id, ...updatedTodo });
            res.json({ id, ...updatedTodo });
        })
        .catch(error => {
            console.error('Error updating todo:', error);
            res.status(500).json({ error: 'Failed to update todo' });
        });
});

app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    console.log(`DELETE /todos/${id} called`); // Log for DELETE
    db.collection('todos').deleteOne({ _id: new ObjectId(id) }) // Change ObjectID to ObjectId
        .then(result => {
            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Todo not found' });
            }
            console.log('Todo deleted:', id);
            res.json({ message: 'ToDo deleted successfully' });
        })
        .catch(error => {
            console.error('Error deleting todo:', error);
            res.status(500).json({ error: 'Failed to delete todo' });
        });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}).on('error', (err) => {
    console.error('Failed to start server:', err);
});