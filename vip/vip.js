document.addEventListener("DOMContentLoaded", function () {

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
              <p class="price">$${item.price}</p>
              <div class="paypal-wrapper">
                <div id="paypal-button-${item.id}"></div>
              </div>
            </div>

            <p class="description">${item.description}</p>

            <div class="card-slider">
              ${item.images.map(img =>
                `<div class="card"><img src="${img}" alt=""></div>`
              ).join('')}
            </div>
          </div>
        `;

        container.appendChild(section);

        // ✅ PayPalボタン描画（高さ指定重要）
        paypal.Buttons({
          style: {
            layout: 'vertical',
            label: 'paypal',
            height: 48
          },
          createOrder: function(data, actions) {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: item.price.toString()
                },
                description: item.title
              }]
            });
          },
          onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
              alert("Payment completed by " + details.payer.name.given_name);
            });
          }
        }).render(`#paypal-button-${item.id}`);

      });

    })
    .catch(err => console.error("VIP JSON load error:", err));

});