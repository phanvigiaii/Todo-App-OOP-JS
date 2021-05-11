class TodoApp {
    constructor(inputField, todoList, selection) {
        this.inputField = inputField;
        this.todoList = todoList;
        this.selection = selection;
        this.addEventInputField();
        this.addEventSelection();
        this.sortBy = 0;
    }

    addEventInputField() {
        const $this = this;
        this.inputField.addEventListener("focus", function () {
            this.setAttribute("data-key", true);
        });

        this.inputField.addEventListener("blur", function () {
            this.setAttribute("data-key", false);
        });

        this.inputField.addEventListener("keydown", function (key) {
            const ID = (function () {
                return "_" + Math.random().toString(36).substr(2, 9);
            })();

            if (key.which === 13 && this.getAttribute("data-key")) {
                if (!this.value) return;
                const li = $this.addNewTodo(this.value, ID);
                $this.addLocalStorage(this.value, ID);
                this.value = "";
            }
        });
    }

    addEventSelection() {
        const $this = this;

        this.selection.addEventListener("change", function (e) {
            $this.sortBy = Number.parseInt(
                this.options[this.selectedIndex].value
            );
            $this.render();
        });
    }

    render() {
        if (!localStorage.getItem("list-item")) return;

        const listItem = JSON.parse(localStorage.getItem("list-item"));

        if (this.sortBy) {
            listItem.sort((a, b) => {
                if (a.value < b.value) return -this.sortBy;
                if (a.value > b.value) return this.sortBy;
                return 0;
            });
        }

        const htmls = listItem.map((item) => {
            this.addNewTodo(item.value, item.ID, item.checked);
        });
    }

    addLocalStorage(item, ID) {
        if (!localStorage.getItem("list-item")) {
            const listItem = [];

            listItem.push({ value: item, ID });
            localStorage.setItem("list-item", JSON.stringify(listItem));
        } else {
            const listItem = JSON.parse(localStorage.getItem("list-item"));

            listItem.push({ value: item, ID });
            localStorage.setItem("list-item", JSON.stringify(listItem));
        }
    }

    addNewTodo(value, ID, isChecked) {
        const li = document.createElement("li");
        const tag1 = this.createTaga(
            "item-done",
            '<i class="fas fa-check"></i>'
        );
        const tag2 = this.createTaga(
            "item-delete",
            '<i class="fas fa-trash"></i>'
        );
        const div = this.createDiv(tag1, tag2);

        if (isChecked) {
            li.className = "checked";
        }

        li.id = ID;
        li.innerText = value;
        li.appendChild(div);
        this.todoList.appendChild(li);

        return li;
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
        const listItem = JSON.parse(localStorage.getItem("list-item"));
        const index = listItem.findIndex((item) => item.ID === parent.id);

        listItem[index].checked = true;
        localStorage.setItem("list-item", JSON.stringify(listItem));
        parent.className = "checked";
    }

    removeTodoItem(parent) {
        const listItem = JSON.parse(localStorage.getItem("list-item"));
        const index = listItem.findIndex((item) => item.ID === parent.id);

        listItem.splice(index, 1);
        localStorage.setItem("list-item", JSON.stringify(listItem));
        parent.remove();
    }

    addEventCheckDone(tag) {
        tag.addEventListener("click", () => {
            const outerParent = this.findOuterParent(tag);
            this.checkDoneTodoItem(outerParent);
        });
    }

    addEventRemove(tag) {
        tag.addEventListener("click", () => {
            const outerParent = this.findOuterParent(tag);
            this.removeTodoItem(outerParent);
        });
    }

    createTaga(className, child) {
        const a = document.createElement("a");
        a.className = className;
        a.innerHTML = child;

        if (className === "item-done") {
            this.addEventCheckDone(a);
        } else {
            this.addEventRemove(a);
        }

        return a;
    }
}

const inputField = document.querySelector("#input-todo");
const todoList = document.querySelector(".todo-list");
const selection = document.querySelector(".form-control");
const todoApp = new TodoApp(inputField, todoList, selection);
