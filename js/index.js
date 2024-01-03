// ~ >=========|> HTML Elements
var newTaskBtn = document.getElementById("newTask");
var modalEl = document.getElementById("modal");
var statusInput = document.getElementById("status");
var categoryInput = document.getElementById("category");
var titleInput = document.getElementById("title");
var descriptionInput = document.getElementById("description");
var addBtn = document.getElementById("addBtn");
var updateBtn = document.getElementById("updateBtn");
var searchInput = document.getElementById("searchInput");

var containers = {
  nextUp: document.getElementById("nextUp"),
  inProgress: document.getElementById("inProgress"),
  done: document.getElementById("done"),
};

var countersEl = {
  nextUp: document.getElementById("nextUp").querySelector("span"),
  inProgress: document.getElementById("inProgress").querySelector("span"),
  done: document.getElementById("done").querySelector("span"),
};

// & >=========|> App variables
var tasksArr = getTasksfromLocal();
for (var i = 0; i < tasksArr.length; i++) {
  displayTask(i);
}

var counters = {
  nextUp: 0,
  inProgress: 0,
  done: 0,
};

var updatedIndex;

// * >=========|> Functions
function showModal() {
  modalEl.classList.replace("d-none", "d-flex");
}

function hideModal() {
  resetModal();
  modalEl.classList.replace("d-flex", "d-none");
}

function resetModal() {
  clearForm();
  addBtn.classList.replace("d-none", "d-block");
  updateBtn.classList.replace("d-block", "d-none");
}

function setTasksToLocal() {
  localStorage.setItem("tasks", JSON.stringify(tasksArr));
}

function getTasksfromLocal() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function addTask() {
  var task = {
    status: statusInput.value,
    category: categoryInput.value,
    title: titleInput.value,
    description: descriptionInput.value,
    bgColor: "#0d1117",
  };

  tasksArr.push(task);
  setTasksToLocal();
  displayTask(tasksArr.length - 1);
  clearForm();
  hideModal();
}

function displayTask(index) {
  var taskHTML = `
  <div class="task" style="background-color: ${tasksArr[index].bgColor}">
    <h3 class="text-capitalize">${tasksArr[index]?.title}</h3>
    <p class="description text-capitalize">${tasksArr[index]?.description}</p>
    <h4 class="category ${tasksArr[index]?.category} text-capitalize">${tasksArr[index]?.category}</h4>
    <ul class="task-options list-unstyled d-flex gap-3 fs-5 m-0">
      <li><i class="bi bi-pencil-square" onclick="getTaskInfo(${index})"></i></li>
      <li><i class="bi bi-trash-fill" onclick="deleteTask(${index})"></i></li>
      <li><i class="bi bi-palette-fill" onclick="changeTaskBackground(event, ${index})"></i></li>
    </ul>
  </div>
  `;

  containers[tasksArr[index].status].querySelector(".tasks").innerHTML +=
    taskHTML;
  increaseCounters(tasksArr[index]?.status);
}

function displayAllTasks() {
  for (var i = 0; i < tasksArr.length; i++) {
    displayTask(i);
  }
}

function increaseCounters(status) {
  countersEl[status].innerHTML = +countersEl[status].innerHTML + 1;
}

function clearForm() {
  statusInput.value = "nextUp";
  categoryInput.value = "education";
  titleInput.value = "";
  descriptionInput.value = "";
}

function deleteTask(index) {
  tasksArr.splice(index, 1);
  setTasksToLocal();
  resetContainers();
  resetCounters();
  displayAllTasks();
}

function resetContainers() {
  for (var key in containers) {
    containers[key].querySelector(".tasks").innerHTML = "";
  }
}

function resetCounters() {
  for (var key in countersEl) {
    countersEl[key].innerHTML = 0;
  }

  for (var key in counters) {
    counters[key] = 0;
  }
}

function getTaskInfo(index) {
  showModal();
  statusInput.value = tasksArr[index].status;
  categoryInput.value = tasksArr[index].category;
  titleInput.value = tasksArr[index].title;
  descriptionInput.value = tasksArr[index].description;

  addBtn.classList.replace("d-block", "d-none");
  updateBtn.classList.replace("d-none", "d-block");
  updatedIndex = index;
}

function updateTask(updatedIndex) {
  tasksArr[updatedIndex].status = statusInput.value;
  tasksArr[updatedIndex].category = categoryInput.value;
  tasksArr[updatedIndex].title = titleInput.value;
  tasksArr[updatedIndex].description = descriptionInput.value;

  resetContainers();
  resetCounters();
  displayAllTasks();

  addBtn.classList.replace("d-none", "d-block");
  updateBtn.classList.replace("d-block", "d-none");
  clearForm();
  hideModal();
}

function generateRandomColor() {
  var color = "#";
  var hexCharsArr = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
  ];
  for (var i = 1; i <= 6; i++) {
    var random = hexCharsArr[Math.trunc(Math.random() * hexCharsArr.length)];
    color += random;
  }
  return `${color}55`;
}

function changeTaskBackground(event, index) {
  var newColor = generateRandomColor();
  tasksArr[index].bgColor = newColor;
  setTasksToLocal();
  event.currentTarget.closest(".task").style.backgroundColor = newColor;
}

function searchTasks() {
  resetContainers();
  resetCounters();
  const term = searchInput.value;
  for (var i = 0; i < tasksArr.length; i++) {
    if (
      tasksArr[i].title.toLowerCase().includes(term.toLowerCase()) ||
      tasksArr[i].category.toLowerCase().includes(term.toLowerCase())
    ) {
      displayTask(i);
    }
  }
}

// ^ >=========|> Events
// !### Show Modal on clicking on new Task Button
newTaskBtn.addEventListener("click", showModal);

// !### Hide Modal in 2 different ways
modalEl.addEventListener("click", function (event) {
  if (event.target === event.currentTarget) {
    hideModal();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.code === "Escape") {
    hideModal();
  }
});

// !### Add a new task
addBtn.addEventListener("click", addTask);
updateBtn.addEventListener("click", function () {
  updateTask(updatedIndex);
});

// !### Add reel time search
searchInput.addEventListener("input", searchTasks);
