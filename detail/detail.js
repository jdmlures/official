// ====================== UTILS ======================
function getFlagEmoji(code){
  if(!code) return "";
  code = code.toUpperCase();
  const offset = 0x1F1E6 - 'A'.charCodeAt(0);
  return String.fromCodePoint(code.charCodeAt(0)+offset, code.charCodeAt(1)+offset);
}

function getQueryParam(param){
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// ====================== DETAIL DISPLAY ======================
function renderDetail(item){
  if(!item) return;

  // HTML直書きで管理する場合は salesImages は無視
  document.getElementById("detail-title").textContent = `Package #${item.package}`;
  document.getElementById("detail-price").textContent = `$${item.price}`;
  document.getElementById("detail-desc").textContent = item.description;

  // HERO画像
  const heroImg = document.getElementById("detail-hero-img");
  if(heroImg) heroImg.src = item.image;

  // salesImages 自動描画は無効化済み
  /*
  const container = document.getElementById("additional-images-container");
  if(container && item.salesImages){
    container.innerHTML = "";
    item.salesImages.forEach((src, i)=>{
      const div = document.createElement("div");
      div.className = "container";
      const img = document.createElement("img");
      img.src = src;
      img.alt = `Detail image ${i+1}`;
      div.appendChild(img);
      container.appendChild(div);
    });
  }
  */

  // PayPalボタン描画
  renderPayPalButton(item.price, "paypal-button-container");
  renderPayPalButton(item.price, "paypal-button-container-bottom");
}

// ====================== PAYPAL ======================
function renderPayPalButton(amount, containerId){
  const container = document.getElementById(containerId);
  if(!container) return;

  container.innerHTML = "";
  paypal.Buttons({
    createOrder: function(data, actions){
      return actions.order.create({
        purchase_units: [{ amount: { value: amount } }]
      });
    },
    onApprove: function(data, actions){
      return actions.order.capture().then(function(details){
        alert("Transaction completed by " + details.payer.name.given_name);
        localStorage.setItem("purchased", "true");
      });
    }
  }).render(`#${containerId}`);
}

// ====================== INIT ======================
const packageId = parseInt(getQueryParam("id")) || 6; // デフォルト 6

fetch("../package.json")
  .then(res => res.json())
  .then(data => {
    const item = data.packages.find(p => p.id === packageId);
    renderDetail(item);
  })
  .catch(err => {
    console.error("Failed to load package.json", err);
  });