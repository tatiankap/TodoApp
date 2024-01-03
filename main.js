const formEl = document.querySelector('#create-todo-item');
const inputEl = document.querySelector('.js-add-todo');
const listEl = document.querySelector('.js-todo-list');

let allTodos = [];

// Restore from localStorage
if (localStorage.getItem('todo')) {
    allTodos = JSON.parse(localStorage.getItem('todo'));

    for (const item of allTodos) {
        addTodoToList(item);
    }
}

function createTaskHTML(todoItem) {
    return `
        <li class="list-group-item d-flex justify-content-between align-items-center ${todoItem.status === 'completed' ? 'bg-secondary' : ''}">
                <input 
                    class="form-check-input me-1" 
                    type="checkbox" value="" 
                    id="${todoItem.id}" 
                    ${todoItem.status === "completed" ? "checked disabled" : ""}
                >
                <label class="form-check-label js-add-todo" for="${todoItem.id}">${todoItem.text}</label>
                <button class="btn btn-sm btn-warning btn-edit ms-auto me-2" data-taskId="${todoItem.id}">Edit</button>
                <button class="btn btn-sm btn-danger" data-taskId="${todoItem.id}">Del</button>
        </li>`
}

function createEditHTML(todoItem, value) {
    return `
        <li class="list-group-item d-flex justify-content-between align-items-center ">
            <input 
                class="form-check-input me-1" 
                type="checkbox" value="" 
                id="${todoItem.id}" 
                ${todoItem.status === "completed" ? "checked" : ""}
            >
            <input type="text" class="form-control js-add-todo" value=${value}>
            <button class="btn btn-sm btn-success btn-update ms-auto me-2" data-taskid=${todoItem.id}>Update</button>
        </li>
        `
}

/**
 * Add todo item to the list
 * @param {*} todoItemText - text for task
 */
function addTodoToList(todoItem) {
    const html = createTaskHTML(todoItem);
    listEl.innerHTML += html;
    inputEl.value = '';
}

/**
 * Complete task
 * @param {*} target - checkbox item element
 */
function completeTask(target) {
    const taskId = Number(target.id);
    if (!target.parentElement.querySelector('.btn-update')) {
        target.setAttribute('disabled', true);
        target.parentElement.classList.add('bg-secondary');
    }

    allTodos.forEach((todoItem) => {
        if (todoItem.id === taskId) {
            todoItem.status = target.checked ? 'completed' : 'active';
        }
    });

    // save to localStorage
    localStorage.setItem('todo', JSON.stringify(allTodos));
}

/**
 * Remove task
 * @param {*} target - button item element
 */
function removeTask(target) {
    const taskId = Number(target.getAttribute('data-taskId'));
    const parent = target.parentElement;

    allTodos.forEach((todoItem) => {
        if (todoItem.id === taskId) {
            allTodos.splice(allTodos.indexOf(todoItem), 1);
        }
    });

    // save to localStorage
    localStorage.setItem('todo', JSON.stringify(allTodos));

    parent.remove();
}

function editTask(target) {
    const edit = target.classList.contains("btn-edit"),
        update = target.classList.contains("btn-update");
    const taskId = Number(target.getAttribute('data-taskId'));
    const todoItem = allTodos.find(todo => todo.id === taskId);

    let editHTML = '';
    if (edit) {
        const value = target.parentElement.querySelector('.js-add-todo').innerHTML;
        editHTML = createEditHTML(todoItem, value)
    }

    if (update) {
        const value = target.parentElement.querySelector('.js-add-todo').value;
        allTodos.forEach((todoItem) => {
            if (todoItem.id === taskId) {
                todoItem.text = value;
            }
        });
        editHTML = createTaskHTML(todoItem)
    }
    

    target.parentElement.outerHTML = editHTML;
    localStorage.setItem('todo', JSON.stringify(allTodos));
}

// Form submit
formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const todoItemText = inputEl.value;
    const existingTodoItem = allTodos.filter((item) => item.text === todoItemText);

    if (!existingTodoItem.length) { // change checking
        const todoItem = {
            id: new Date().getTime(),
            text: todoItemText,
            status: 'active'
        };

        addTodoToList(todoItem);

        allTodos.push(todoItem);

        // save to localStorage
        localStorage.setItem('todo', JSON.stringify(allTodos));
    } else {
        alert('This todo is already in the list');
    }
});


// List item click
listEl.addEventListener('click', (e) => {
    const btnEdit = e.target.closest('.btn-edit');
    const checkTask = e.target.closest('.form-check-input');
    const btnUpdate = e.target.closest('.btn-update')
    if (checkTask) {
        // Complete task
        completeTask(e.target);
    } else if (btnEdit || btnUpdate) {
        editTask(e.target);
    } else if (e.target.tagName === 'BUTTON') {
        // Remove task
        removeTask(e.target);
    }
});
