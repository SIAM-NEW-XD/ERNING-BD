// Utils
function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function getFromStorage(key) {
  let data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

// ====== REGISTER USER FUNCTION =======
function registerUser(name, email, password, ip = "N/A", refCode = "") {
  let users = getFromStorage("earnweb_users") || [];

  // Check if email exists
  if(users.find(u => u.email === email)) {
    alert("Email already registered!");
    return false;
  }

  const newUser = {
    name: name.trim(),
    email: email.trim(),
    password: password,  // ভালো হলে hash করবে
    ip: ip,
    balance: 0,
    refCode: refCode,
    tasks: [],
    banned: false,
    createdAt: new Date().toLocaleString()
  };

  users.push(newUser);
  saveToStorage("earnweb_users", users);
  alert("Registration successful!");
  return true;
}

// ======= LOGGED IN USER =======
let user = getFromStorage("loggedInUser");
if (!user) {
  alert("Please login first!");
  window.location.href = "index.html";
}

// ======= WITHDRAW REQUEST =======
function sendWithdrawRequest(amount, method, account) {
  if (amount <= 0 || !method || !account) {
    alert("Please fill all withdraw details!");
    return false;
  }
  
  if (user.balance < amount) {
    alert("Insufficient balance!");
    return false;
  }
  
  const withdrawRequest = {
    email: user.email,
    amount: amount,
    method: method,
    account: account,
    status: "pending",
    requestDate: new Date().toLocaleString()
  };
  
  let withdraws = getFromStorage("earnweb_withdraws") || [];
  withdraws.push(withdrawRequest);
  saveToStorage("earnweb_withdraws", withdraws);
  
  alert("Withdraw request sent! Waiting for approval.");
  return true;
}

// ======= GIFT CODE CLAIM =======
function claimGiftCode(code) {
  code = code.trim().toUpperCase();
  if (!code) {
    alert("Please enter a gift code!");
    return false;
  }
  
  let giftCodes = getFromStorage("giftCodes") || {};
  
  if (!giftCodes[code]) {
    alert("Invalid gift code!");
    return false;
  }
  
  let gift = giftCodes[code];
  if (gift.claimed >= gift.limit) {
    alert("Gift code claim limit reached!");
    return false;
  }
  
  gift.claimed = (gift.claimed || 0) + 1;
  giftCodes[code] = gift;
  saveToStorage("giftCodes", giftCodes);
  
  // Add to user balance & sync with users DB
  user.balance = (parseFloat(user.balance) || 0) + parseFloat(gift.amount);
  saveToStorage("loggedInUser", user);
  
  let users = getFromStorage("earnweb_users") || [];
  const idx = users.findIndex(u => u.email === user.email);
  if (idx !== -1) {
    users[idx].balance = user.balance;
    saveToStorage("earnweb_users", users);
  }
  
  alert(`Congrats! You got ৳${gift.amount} added to your balance.`);
  return true;
}

// ======= FORMS EVENT LISTENERS =======
document.getElementById("withdrawForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const amount = parseFloat(document.getElementById("withdrawAmount").value);
  const method = document.getElementById("withdrawMethod").value.trim();
  const account = document.getElementById("withdrawAccount").value.trim();
  
  if(sendWithdrawRequest(amount, method, account)) {
    this.reset();
    // update balance UI if needed
    document.getElementById("userBalance").innerText = `৳${user.balance.toFixed(2)}`;
  }
});

document.getElementById("giftCodeForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const code = document.getElementById("giftCodeInput").value;
  
  if(claimGiftCode(code)) {
    this.reset();
    document.getElementById("userBalance").innerText = `৳${user.balance.toFixed(2)}`;
  }
});

// ======= UPDATE BALANCE ON PAGE LOAD =======
document.addEventListener("DOMContentLoaded", () => {
  const balanceEl = document.getElementById("userBalance");
  if (balanceEl && user.balance !== undefined) {
    balanceEl.innerText = `৳${parseFloat(user.balance).toFixed(2)}`;
  }
});
