class TodoApp {
    constructor(inputField, todoList) {
        this.inputField = inputField;
        this.todoList = todoList;
    }

    addLocalStorage(item) {
        if (!localStorage.getItem("list-item")) {
            const listItem = [];
            listItem.push(item);
            localStorage.setItem("list-item", JSON.stringify(listItem));
        } else {
            const listItem = JSON.parse(localStorage.getItem("list-item"));
            listItem.push(item);
            localStorage.setItem("list-item", JSON.stringify(listItem));
        }
    }

    addNewTodo(value) {
        const li = document.createElement("li");
        li.innerText = value;
        const tag1 = this.createTaga(
            "item-done",
            '<i class="fas fa-check"></i>'
        );
        const tag2 = this.createTaga(
            "item-delete",
            '<i class="fas fa-trash"></i>'
        );
        const div = this.createDiv(tag1, tag2);
        li.appendChild(div);
        this.todoList.appendChild(li);
        this.addLocalStorage(li.innerHTML);
    }

    createDiv(...a) {
        const div = document.createElement("div");
        a.forEach((item) => {
            div.appendChild(item);
        });
        return div;
    }

    findOuterParent(child) {
        if (!child) return;

        while (true) {
            if (child != null && child.tagName === "LI") break;
            child = child.parentElement;
        }

        return child;
    }

    checkDoneTodoItem(parent) {
        parent.className = "checked";
        parent.style.textDecoration = "line-through";
    }

    removeTodoItem(parent) {
        parent.remove();
    }

    createTaga(className, child) {
        const a = document.createElement("a");
        a.className = className;
        a.innerHTML = child;
        if (className === "item-done") {
            a.addEventListener("click", () => {
                const outerParent = this.findOuterParent(a);
                this.checkDoneTodoItem(outerParent);
            });
        } else {
            a.addEventListener("click", () => {
                const outerParent = this.findOuterParent(a);
                this.removeTodoItem(outerParent);
            });
        }
        return a;
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

console.log(localStorage.getItem("item"));
