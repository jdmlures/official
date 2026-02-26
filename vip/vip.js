document.addEventListener("DOMContentLoaded", function () {

  function initializePayPal(buttonContainerId, sectionId) {

    const section = document.getElementById(sectionId);
    if (!section) return;

    const priceElement = section.querySelector(".price");
    if (!priceElement) return;

    const priceText = priceElement.textContent.trim();
    const priceValue = priceText.replace("$", "");

    paypal.Buttons({

      style: {
        layout: "vertical",
        color: "gold",
        shape: "rect",
        label: "paypal"
      },

      createOrder: function (data, actions) {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: priceValue
            }
          }]
        });
      },

      onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {

          alert("Sandbox Purchase Completed by " + details.payer.name.given_name);

          // ==========================
          // 購入完了後の挙動
          // ==========================

          const wrapper = section.querySelector(".price-buy-wrapper");
          if (wrapper) {
            wrapper.style.display = "none";
          }

          const soldMessage = document.createElement("p");
          soldMessage.textContent = "SOLD";
          soldMessage.style.color = "#dc1c13";
          soldMessage.style.fontWeight = "bold";
          soldMessage.style.fontSize = "24px";
          soldMessage.style.marginTop = "10px";

          section.querySelector(".container").appendChild(soldMessage);

        });
      },

      onError: function (err) {
        console.error("PayPal Error:", err);
        alert("Payment Error Occurred");
      }

    }).render("#" + buttonContainerId);
  }

  // 既存HTMLに合わせる
  initializePayPal("paypal-button-1", "vip-section-1");
  initializePayPal("paypal-button-2", "vip-section-2");

});