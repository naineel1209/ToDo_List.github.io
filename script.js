//We will use localStorage to store the tasks
const task_details = document.querySelector("#task_details");
const category = document.querySelector(".category");
const form = document.querySelector(".todo_form");
const ul = document.querySelector("ul");
const noTask = document.createElement("div");
noTask.innerHTML = "Currently No Tasks";

const storageTasks = [...JSON.parse(localStorage.getItem("task") || "[]")];

window.onload = loadTasks();

//load the tasks to the list
function loadTasks() {
    //remove any existing tasks
    ul.innerHTML = "";

    if (storageTasks.length > 0) {
        storageTasks.forEach((task) => {
            const li = document.createElement("li");
            li.innerHTML = (task.completed) ? `<input type="checkbox" checked/>` : `<input type = "checkbox" />`;
            li.innerHTML += `<input type="text" readonly class="text" value="${task.task_name}"></input>  
            <i class="fa-solid fa-pen-to-square"></i>
            <i class="fa-solid fa-trash"></i>`;

            if (task.completed) {
                console.log(li.children[1]);
                li.children[1].style.textDecoration = 'line-through';
            }

            ul.append(li);
        });
    } else {
        ul.append(noTask);
    }
}

//add task
function addTask() {
    noTask.remove();

    const task_name = task_details.value;
    let task_category;

    if (task_name === "") {
        alert("ENTER VALID TASK");
        return;
    }

    category.childNodes.forEach((node) => {
        if (node.checked) {
            task_category = node.labels[0].textContent;
        }
    });

    //define the task
    let task = {
        task_name: task_name,
        task_category: task_category,
        completed: false,
    };

    //set the task
    storageTasks.push(task);
    localStorage.setItem("task", JSON.stringify(storageTasks));

    loadTasks();
}

function editTask(inputEle, targetLi, index) {
    console.log("Inside editTask");
    inputEle.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            storageTasks[index].task_name = inputEle.value;
            localStorage.setItem("task", JSON.stringify(storageTasks));
            inputEle.readOnly = true;
            // loadTasks();
        }
    });
}

//delete task
const inputText = document.getElementsByClassName("text");
ul.addEventListener("click", (e) => {
    const el = e.target;
    const targetLi = el.parentNode;
    let index = Array.from(targetLi.parentNode.children).indexOf(targetLi);

    //check if clicked delete button
    if (el.classList.contains("fa-trash")) {
        storageTasks.splice(index, 1);
        console.log(storageTasks.length);
        localStorage.setItem("task", JSON.stringify(storageTasks));
        loadTasks();
    }

    //check if clicked edit
    if (el.classList.contains("fa-pen-to-square")) {
        console.log("Vamos?")
        if (storageTasks[index].completed === true) {
            console.log("Cannot Edit");
            return;
        } else {
            console.log("Can Edit");
            const inputEle = el.previousElementSibling;
            inputEle.readOnly = false;
            editTask(inputEle, targetLi, index);
        }
    }

    //checking the checkbox
    if (el.type === "checkbox" && el.checked) {
        console.log("checked")
        storageTasks[index].completed = true;
        localStorage.setItem("task", JSON.stringify(storageTasks));
        inputText[index].style.textDecoration = "line-through";
    } else if (el.type === "checkbox" && !el.checked) {
        console.log("un-checked")
        storageTasks[index].completed = false;
        localStorage.setItem("task", JSON.stringify(storageTasks));
        inputText[index].style.textDecoration = "none";
    }
});

//submit event listener
form.addEventListener("submit", (e) => {
    e.preventDefault();
    addTask();
});
