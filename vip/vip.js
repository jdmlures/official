const container = document.getElementById("vip-products-container");

fetch("vip.json")
  .then(res => res.json())
  .then(data => {
    const products = data.vipProducts;
    products.forEach((item, idx) => {
      const section = document.createElement("section");
      section.className = "section vip-product";

      section.innerHTML = `
        <div class="container">
          <h2># V-${idx+1} ${item.title}</h2>

          <div class="price-buy-wrapper">
            <p>$${item.price}</p>
            <a href="${item.paypalLink}" class="paypal-btn" target="_blank">BUY</a>
          </div>

          <p>${item.description}</p>

          <div class="card-slider">
            ${item.images.map(img => `<div class="card"><img src="${img}" alt=""></div>`).join('')}
          </div>
        </div>
      `;

      container.appendChild(section);
    });
  })
  .catch(err => console.error("VIP JSON load error:", err));