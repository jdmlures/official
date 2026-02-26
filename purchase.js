// purchase.js
// --- 購入済み管理 ---
function markAsPurchased(id) {
  const purchased = JSON.parse(localStorage.getItem("purchased") || "[]");
  if (!purchased.includes(id)) purchased.push(id);
  localStorage.setItem("purchased", JSON.stringify(purchased));
  updateUI(id);
}

// --- UI 更新 ---
function updateUI(id) {
  // トップページ HEROスライド非表示
  const heroSlide = document.querySelector(`#hero-slide-${id}`);
  if (heroSlide) heroSlide.style.display = "none";

  // detailページ購入ボタン非表示
  const buyBtnTop = document.querySelector("#paypal-button-container");
  const buyBtnBottom = document.querySelector("#paypal-button-container-bottom");
  if (buyBtnTop) buyBtnTop.style.display = "none";
  if (buyBtnBottom) buyBtnBottom.style.display = "none";
}

// --- ページロード時に反映 ---
document.addEventListener("DOMContentLoaded", function () {
  const purchased = JSON.parse(localStorage.getItem("purchased") || "[]");
  purchased.forEach((id) => updateUI(id));
});