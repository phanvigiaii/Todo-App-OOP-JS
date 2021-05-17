class TodoApp {
    constructor(inputField, todoList, selection) {
        this.inputField = inputField;
        this.todoList = todoList;
        this.selection = selection;
        this.sortBy = 0;
        this.data = JSON.parse(localStorage.getItem("list-item")) || [];
        this.addEventInputField();
        this.addEventSelection();
        this.render();
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
                $this.data.push({ value: this.value, ID });
                $this.set();
                this.value = "";
                $this.render();
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
        if (this.sortBy) {
            this.data.sort((a, b) => {
                if (a.value < b.value) return -this.sortBy;
                if (a.value > b.value) return this.sortBy;
                return 0;
            });
        }

        const htmls = this.data.map((item) => {
            return this.addNewTodo(item.value, item.ID, item.isChecked);
        });

        this.todoList.innerHTML = htmls.join("");
    }

    set() {
        localStorage.setItem("list-item", JSON.stringify(this.data));
    }

    addNewTodo(value, ID, isChecked) {
        return `<li class=${(isChecked && "checked") || ""} id=${ID}>
                    ${value}                
                    <div>
                        <a class='item-done' onclick="dispatch('CHECK', '${ID}')">
                            <i class="fas fa-check"></i>
                        </a>
                        <a class='item-delete' onclick="dispatch('DELETE', '${ID}')">
                            <i class="fas fa-trash"></i>
                        </a>
                    </div>
                </li>`;
    }

    dispatch(action, arg) {
        switch (action) {
            case "DELETE":
                const index = this.data.findIndex((x) => x.ID === arg);
                this.data.splice(index, 1);
                break;
            case "CHECK":
                this.data.forEach((x) => {
                    if (x.ID === arg) {
                        x.isChecked = true;
                    }
                });
                break;
        }
        this.render();
        this.set();
    }
}

const inputField = document.querySelector("#input-todo");
const todoList = document.querySelector(".todo-list");
const selection = document.querySelector(".form-control");
const todoApp = new TodoApp(inputField, todoList, selection);
window.dispatch = todoApp.dispatch.bind(todoApp);
