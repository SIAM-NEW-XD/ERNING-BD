// Check login status
const currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
  alert("Please login first.");
  window.location.href = "index.html";
} else {
  // Show username
  document.getElementById("usernameDisplay").textContent = currentUser;

  // Show balance immediately
  showBalance();

  // Check balance button click
  document.getElementById("checkBalanceBtn").addEventListener("click", showBalance);
}

// Function to get and show balance
function showBalance() {
  const currentUser = localStorage.getItem('currentUser');
  const userData = JSON.parse(localStorage.getItem(currentUser));
  const balance = userData.balance || 0;
  document.getElementById("balanceDisplay").textContent = balance;
}
