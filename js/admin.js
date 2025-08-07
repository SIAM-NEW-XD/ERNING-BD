// Utils
function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function getFromStorage(key) {
  let data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

// Load all data
let users = getFromStorage("earnweb_users") || [];
let withdraws = getFromStorage("earnweb_withdraws") || [];

// Save helpers
function saveUsers() {
  saveToStorage("earnweb_users", users);
}
function saveWithdraws() {
  saveToStorage("earnweb_withdraws", withdraws);
}

// Load Users Table
function loadUsersTable() {
  const tbody = document.querySelector("#usersTable tbody");
  tbody.innerHTML = "";

  // IP count map (for showing number of accounts from same IP)
  const ipMap = {};
  users.forEach(user => {
    if(user.ip) ipMap[user.ip] = (ipMap[user.ip] || 0) + 1;
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
  if(confirm("Are you sure to delete this user?")) {
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

// Approve Withdraw Request and Deduct User Balance
window.approveWithdraw = function(index) {
  if(!confirm("Are you sure to approve this withdraw request?")) return;

  const wd = withdraws[index];
  let userIndex = users.findIndex(u => u.email === wd.email);

  if(userIndex !== -1) {
    if(users[userIndex].balance >= wd.amount) {
      users[userIndex].balance -= wd.amount;
      wd.status = "approved";
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
  loadUsersTable();
}

// Reject Withdraw Request
window.rejectWithdraw = function(index) {
  if(!confirm("Are you sure to reject this withdraw request?")) return;

  const wd = withdraws[index];
  if(wd.status !== "pending") {
    alert("Already processed.");
    return;
  }
  wd.status = "rejected";
  saveWithdraws();
  alert("Withdraw rejected.");
  loadWithdrawsTable();
}

// Logout
function adminLogout() {
  window.location.href = "index.html";
}

// Initialization on page load
window.onload = function() {
  loadUsersTable();
  loadWithdrawsTable();
};
