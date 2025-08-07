// Load tasks from tasks.json and display them
async function loadTasks() {
  const taskList = document.getElementById("taskList");
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const completedTasks = JSON.parse(localStorage.getItem("taskComplete_" + user.email) || "[]");

  const response = await fetch("data/tasks.json");
  const tasks = await response.json();

  taskList.innerHTML = "";

  tasks.forEach(task => {
    const isCompleted = completedTasks.includes(task.id);
    const taskCard = document.createElement("div");
    taskCard.className = "task-card";
    taskCard.innerHTML = `
      <h4>${task.title}</h4>
      <p>${task.description}</p>
      ${task.link ? `<a href="${task.link}" target="_blank">🌐 Visit</a><br>` : ""}
      <button ${isCompleted ? "disabled" : ""} onclick="completeTask(${task.id}, ${task.reward})">
        ✅ ${isCompleted ? "Completed" : `Complete & Earn ৳${task.reward}`}
      </button>
    `;
    taskList.appendChild(taskCard);
  });
}

// Task complete system
function completeTask(taskId, reward) {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  let completed = JSON.parse(localStorage.getItem("taskComplete_" + user.email) || "[]");

  if (completed.includes(taskId)) return alert("Already completed!");

  completed.push(taskId);
  localStorage.setItem("taskComplete_" + user.email, JSON.stringify(completed));

  // Update user balance
  let users = JSON.parse(localStorage.getItem("users") || "[]");
  const index = users.findIndex(u => u.email === user.email);
  if (index !== -1) {
    users[index].balance += reward;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedInUser", JSON.stringify(users[index]));
    document.getElementById("userBalance").innerText = "৳ " + users[index].balance;
  }

  loadTasks(); // Reload tasks to disable completed
  alert("🎉 Task Completed! ৳" + reward + " added!");
}

// Load user info
function loadUserData() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) return location.href = "index.html";

  document.getElementById("userBalance").innerText = "৳ " + user.balance;
  document.getElementById("refLink").innerText = window.location.origin + "/register.html?ref=" + user.refCode;
  document.getElementById("refCount").innerText = user.referrals || 0;
}

// Logout
function logout() {
  localStorage.removeItem("loggedInUser");
  location.href = "index.html";
}

// Load everything when page loads
window.onload = function () {
  loadUserData();
  loadTasks();
};
