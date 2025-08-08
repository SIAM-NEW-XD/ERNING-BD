// যেই ইউজারের ডেটা দেখাতে চাস, তার email/userID আগে থেকেই ধর
const defaultUser = "user@gmail.com"; // ইচ্ছামত পরিবর্তন কর

// ডেটা লোড করে দেখাও
const userData = JSON.parse(localStorage.getItem(defaultUser));
if (userData) {
  document.getElementById("usernameDisplay").textContent = defaultUser;
  document.getElementById("balanceDisplay").textContent = userData.balance || 0;
} else {
  document.getElementById("usernameDisplay").textContent = "No user found";
  document.getElementById("balanceDisplay").textContent = "0";
}
