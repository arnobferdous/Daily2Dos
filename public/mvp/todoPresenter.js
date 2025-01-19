import TodoModel from './todoModel.js';
import TodoView from './todoView.js';

class TodoPresenter {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindAddTodo(this.handleAddTodo.bind(this));
        this.view.bindEditTodo(this.handleEditTodo.bind(this));
        this.view.bindDeleteTodo(this.handleDeleteTodo.bind(this));
        this.view.bindUpdateTodo(this.handleUpdateTodo.bind(this)); // Bind the update handler

        this.loadTodos();
        this.view.bindPaginationEvents(this.loadTodos.bind(this)); // Bind pagination events
    }

    async loadTodos(page = 1) {
        try {
            const todos = await this.model.fetchTodos();
            this.view.currentPage = page; // Set the current page
            this.view.renderTodos(todos);
            console.log('Todos loaded successfully:', todos);
        } catch (error) {
            console.error('Error loading todos:', error);
            console.error('Error stack:', error.stack);
        }
    }

    async handleAddTodo() {
        try {
            const title = this.view.getTodoTitle();
            console.log('Title retrieved from Quill editor:', title); // Log the title
            if (title) {
                await this.model.addTodo(title);
                this.view.clearEditor();
                this.loadTodos();
                console.log('Todo added successfully:', title);
                toastr.success('ToDo has been successfully added!'); // Toastr notification
            } else {
                console.warn('Todo title is empty, not adding.');
            }
        } catch (error) {
            console.error('Error adding todo:', error);
            console.error('Error stack:', error.stack);
            toastr.error('Failed to add ToDo. Please try again.'); // Error notification
        }
    }

    async handleEditTodo(id) {
        console.log('Edit todo with ID:', id);
        const todo = this.model.todos.find(todo => todo.id === id);
        if (todo) {
            this.view.initializeEditQuillEditor(); // Initialize the Quill editor for editing
            this.view.editQuillEditor.root.innerHTML = todo.title; // Set the content of the Quill editor
            $('#updateTodoBtn').data('id', id); // Set the ID on the Update button
            $('#editTodoModal').modal('show');
        } else {
            console.warn('Todo not found for ID:', id);
        }
    }

    async handleUpdateTodo(id) {
        console.log('Updating todo with ID:', id);
        try {
            const updatedContent = this.view.getUpdatedTodoContent(); // Get content from the edit Quill editor
            await this.model.updateTodo(id, updatedContent, false); // Assuming completed is false for the update
            this.view.closeEditModal(); // Close the modal after the update
            this.loadTodos();
            console.log('Todo updated successfully:', id);
            toastr.success('ToDo has been successfully updated!'); // Toastr notification for update
        } catch (error) {
            console.error('Error updating todo:', error);
            console.error('Error stack:', error.stack);
            toastr.error('Failed to update ToDo. Please try again.'); // Error notification
        }
    }

    async handleDeleteTodo(id) {
        try {
            await this.model.deleteTodo(id);
            this.loadTodos();
            console.log('Todo deleted successfully with ID:', id);
            toastr.success('ToDo has been successfully deleted!'); // Toastr notification for delete
        } catch (error) {
            console.error('Error deleting todo:', error);
            console.error('Error stack:', error.stack);
            toastr.error('Failed to delete ToDo. Please try again.'); // Error notification
        }
    }
}

export default TodoPresenter;