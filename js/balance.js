// Check if user is logged in
const currentUser = localStorage.getItem('currentUser');

if (!currentUser) {
  alert("Please login first.");
  window.location.href = "index.html"; // redirect to login page
} else {
  const userData = JSON.parse(localStorage.getItem(currentUser));
  document.getElementById("usernameDisplay").textContent = currentUser;
  document.getElementById("balanceDisplay").textContent = userData.balance || 0;
}
