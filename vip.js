document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"), 10) || 1;

  fetch("vip.json")
    .then(res => res.json())
    .then(data => {
      const item = data.find(i => i.id === id);
      if (!item) return;

      // 番号 + 商品名
      document.getElementById("detail-title").textContent = `# ${item.number} ${item.name}`;

      // 価格
      document.getElementById("detail-price").textContent = `$ ${item.price}`;

      // 説明
      document.getElementById("detail-desc").textContent = item.desc;

      // メイン画像
      document.getElementById("detail-hero-img").src = item.hero_img;

      // サブ画像
      item.imgs.forEach((src, index) => {
        const imgEl = document.getElementById(`detail-img-${index}`);
        if (imgEl) imgEl.src = src;
      });

      // BUYボタンリンク
      const buyBtns = document.querySelectorAll("#detail-buy-btn, #detail-buy-btn-bottom");
      buyBtns.forEach(btn => btn.href = item.paypal_link);
    })
    .catch(err => console.error("VIP JSON load error:", err));
});