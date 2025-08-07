// Sample gift code data (replace with real DB in future)
let giftCodes = JSON.parse(localStorage.getItem("giftCodes") || '{}');

function claimGift() {
  const inputCode = document.getElementById("giftCodeInput").value.trim();
  const msg = document.getElementById("giftMsg");

  if (giftCodes[inputCode]) {
    let data = giftCodes[inputCode];
    if (data.claimed >= data.limit) {
      msg.innerText = "❌ Claim limit reached!";
    } else {
      let currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser) {
        msg.innerText = "❌ Please log in first.";
        return;
      }

      currentUser.balance = (currentUser.balance || 0) + data.amount;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      data.claimed++;
      giftCodes[inputCode] = data;
      localStorage.setItem("giftCodes", JSON.stringify(giftCodes));

      msg.innerText = `✅ ${data.amount}৳ added to your account!`;
    }
  } else {
    msg.innerText = "❌ Invalid Gift Code.";
  }
}
