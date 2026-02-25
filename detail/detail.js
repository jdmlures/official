// URLからid取得
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"), 10);

fetch("../package.json")
  .then(res => res.json())
  .then(data => {
    const item = data.packages.find(p => p.id === id);
    if(item){
      const basePath = "../"; // detail.html から index.html 基準の image を表示するための補正

      // 画像差し替え
      document.getElementById("detail-hero-img").src = basePath + item.image;
      if(item.images && item.images.length){
        if(item.images[0]) document.getElementById("detail-img-1").src = basePath + item.images[0];
        if(item.images[1]) document.getElementById("detail-img-2").src = basePath + item.images[1];
        if(item.images[2]) document.getElementById("detail-img-3").src = basePath + item.images[2];
      }

      // タイトル・価格・説明文
      document.getElementById("detail-title").textContent = `Package #${item.package}`;
      document.getElementById("detail-price").textContent = `$ ${item.price}`;
      document.getElementById("detail-desc").textContent = item.description || "No description available";

      // BUYリンク更新
      const buyBtns = [
        document.getElementById("detail-buy-btn"),
        document.getElementById("detail-buy-btn-bottom")
      ];
      buyBtns.forEach(btn => {
        btn.href = `https://www.paypal.com/uk/digital-wallet/ways-to-pay/credit-services?amount=${item.price}`;
      });
    } else {
      console.warn("Item not found in JSON");
    }
  })
  .catch(err => console.error("Failed to load JSON:", err));