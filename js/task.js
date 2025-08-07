// Simulated tasks (normally from tasks.json)
const tasks = [
  { id: 1, title: "Visit Website", reward: 10 },
  { id: 2, title: "Watch Video", reward: 20 },
  { id: 3, title: "Download App", reward: 30 }
];

// Register
function registerUser() {
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  if (!email || !password) return alert("Fill all fields!");

  let users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.find(u => u.email === email)) return alert("User exists!");

  users.push({ email, password, balance: 0 });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Registered! Now login.");
  window.location.href = "index.html";
}

// Login
function loginUser() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  let users = JSON.parse(localStorage.getItem("users") || "[]");
  let user = users.find(u => u.email === email && u.password === password);
  if (!user) return alert("Invalid credentials!");

  localStorage.setItem("loggedInUser", email);
  window.location.href = "dashboard.html";
}

// Dashboard
function loadDashboard() {
  const email = localStorage.getItem("loggedInUser");
  if (!email) return window.location.href = "index.html";

  let users = JSON.parse(localStorage.getItem("users") || "[]");
  let user = users.find(u => u.email === email);
  if (!user) return;

  document.getElementById("userEmail").innerText = email;
  document.getElementById("userBalance").innerText = user.balance;

  let completed = JSON.parse(localStorage.getItem("task_complete") || "{}");
  let completedTasks = completed[email] || [];

  let taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  tasks.forEach(task => {
    let li = document.createElement("li");
    li.innerText = `${task.title} - ${task.reward}৳ `;

    let btn = document.createElement("button");
    if (completedTasks.includes(task.id)) {
      btn.innerText = "Completed";
      btn.disabled = true;
    } else {
      btn.innerText = "Do Task";
      btn.onclick = () => completeTask(task.id);
    }

    li.appendChild(btn);
    taskList.appendChild(li);
  });
}

function completeTask(taskId) {
  const email = localStorage.getItem("loggedInUser");
  let users = JSON.parse(localStorage.getItem("users") || "[]");
  let userIndex = users.findIndex(u => u.email === email);
  if (userIndex === -1) return;

  const task = tasks.find(t => t.id === taskId);
  users[userIndex].balance += task.reward;

  localStorage.setItem("users", JSON.stringify(users));

  let completed = JSON.parse(localStorage.getItem("task_complete") || "{}");
  if (!completed[email]) completed[email] = [];
  completed[email].push(taskId);
  localStorage.setItem("task_complete", JSON.stringify(completed));

  alert(`Task Complete! You earned ${task.reward}৳`);
  loadDashboard();
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

// Auto load dashboard if on dashboard.html
if (window.location.pathname.includes("dashboard.html")) {
  window.onload = loadDashboard;
}
