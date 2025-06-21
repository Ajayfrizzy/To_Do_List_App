// Initialize tasks and dark mode from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let darkMode = localStorage.getItem("darkMode") === "true";

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Toggle dark mode and save preference
function toggleDarkMode() {
    darkMode = !darkMode;
    localStorage.setItem("darkMode", darkMode);
    updateTheme();
}

// Update the theme based on darkMode state
function updateTheme() {
    if (darkMode) {
        document.body.classList.add("dark-mode");
        document.getElementById("themeToggle").textContent = "☀️";
    } else {
        document.body.classList.remove("dark-mode");
        document.getElementById("themeToggle").textContent = "🌙";
    }
}

// Render tasks with optional filtering
function renderTasks(filter = "all") {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    // Filter tasks based on current filter
    const filteredTasks = filter === "all" ? tasks : tasks.filter((task) => {
        if (filter === "completed") return task.completed;
        if (filter === "pending") return !task.completed;
        return true;
    });

    // Create task items
    filteredTasks.forEach((task, index) => {
        const taskItem = document.createElement("li");
        taskItem.classList.add("task");
        if (task.completed) taskItem.classList.add("completed");

        taskItem.innerHTML = `
            <span>${index + 1}. ${task.text}</span>
            <button class='complete' onclick="toggleComplete(${index})">
                ${task.completed ? "Undo" : "Complete"}
            </button>
            <button class='delete' onclick="deleteTask(${index})">Delete</button>
        `;
        taskList.appendChild(taskItem);
    });
}

// Toggle task completion status
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    // Maintain current filter view
    const activeFilter = document.querySelector(".filter-btn.active")?.dataset.filter || "all";
    renderTasks(activeFilter);
}

// Delete a task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    // Maintain current filter view
    const activeFilter = document.querySelector(".filter-btn.active")?.dataset.filter || "all";
    renderTasks(activeFilter);
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const clearCompletedBtn = document.getElementById("clearCompletedBtn");
    const themeToggle = document.getElementById("themeToggle");

    // Initialize theme and tasks
    updateTheme();
    renderTasks();

    // Set 'All' as default active filter
    document.querySelector('[data-filter="all"]').classList.add("active");

    // Theme toggle event
    themeToggle.addEventListener("click", toggleDarkMode);

    // Add task event
    addTaskBtn.addEventListener("click", () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            tasks.push({ text: taskText, completed: false });
            saveTasks();
            const activeFilter = document.querySelector(".filter-btn.active")?.dataset.filter || "all";
            renderTasks(activeFilter);
            taskInput.value = "";
            taskInput.focus();
        }
    });

    // Add task on Enter key
    taskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            addTaskBtn.click();
        }
    });

    // Filter buttons events
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            const filter = button.getAttribute("data-filter");
            renderTasks(filter);
        });
    });

    // Clear completed tasks
    clearCompletedBtn.addEventListener("click", () => {
        tasks = tasks.filter((task) => !task.completed);
        saveTasks();
        const activeFilter = document.querySelector(".filter-btn.active")?.dataset.filter || "all";
        renderTasks(activeFilter);
    });
});