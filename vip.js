document.addEventListener("DOMContentLoaded", function () {

  /* ========================= */
  /* SOLD状態チェック関数 */
  /* ========================= */

  function checkSoldState(sectionId) {
    const isSold = localStorage.getItem("sold_" + sectionId);

    if (isSold === "true") {
      const section = document.getElementById(sectionId);
      if (!section) return;

      const product = section.closest(".vip-product");
      if (product) {
        product.style.display = "none";
      }

      const soldMessage = document.createElement("div");
      soldMessage.textContent = "SOLD OUT";
      soldMessage.style.textAlign = "center";
      soldMessage.style.fontSize = "40px";
      soldMessage.style.fontWeight = "900";
      soldMessage.style.color = "#dc1c13";
      soldMessage.style.margin = "60px 0";

      section.parentNode.insertBefore(soldMessage, section);
    }
  }

  /* ========================= */
  /* PayPal初期化 */
  /* ========================= */

  function initializePayPal(buttonContainerId, sectionId) {

    const section = document.getElementById(sectionId);
    if (!section) return;

    const priceElement = section.querySelector(".price");
    if (!priceElement) return;

    const priceValue = priceElement.textContent.trim().replace("$", "");

    paypal.Buttons({

      style: {
        layout: "vertical",
        color: "gold",
        shape: "rect",
        label: "paypal",
        height: 45
      },

      createOrder: function (data, actions) {
        return actions.order.create({
          purchase_units: [{
            amount: { value: priceValue }
          }]
        });
      },

      onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {

          alert("Sandbox Purchase Completed by " + details.payer.name.given_name);

          /* ========================= */
          /* SOLD状態保存 */
          /* ========================= */

          localStorage.setItem("sold_" + sectionId, "true");

          const product = section.closest(".vip-product");
          if (product) {
            product.style.display = "none";
          }

          const soldMessage = document.createElement("div");
          soldMessage.textContent = "SOLD OUT";
          soldMessage.style.textAlign = "center";
          soldMessage.style.fontSize = "40px";
          soldMessage.style.fontWeight = "900";
          soldMessage.style.color = "#dc1c13";
          soldMessage.style.margin = "60px 0";

          section.parentNode.insertBefore(soldMessage, section);

        });
      },

      onError: function (err) {
        console.error("PayPal Error:", err);
        alert("Payment Error Occurred");
      }

    }).render("#" + buttonContainerId);
  }

  /* ========================= */
  /* 初期チェック */
  /* ========================= */

  checkSoldState("vip-section-1");
  checkSoldState("vip-section-2");

  /* ========================= */
  /* ボタン生成 */
  /* ========================= */

  initializePayPal("paypal-button-1", "vip-section-1");
  initializePayPal("paypal-button-2", "vip-section-2");

});