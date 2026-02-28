if (!window.vipInitialized) {

  window.vipInitialized = true;

  fetch("vip.json")
    .then(res => res.json())
    .then(data => {

      const container = document.getElementById("vip-container");
      container.innerHTML = "";

      data.packages.forEach(pkg => {

        if (pkg.sold) return;

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

        if (!document.querySelector(`#paypal-button-${pkg.id} iframe`)) {

          paypal.Buttons({
            createOrder: function(data, actions) {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: pkg.price.toString()
                  }
                }]
              });
            }
          }).render(`#paypal-button-${pkg.id}`);

        }

      });

    });

}