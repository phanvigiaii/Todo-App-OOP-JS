class TodoApp {
    constructor(inputField, todoList) {
        this.inputField = inputField;
        this.todoList = todoList;
    }
    addNewTodo(value) {
        let li = document.createElement("li");
        li.innerText = value;
        this.todoList.appendChild(li);
    }
}

const inputField = document.querySelector("#input-todo");
const todoList = document.querySelector(".todo-list");

const todoApp = new TodoApp(inputField, todoList);

inputField.addEventListener("focus", function () {
    this.setAttribute("data-key", true);
});

inputField.addEventListener("blur", function () {
    this.setAttribute("data-key", false);
});

inputField.addEventListener("keydown", function (key) {
    if (key.which === 13 && this.getAttribute("data-key")) {
        todoApp.addNewTodo(this.value);
        this.value = "";
    }
});
