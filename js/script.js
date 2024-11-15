// Move tasks, saveTasks, and renderTasks to the global scope for accessibility
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(filter = "all") {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = ""; // Clear current tasks

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task");
    if (task.completed) taskItem.classList.add("completed");

    taskItem.innerHTML = `
      <span>${index +1}.${task.text}</span>
      <button class='complete' onclick="toggleComplete(${index})">${task.completed ? "Undo" : "Complete"}</button>
      <button class='delete' onclick="deleteTask(${index})">Delete</button>
    `;
    taskList.appendChild(taskItem);
  });
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks("all");
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks("all");
}

document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const clearCompletedBtn = document.getElementById("clearCompletedBtn");

  // Initial render of tasks on page load
  renderTasks();

  addTaskBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
      tasks.push({ text: taskText, completed: false });
      saveTasks();
      renderTasks("all");
      taskInput.value = ""; // Clear input
    }
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter");
      renderTasks(filter);
    });
  });

  clearCompletedBtn.addEventListener("click", () => {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    renderTasks("all");
  });
});

  