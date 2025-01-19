import TodoPresenter from './mvp/todoPresenter.js';
import TodoModel from './mvp/todoModel.js';
import TodoView from './mvp/todoView.js';

const todoModel = new TodoModel();
const todoView = new TodoView();
const todoPresenter = new TodoPresenter(todoModel, todoView);

// Debounce function
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

// Search function
function searchTodos() {
    const searchText = $('#searchInput').val().toLowerCase();
    const filteredTodos = todoModel.todos.filter(todo =>
        todo.title.toLowerCase().includes(searchText)
    );
    todoView.renderTodos(filteredTodos);
}

// Attach event listener to searchInput
$('#searchInput').on('input', debounce(searchTodos, 300));

// Burger Menu Functionality
$(document).ready(function() {
    // Toggle the dropdown menu on burger button click
    $('#burgerMenuButton').on('click', function() {
        $('.dropdown-menu').toggle();
        console.log('Burger menu toggled');
    });

    // Close the dropdown if clicked outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.dropdown').length) {
            $('.dropdown-menu').hide();
            console.log('Dropdown menu closed');
        }
    });
});