class TodoView {
    constructor() {
        this.todoList = $('#todoList');
        this.addTodoBtn = $('#addTodoBtn');
        this.quillEditor = new Quill('#quillEditor', {
            theme: 'snow'
        });

        // Set the height of the Quill editor to auto
        $('#quillEditor').css('height', 'auto'); // Set height to auto for dynamic adjustment
        console.log('Quill editor height set to auto for better user experience.');

        // Initialize the editQuillEditor variable
        this.editQuillEditor = null; // Initially set to null

        // Bind search input event
        this.bindSearchInput();

        // Pagination properties
        this.todosPerPage = 5; // Set the number of todos per page
        this.currentPage = 1; // Initialize current page
        this.totalPages = 0; // Initialize total pages
    }

    // Method to initialize the edit Quill editor
    initializeEditQuillEditor() {
        if (!this.editQuillEditor) { // Check if the editor is already initialized
            this.editQuillEditor = new Quill('#editQuillEditor', {
                theme: 'snow'
            });
            $('#editQuillEditor').css('height', 'auto'); // Set height to auto for dynamic adjustment
            console.log('Edit Quill editor initialized.');
        }
    }

    renderTodos(todos) {
        this.todoList.empty();
        this.todos = todos; // Store the todos for searching later

        // Calculate total pages
        this.totalPages = Math.ceil(this.todos.length / this.todosPerPage);
        const startIndex = (this.currentPage - 1) * this.todosPerPage;
        const endIndex = startIndex + this.todosPerPage;
        const todosToDisplay = this.todos.slice(startIndex, endIndex);

        todosToDisplay.forEach(todo => {
            // Format updatedAt only
            const updatedAt = this.formatDate(todo.updatedAt);

            // Update the HTML structure to only show updatedAt
            const listItem = $(`
                <li class="list-group-item">
                    <div class="todo-container">
                        <div class="todo-title">${todo.title}</div>
                        <div class="timestamp">
                            Updated at: ${updatedAt} <!-- Only show Updated at -->
                        </div>
                    </div>
                    <div class="actionBtnGroup">
                        <button class="editBtn btn btn-warning" data-id="${todo.id}">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="deleteBtn btn btn-danger" data-id="${todo.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </li>
            `);
            this.todoList.append(listItem);
        });
        console.log('Todos rendered:', todos);

        this.updatePaginationControls();
    }

    updatePaginationControls() {
        $('#currentPage').text(`Page ${this.currentPage}`);
        $('#prevPage').prop('disabled', this.currentPage === 1);
        $('#nextPage').prop('disabled', this.currentPage === this.totalPages);
    }

    bindPaginationEvents(handler) {
        $('#prevPage').on('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                handler(this.currentPage);
            }
        });

        $('#nextPage').on('click', () => {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                handler(this.currentPage);
            }
        });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date; // Difference in milliseconds
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60)); // Convert to minutes
        const diffInHours = Math.floor(diffInMinutes / 60); // Convert to hours

        if (diffInMs < 24 * 60 * 60 * 1000) { // Less than 24 hours
            if (diffInMinutes === 0) {
                return 'just now';
            } else if (diffInMinutes < 60) {
                return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
            } else {
                return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
            }
        } else {
            // Format the date for more than 24 hours
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            };
            return date.toLocaleString('en-US', options).replace(',', ''); // Remove the comma
        }
    }

    getTodoTitle() {
        const title = this.quillEditor.root.innerHTML; // Get the content from the main Quill editor
        console.log('Content from Quill editor:', title); // Log the content retrieved
        return title;
    }

    getUpdatedTodoContent() {
        return this.editQuillEditor.root.innerHTML; // Get the content from the edit Quill editor
    }

    clearEditor() {
        this.quillEditor.setText('');
        console.log('Quill editor cleared.');
    }

    bindAddTodo(handler) {
        this.addTodoBtn.on('click', handler);
        console.log('Add Todo button bound to handler.');
    }

    bindEditTodo(handler) {
        this.todoList.on('click', '.editBtn', function() {
            const todoId = $(this).data('id');
            console.log('Edit button clicked for Todo ID:', todoId); // Log the ID of the clicked Todo
            handler(todoId);
        });
        console.log('Edit Todo button bound to handler.');
    }

    bindDeleteTodo(handler) {
        this.todoList.on('click', '.deleteBtn', function() {
            handler($(this).data('id'));
        });
        console.log('Delete Todo button bound to handler.');
    }

    bindUpdateTodo(handler) {
        $('#updateTodoBtn').on('click', () => {
            console.log('Update button clicked'); // Add this log
            const todoId = $('#updateTodoBtn').data('id'); // Get the ID of the todo being edited
            const updatedTitle = this.getUpdatedTodoContent(); // Get the updated title from the Quill editor
            handler(todoId, updatedTitle); // Call the handler with ID and updated title
        });
        console.log('Update Todo button bound to handler.');
    }

    closeEditModal() {
        $('#editTodoModal').modal('hide'); // Close the modal
        console.log('Edit modal closed.');
    }

    bindSearchInput() {
        const debounce = (func, delay) => {
            let timeout;
            return function(...args) {
                const context = this;
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(context, args), delay);
            };
        };

        const searchTodos = debounce(() => {
            const searchText = $('#searchInput').val().toLowerCase();
            console.log('Searching todos with input:', searchText);
            const filteredTodos = this.todos.filter(todo =>
                todo.title.toLowerCase().includes(searchText)
            );
            this.renderTodos(filteredTodos);
        }, 300);

        $('#searchInput').on('input', searchTodos);
        console.log('Search input bound to handler.');
    }
}

export default TodoView;