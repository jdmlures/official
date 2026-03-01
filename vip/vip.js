fetch("vip.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("vip-container");
    container.innerHTML = "";

    data.packages.forEach(pkg => {
      if (pkg.sold) return; // 売り切れは非表示

      // ブランドリスト作成（要素があれば）
      let brandList = "";
      if (pkg.brands && pkg.brands.length > 0) {
        brandList = `<ul class="brand-list">
          ${pkg.brands.map(b => `<li>${b}</li>`).join("")}
        </ul>`;
      }

      // 商品セクション生成
      const section = document.createElement("section");
      section.className = "section vip-product";
      section.innerHTML = `
        <div class="container">
          <h2>${pkg.title}</h2>

          <div class="price-buy-wrapper">
            <p class="price">$${pkg.price}</p>
            <div class="paypal-wrapper">
              <div id="paypal-button-${pkg.id}"></div>
            </div>
          </div>

          <p class="description">${pkg.description}</p>
          ${brandList}

          <div class="card-slider">
            ${pkg.images.map(img => `
              <div class="card">
                <img src="${img}" alt="">
              </div>
            `).join("")}
          </div>
        </div>
      `;
      container.appendChild(section);

      // PayPalボタン生成
      if (!document.querySelector(`#paypal-button-${pkg.id} iframe`)) {
        paypal.Buttons({
          createOrder: function(data, actions) {
            return actions.order.create({
              purchase_units: [{
                amount: { value: pkg.price.toString() }
              }]
            });
          }
        }).render(`#paypal-button-${pkg.id}`);
      }
    });
  });