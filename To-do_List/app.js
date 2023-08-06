// Select DOM
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

// Event Listeners
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteOrCompleteTodo);
filterOption.addEventListener("change", filterTodo);

// Functions
function getTodos() {
const todos = JSON.parse(localStorage.getItem("todos")) || [];
todos.forEach(createTodoElement);
}

function addTodo(e) {
e.preventDefault();
const todoText = todoInput.value.trim();
if (todoText === "") {
openmodal("red", "Please enter a Task!");
return;
}

if (isDuplicate(todoText)) {
openmodal('red', 'This Task is already added!');
return;
}

const newTodoItem = {
id: Math.round(Math.random() * 100),
task: todoText,
status: "incomplete",
};

saveLocalTodos(newTodoItem);
createTodoElement(newTodoItem);

todoInput.value = "";
}

function deleteOrCompleteTodo(e) {
const item = e.target;
const todo = item.parentElement;
const id = todo.getAttribute("key");

if (item.classList.contains("trash-btn")) {
	todo.classList.add("fall");
	removeLocalTodos(id);
	todo.addEventListener("transitionend", (e) => {
	todo.remove();
	});
}

if (item.classList.contains("complete-btn")) {
	todo.classList.toggle("completed");
	const status = todo.classList.contains("completed") ? "completed" : "incomplete";
	 saveStatus(id, status);
	}
}

function filterTodo() {
	const todos = todoList.childNodes;
	const selectedFilter = filterOption.value;

	todos.forEach((todo) => {
	switch (selectedFilter) {
	case "completed":
	todo.style.display = todo.classList.contains("completed") ? "flex" : "none";
	break;
	case "incomplete":
	todo.style.display = !todo.classList.contains("completed") ? "flex" : "none";
	break;
	default:
	todo.style.display = "flex";
	break;
	}
     });
}

function createTodoElement(todoItem) {
	const todoDiv = document.createElement("div");
	todoDiv.classList.add("todo");

	const newTodo = document.createElement("li");
	newTodo.innerText = todoItem.task;
	newTodo.classList.add("todo-item");
	todoDiv.appendChild(newTodo);

	const completedButton = document.createElement("button");
	completedButton.innerHTML = `<i class="fas fa-check"></i>`;
	completedButton.classList.add("complete-btn");
	todoDiv.appendChild(completedButton);

	const trashButton = document.createElement("button");
	trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
	trashButton.classList.add("trash-btn");
	todoDiv.setAttribute("key", todoItem.id);
	todoDiv.appendChild(trashButton);

	todoList.appendChild(todoDiv);
}

function saveLocalTodos(todo) {
	const todos = JSON.parse(localStorage.getItem("todos")) || [];
	todos.push(todo);
	localStorage.setItem("todos", JSON.stringify(todos));
}

function removeLocalTodos(id) {
	const todos = JSON.parse(localStorage.getItem("todos")) || [];
	const intId = Number(id);
	const newTodo = todos.filter((todo) => todo.id !== intId);
	localStorage.setItem("todos", JSON.stringify(newTodo));
}

function saveStatus(id, status) {
	const todos = JSON.parse(localStorage.getItem("todos")) || [];
	const intId = Number(id);
	todos.forEach((todo) => {
	    if (todo.id === intId) {
	      todo.status = status;
	    }
	});
	localStorage.setItem("todos", JSON.stringify(todos));
}

function isDuplicate(todoText) {
	const todos = JSON.parse(localStorage.getItem("todos")) || [];
	const tasks = todos.map((todo) => todo.task);
	return tasks.includes(todoText);
    }
