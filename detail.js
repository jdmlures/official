// ====================== URL PARAMS ======================
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"), 10);

// ====================== LOAD PACKAGE DATA ======================
fetch("../package.json")
  .then(res => res.json())
  .then(data => {
    const item = data.packages.find(p => p.id === id);
    if (!item) return console.warn("Item not found in JSON");

    const basePath = "../";

    // 画像差し替え
    document.getElementById("detail-hero-img").src = basePath + item.image;
    if (item.images && item.images.length) {
      if (item.images[0]) document.getElementById("detail-img-1").src = basePath + item.images[0];
      if (item.images[1]) document.getElementById("detail-img-2").src = basePath + item.images[1];
      if (item.images[2]) document.getElementById("detail-img-3").src = basePath + item.images[2];
    }

    // タイトル・価格・説明
    document.getElementById("detail-title").textContent = `Package #${item.package}`;
    document.getElementById("detail-price").textContent = `$ ${item.price}`;
    document.getElementById("detail-desc").textContent = item.description || "No description available";

    // ====================== PayPal BUTTON ======================
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
            markAsPurchased(item.id);
          });
        }
      }).render(`#${containerId}`);
    };

    renderPayPalButton("paypal-button-container");
    renderPayPalButton("paypal-button-container-bottom");
  })
  .catch(err => console.error("Failed to load JSON:", err));

// ====================== PURCHASE HANDLER ======================
function markAsPurchased(id) {
  // トップページ HERO 非表示
  const heroSlide = document.getElementById(`hero-slide-${id}`);
  if(heroSlide) heroSlide.style.display = "none";

  // 詳細ページ HERO 非表示
  const heroImg = document.getElementById("detail-hero-img");
  if(heroImg) heroImg.style.display = "none";

  // 上下 PayPal ボタン非表示
  const buttons = [
    document.getElementById("paypal-button-container"),
    document.getElementById("paypal-button-container-bottom")
  ];
  buttons.forEach(btn => { if(btn) btn.style.display = "none"; });

  // localStorage に購入済みフラグ
  localStorage.setItem(`purchased_${id}`, "true");
}