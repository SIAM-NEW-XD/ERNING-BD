

// ===== Utils =====
function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getFromStorage(key) {
  let data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

// ===== Auth =====
const usersKey = "earnweb_users";
const sessionKey = "earnweb_session";

// Load users from localStorage or init empty
let users = getFromStorage(usersKey) || [];

// Save users back
function saveUsers() {
  saveToStorage(usersKey, users);
}

// Register User
document.getElementById("registerForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("regEmail").value.trim().toLowerCase();
  const password = document.getElementById("regPassword").value.trim();
  const ref = document.getElementById("regRef").value.trim();

  if (users.find(u => u.email === email)) {
    alert("⚠️ User already registered!");
    return;
  }

  let newUser = {
    email,
    password,
    balance: 0,
    refCode: ref || "",
    referrals: 0,
    tasksCompleted: 0,
    ip: "N/A" // Could implement real IP fetch if wanted
  };
  users.push(newUser);
  saveUsers();
  alert("✅ Registration successful! Please login.");
  window.location.href = "index.html";
});

// Login User
document.getElementById("loginForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value.trim();

  let user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    alert("❌ Invalid email or password!");
    return;
  }
  saveToStorage(sessionKey, user.email);
  window.location.href = "dashboard.html";
});

// Logout Function
function logout() {
  localStorage.removeItem(sessionKey);
  window.location.href = "index.html";
}

// ===== Dashboard =====
function loadDashboard() {
  const email = getFromStorage(sessionKey);
  if (!email) {
    window.location.href = "index.html";
    return;
  }
  const user = users.find(u => u.email === email);
  if (!user) {
    alert("User session invalid. Please login again.");
    logout();
    return;
  }

  // Show balance
  document.getElementById("userBalance").innerText = `৳ ${user.balance.toFixed(2)}`;

  // Show referral link
  const refLink = `${window.location.origin}/register.html?ref=${encodeURIComponent(email)}`;
  document.getElementById("refLink").innerText = refLink;

  // Show referral count
  document.getElementById("refCount").innerText = user.referrals || 0;

  // Load tasks
  fetch("tasks.json")
    .then(res => res.json())
    .then(tasks => {
      const taskList = document.getElementById("taskList");
      taskList.innerHTML = "";
      tasks.forEach(task => {
        const isCompleted = getFromStorage(`task_${email}_${task.id}`) || false;
        const btn = document.createElement("button");
        btn.innerText = isCompleted ? "✅ Completed" : `Complete (+৳${task.reward})`;
        btn.disabled = isCompleted;
        btn.addEventListener("click", () => {
          // Mark task completed
          saveToStorage(`task_${email}_${task.id}`, true);
          user.balance += task.reward;
          user.tasksCompleted++;
          saveUsers();
          loadDashboard(); // refresh UI
          alert(`Task completed! +৳${task.reward} added to your balance.`);
        });
        const taskDiv = document.createElement("div");
        taskDiv.className = "task-item";
        taskDiv.innerHTML = `<strong>${task.title}</strong>`;
        taskDiv.appendChild(btn);
        taskList.appendChild(taskDiv);
      });
    })
    .catch(() => {
      document.getElementById("taskList").innerText = "No tasks available right now.";
    });
}

// Call loadDashboard only on dashboard page
if (document.body.classList.contains("dashboard-page")) {
  loadDashboard();
}

// ===== Withdraw =====
document.getElementById("withdrawForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const email = getFromStorage(sessionKey);
  if (!email) {
    alert("Please login first.");
    window.location.href = "index.html";
    return;
  }
  const user = users.find(u => u.email === email);

  const amount = parseFloat(document.getElementById("amount").value);
  const method = document.getElementById("method").value;
  const account = document.getElementById("account").value.trim();

  if (isNaN(amount) || amount < 500) {
    alert("Minimum withdraw amount is ৳500");
    return;
  }
  if (!method) {
    alert("Please select withdraw method");
    return;
  }
  if (!account) {
    alert("Please enter your account number");
    return;
  }
  if (user.balance < amount) {
    alert("Insufficient balance");
    return;
  }

  // Save withdraw request locally (withdraws.json simulation using localStorage)
  let withdraws = getFromStorage("earnweb_withdraws") || [];
  withdraws.push({
    email,
    amount,
    method,
    account,
    status: "pending",
    date: new Date().toISOString()
  });
  saveToStorage("earnweb_withdraws", withdraws);

  // Deduct balance
  user.balance -= amount;
  saveUsers();

  alert("Withdraw request submitted. Admin will process it soon.");
  window.location.href = "dashboard.html";
});