// Utils (localStorage wrapper)
function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getFromStorage(key) {
  let data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

// Admin Data Keys
const usersKey = "earnweb_users";
const withdrawsKey = "earnweb_withdraws";
const tasksKey = "earnweb_tasks";

// Load all users, withdraws, tasks
let users = getFromStorage(usersKey) || [];
let withdraws = getFromStorage(withdrawsKey) || [];
let tasks = getFromStorage(tasksKey) || [];

// Save helpers
function saveUsers() {
  saveToStorage(usersKey, users);
}
function saveWithdraws() {
  saveToStorage(withdrawsKey, withdraws);
}
function saveTasks() {
  saveToStorage(tasksKey, tasks);
}

// Add Task
document.getElementById("addTaskForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const title = document.getElementById("taskTitle").value.trim();
  const reward = parseFloat(document.getElementById("taskReward").value);

  if (!title || isNaN(reward) || reward <= 0) {
    alert("Please enter valid task title and reward.");
    return;
  }

  const newTask = {
    id: Date.now(),
    title,
    reward
  };

  tasks.push(newTask);
  saveTasks();

  alert("Task added successfully!");
  document.getElementById("addTaskForm").reset();
  loadUsersTable();
  loadWithdrawsTable();
});

// Load Users Table (with IP count + Ban/Remove options)
function loadUsersTable() {
  const tbody = document.querySelector("#usersTable tbody");
  tbody.innerHTML = "";

  const ipMap = {};
  users.forEach(user => {
    if (user.ip) {
      ipMap[user.ip] = (ipMap[user.ip] || 0) + 1;
    }
  });

  users.forEach((user, index) => {
    const ipCount = ipMap[user.ip] || 1;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.email}${user.banned ? " 🚫" : ""}</td>
      <td>${user.ip || "N/A"} (${ipCount})</td>
      <td>৳${(user.balance || 0).toFixed(2)}</td>
      <td>${user.refCode || "-"}</td>
      <td>
        <button onclick="banUser(${index})">🛑 Ban</button>
        <button onclick="removeUser(${index})">🗑️ Remove</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Ban user
window.banUser = function(index) {
  users[index].banned = true;
  saveUsers();
  alert("User banned successfully!");
  loadUsersTable();
}

// Remove user
window.removeUser = function(index) {
  if (confirm("Are you sure to delete this user?")) {
    users.splice(index, 1);
    saveUsers();
    alert("User removed.");
    loadUsersTable();
  }
}

// Load Withdraw Requests Table
function loadWithdrawsTable() {
  const tbody = document.querySelector("#withdrawTable tbody");
  tbody.innerHTML = "";

  withdraws.forEach((wd, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${wd.email}</td>
      <td>৳${wd.amount.toFixed(2)}</td>
      <td>${wd.method}</td>
      <td>${wd.account}</td>
      <td>${wd.status}</td>
      <td>
        ${wd.status === "pending" ? 
          `<button onclick="approveWithdraw(${idx})">Approve</button>
           <button onclick="rejectWithdraw(${idx})">Reject</button>` 
          : "-"}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Approve Withdraw + Cut Balance
window.approveWithdraw = function(index) {
  if (!confirm("Are you sure to approve this withdraw request?")) return;

  const wd = withdraws[index];
  let user = users.find(u => u.email === wd.email);

  if (user) {
    if (user.balance >= wd.amount) {
      user.balance -= wd.amount;
      withdraws[index].status = "approved";
      saveUsers();
      saveWithdraws();
      alert("Withdraw approved and balance deducted.");
    } else {
      alert("User does not have enough balance.");
    }
  } else {
    alert("User not found.");
  }

  loadWithdrawsTable();
}

// Reject Withdraw + Refund balance
window.rejectWithdraw = function(index) {
  if (!confirm("Are you sure to reject this withdraw request?")) return;

  const wd = withdraws[index];
  if (wd.status !== "pending") return alert("Already processed.");

  wd.status = "rejected";

  let user = users.find(u => u.email === wd.email);
  if (user) {
    user.balance += wd.amount;
    saveUsers();
  }

  saveWithdraws();
  alert("Withdraw rejected and amount refunded.");
  loadWithdrawsTable();
}

// Logout
function adminLogout() {
  window.location.href = "index.html";
}

// Init
function initAdmin() {
  loadUsersTable();
  loadWithdrawsTable();
}

window.onload = initAdmin;
