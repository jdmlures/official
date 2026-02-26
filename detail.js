// URLからid取得
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"), 10);

fetch("../package.json")
  .then(res => res.json())
  .then(data => {
    const item = data.packages.find(p => p.id === id);
    if (!item) return console.warn("Item not found in JSON");

    const basePath = "../"; // detail.html から画像表示用パス補正

    // 画像差し替え
    document.getElementById("detail-hero-img").src = basePath + item.image;
    if (item.images && item.images.length) {
      if (item.images[0]) document.getElementById("detail-img-1").src = basePath + item.images[0];
      if (item.images[1]) document.getElementById("detail-img-2").src = basePath + item.images[1];
      if (item.images[2]) document.getElementById("detail-img-3").src = basePath + item.images[2];
    }

    // タイトル・価格・説明文
    document.getElementById("detail-title").textContent = `Package #${item.package}`;
    document.getElementById("detail-price").textContent = `$ ${item.price}`;
    document.getElementById("detail-desc").textContent = item.description || "No description available";

    // PayPalボタン描画（上下2箇所）
    const renderPayPalButton = (containerId) => {
      paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', label: 'paypal', height: 48 },
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: { value: item.price.toString() },
              description: item.title
            }]
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then(details => {
            alert("Payment completed by " + details.payer.name.given_name);
            // 購入後のUI反映
            markAsPurchased(item.id);
          });
        }
      }).render(`#${containerId}`);
    };

    renderPayPalButton("paypal-button-container");       // 上部
    renderPayPalButton("paypal-button-container-bottom"); // 下部
  })
  .catch(err => console.error("Failed to load JSON:", err));


// 購入済みマーク用
function markAsPurchased(id) {
  // HERO非表示
  const hero = document.getElementById("detail-hero-img");
  if (hero) hero.style.display = "none";

  // 上下BUYボタン非表示
  const buttons = [
    document.getElementById("paypal-button-container"),
    document.getElementById("paypal-button-container-bottom")
  ];
  buttons.forEach(btn => { if (btn) btn.style.display = "none"; });

  // ここで必要なら localStorage に購入済みフラグも保存可能
  localStorage.setItem(`purchased_${id}`, "true");
}