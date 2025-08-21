document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
  const taskInput = document.getElementById("task");
  const timeInput = document.getElementById("reminderTime");
  const categoryInput = document.getElementById("category");

  const taskText = taskInput.value.trim();
  const reminderTime = new Date(timeInput.value);
  const category = categoryInput.value;

  if (!taskText || !timeInput.value) {
    alert("Isi tugas dan waktu pengingat!");
    return;
  }

  const task = {
    text: taskText,
    time: reminderTime.toISOString(),
    category: category,
    completed: false
  };

  saveTask(task);
  renderTasks();
  scheduleReminder(task);

  taskInput.value = "";
  timeInput.value = "";
}

function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  tasks.sort((a, b) => new Date(a.time) - new Date(b.time));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    const span = document.createElement("span");
    span.textContent = `[${task.category}] ${task.text} (${new Date(task.time).toLocaleString()})`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.onchange = () => toggleComplete(index);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.onclick = () => deleteTask(index);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

function toggleComplete(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function deleteTask(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function clearAll() {
  localStorage.removeItem("tasks");
  renderTasks();
}

function loadTasks() {
  renderTasks();
}

function searchTask() {
  const keyword = document.getElementById("search").value.toLowerCase();
  const listItems = document.querySelectorAll("#taskList li");
  listItems.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(keyword) ? "" : "none";
  });
}

function scheduleReminder(task) {
  const now = new Date().getTime();
  const delay = new Date(task.time).getTime() - now;
  if (delay > 0) {
    setTimeout(() => {
      showNotification(task.text);
    }, delay);
  }
}

function showNotification(message) {
    const alarm= document.getElementById("alarmSound");
  alarm.play();
  if (Notification.permission === "granted") {
    new Notification("⏰ Pengingat Tugas", { body: message });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification("⏰ Pengingat Tugas", { body: message });
      }
    });
  }
}
