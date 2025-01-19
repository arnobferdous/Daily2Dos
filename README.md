# Daily2Do

Daily2Do is a lightweight task management tool designed to help users efficiently manage their tasks through an intuitive user interface. The application allows users to add, edit, and delete tasks, with rich text formatting capabilities, all while ensuring a secure and organized experience through user authentication.

## Overview

The Daily2Do application is structured using the Model-View-Presenter (MVP) architectural pattern. It consists of a frontend built with HTML, CSS (Bootstrap for styling), and JavaScript (with jQuery for DOM manipulation), while the backend is powered by Node.js and Express.js, utilizing MongoDB for persistent data storage. This clear separation of concerns makes the application easier to maintain and extend.

### Project Structure

- **Frontend**: 
  - `public/index.html`: Main entry point for the user interface.
  - `public/app.js`: Implements the main functionality using the MVP pattern.
  - `public/styles.css`: Contains custom styles for the application.
  - `public/login.html`: User interface for logging in.
  - `public/signup.html`: User interface for signing up.
  - `public/mvp/todoModel.js`: Manages the data and operations related to tasks.
  - `public/mvp/todoPresenter.js`: Coordinates between the model and view.
  - `public/mvp/todoView.js`: Handles the rendering of the user interface.

- **Backend**: 
  - `server.js`: Implements the Express.js server, handling API requests and user authentication.

## Features

1. **Task Management**: Add, edit, and delete tasks with rich text formatting using the Quill editor.
2. **User Authentication**: Secure login and signup functionality with hashed passwords.
3. **User-Specific Tasks**: Each task is associated with a specific user, ensuring organized task management.
4. **Responsive Design**: The application adapts to different screen sizes using Bootstrap.
5. **Real-Time Updates**: Changes to tasks are reflected immediately in the UI without page refresh.
6. **Task Filtering and Pagination**: Filter tasks by title and navigate through larger sets using pagination.
7. **Notifications**: Toastr notifications provide immediate feedback on user actions.
8. **User-Friendly Interface**: Includes a burger menu for navigation and modals for editing tasks.
9. **Redirect for Authenticated Users**: Users are redirected to the index route if they try to access login or signup pages while authenticated.

## Getting started

### Requirements

To run the Daily2Do application, you need the following technologies installed on your computer:

- Node.js
- MongoDB (or use MongoDB Atlas for a cloud version)
- npm (Node package manager)

### Quickstart

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the required dependencies by running:
   ```bash
   npm install
   ```
4. Start the MongoDB server (if running locally).
5. Start the application by running:
   ```bash
   node server.js
   ```
6. Open your web browser and go to `http://localhost:3000` to access the application.

### License

Copyright (c) 2024.