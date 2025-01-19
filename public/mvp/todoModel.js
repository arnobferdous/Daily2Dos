class TodoModel {
    constructor() {
        this.todos = [];
    }

    fetchTodos() {
        return $.ajax({
            url: '/todos',
            method: 'GET'
        }).done((data) => {
            console.log('Fetched todos:', data);
            this.todos = data; // Store the fetched todos in the model's todos array
        }).fail((xhr, status, error) => {
            console.error('Error fetching todos:', error);
            console.error('Error details:', xhr.responseText);
        });
    }

    addTodo(title) {
        const userId = sessionStorage.getItem('userId'); // Assuming userId is stored in sessionStorage after login
        return $.ajax({
            url: '/todos',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ title, completed: false, userId }) // Include userId in the request
        }).done((todo) => {
            console.log('Added todo:', todo);
        }).fail((xhr, status, error) => {
            console.error('Failed to add todo:', error);
            console.error('Error details:', xhr.responseText);
        });
    }

    updateTodo(id, title, completed) {
        return $.ajax({
            url: `/todos/${id}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ title, completed })
        }).done((updatedTodo) => {
            console.log('Updated todo:', updatedTodo);
        }).fail((xhr, status, error) => {
            console.error('Failed to update todo:', error);
            console.error('Error details:', xhr.responseText);
        });
    }

    deleteTodo(id) {
        return $.ajax({
            url: `/todos/${id}`,
            method: 'DELETE'
        }).done(() => {
            console.log('Deleted todo with id:', id);
        }).fail((xhr, status, error) => {
            console.error('Failed to delete todo:', error);
            console.error('Error details:', xhr.responseText);
        });
    }
}

export default TodoModel;