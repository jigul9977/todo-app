const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-btn");
const editButton = document.getElementById("edit-btn");
const alertMessage = document.getElementById("alert-message");
const filterButtons = document.querySelectorAll(".filter-todos");
let todos = JSON.parse(localStorage.getItem("todos")) || []; // Each one that returns true will be placed in the variable
//So, if there is nothing in the local storage, the value of the variable will be empty array
const tableBody = document.querySelector("tbody");
const btnDeleteAll = document.getElementById("delete-all-todo");

const generateId = () => {
  //Generate a random number as the ID of each object
  return Math.round(Math.random() * Math.random() * Math.pow(10, 15));
};

const saveToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const showAlert = (message, type) => {
  alertMessage.innerHTML = ""; //Preventing the creation of several identical alerts in a row
  const wrapper = document.createElement("div");
  wrapper.innerHTML = [
    `<div class="alert alert-${type} fs-5 text-center alert-dismissible" role="alert">`,
    `<strong>${message}</strong>`,
    `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`,
    `</div>`,
  ].join("");
  alertMessage.append(wrapper);
  setTimeout(() => {
    //To make the alert disappear after 3 seconds
    wrapper.style.display = "none";
  }, 3000);
};

const readFromLocalStorage = (data) => {
  const todosList = data || todos;
  tableBody.innerHTML = "";
  if (!todosList.length) {
    tableBody.innerHTML = `<tr>
		<td colspan='4'>No task found!</td>
		</tr>`;
    return;
  } else {
    todosList.forEach((todo) => {
      tableBody.innerHTML += `<tr><td>${todo.task}</td>
        <td>${todo.date || "No Date"}</td>
        <td>${todo.completed ? "Completed" : "Pending"}</td>
        <td><button onclick="editHandler(${
          todo.id
        })" class="fa-solid fa-pen text-bg-warning border-0 rounded-circle p-2 m-1"></button>
        <button onclick="changeStatusHandler(${todo.id})" class="fa-solid ${
        todo.completed ? "fa-rotate-left text-bg-primary" : "fa-check text-bg-success"
      } border-0 rounded-circle p-2 m-1"></button>
        <button onclick="removeHandler(${
          todo.id
        })" class="fa-solid fa-trash-can border-0 rounded-circle p-2 m-1 text-bg-danger"></button>
        </td></tr>`;
    });
  }
};

const addHandler = () => {
  const task = taskInput.value;
  const date = dateInput.value;
  const todo = {
    //It puts the value taken from the inputs into an object every time
    id: generateId(),
    task, //It is written as if the key name is the same as the value name
    date,
    completed: false,
  };

  if (task) {
    todos.push(todo); //Places objects in an array
    saveToLocalStorage(); // To save on Local Storage
    readFromLocalStorage();
    taskInput.value = ""; //Resetting the inputs to prepare for the new value
    dateInput.value = "";
    showAlert("Todo added successfully.", "success");
  } else {
    showAlert("Please enter a Todo!", "danger");
  }
};

const removeAllHandler = () => {
  if (todos.length) {
    todos = [];
    saveToLocalStorage();
    readFromLocalStorage();
    showAlert("All Todos Delete successfully", "warning");
  } else {
    showAlert("No Task Found To Delete", "danger");
  }
};

const removeHandler = (id) => {
  const newTodos = todos.filter((todo) => {
    return todo.id !== id;
  });
  todos = newTodos;
  saveToLocalStorage();
  readFromLocalStorage();
  showAlert("Todo Delete successfully", "danger");
};

const changeStatusHandler = (id) => {
  // const newTodos = todos.map((todo) => {
  //   if (todo.id === id) {
  // 		return {
  // 			...todo,
  // 			completed:!todo.completed,
  // 		}
  //   } else {
  //     return todo;
  //   }
  // });
  // /todos = newTodos;
  const todo = todos.find((todo) => todo.id === id); //use refrenced type
  todo.completed = !todo.completed;
  saveToLocalStorage();
  readFromLocalStorage();
};

const editHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  taskInput.value = todo.task;
  dateInput.value = todo.date;
  addButton.style.display = "none";
  editButton.style.display = "inline-block";
  editButton.dataset.id = id;
};

const applyEditHandler = (event) => {
  const id = +event.target.dataset.id;
  const todo = todos.find((todo) => todo.id === id);
  todo.task = taskInput.value;
  todo.date = dateInput.value;

  taskInput.value = "";
  dateInput.value = "";
  addButton.style.display = "inline-block";
  editButton.style.display = "none";
  saveToLocalStorage();
  readFromLocalStorage();
  showAlert("Todo successfully changed", "success");
};

const filterHandler = (event) => {
  let filterTodos = null;
  const filter = event.target.dataset.filter;
  switch (filter) {
    case "pending":
      filterTodos = todos.filter((todo) => todo.completed === false);
      break;

    case "completed":
      filterTodos = todos.filter((todo) => todo.completed);
      break;
    default:
      filterTodos = todos;
      break;
  }
  readFromLocalStorage(filterTodos);
};
window.addEventListener("load", readFromLocalStorage());
addButton.addEventListener("click", addHandler);
btnDeleteAll.addEventListener("click", removeAllHandler);
editButton.addEventListener("click", applyEditHandler);
filterButtons.forEach((button) => {
  button.addEventListener("click", filterHandler);
});
//<button class="fa-solid fa-rotate-left text-bg-primary border-0 rounded-circle p-2 m-1"></button>
