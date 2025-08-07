// ইউজারের ব্যালেন্স যোগ ফাংশন
document.getElementById("balanceForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("userEmail").value.trim();
  const amount = parseInt(document.getElementById("amountToAdd").value);

  if (!email || isNaN(amount)) {
    alert("সঠিক Email এবং Amount দিন!");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const index = users.findIndex((u) => u.email === email);

  if (index === -1) {
    alert("ইউজার খুঁজে পাওয়া যায়নি!");
    return;
  }

  users[index].balance = (users[index].balance || 0) + amount;
  localStorage.setItem("users", JSON.stringify(users));
  alert(`✅ ${email} একাউন্টে ${amount} টাকা যোগ হয়েছে`);
  this.reset();
});

// 🎁 Gift Code জেনারেট ফাংশন
document.getElementById("giftCodeForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const code = document.getElementById("giftCode").value.trim();
  const amount = parseInt(document.getElementById("giftAmount").value);
  const limit = parseInt(document.getElementById("claimLimit").value);

  if (!code || isNaN(amount) || isNaN(limit)) {
    alert("সব ফিল্ড পূরণ করুন!");
    return;
  }

  let giftCodes = JSON.parse(localStorage.getItem("giftCodes")) || [];
  const exists = giftCodes.find((g) => g.code === code);

  if (exists) {
    alert("এই কোডটি আগে থেকেই আছে!");
    return;
  }

  giftCodes.push({ code, amount, limit, claimed: 0 });
  localStorage.setItem("giftCodes", JSON.stringify(giftCodes));
  alert("✅ গিফট কোড তৈরি হয়েছে!");
  this.reset();
});

// ⏳ অটো ডিলিট: যেসব গিফট কোডে limit শেষ
function cleanExpiredGiftCodes() {
  let giftCodes = JSON.parse(localStorage.getItem("giftCodes")) || [];
  giftCodes = giftCodes.filter((g) => g.claimed < g.limit);
  localStorage.setItem("giftCodes", JSON.stringify(giftCodes));
}
cleanExpiredGiftCodes();
