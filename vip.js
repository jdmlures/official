document.addEventListener("DOMContentLoaded", function () {

  /* ========================= */
  /* セクション完全削除 */
  /* ========================= */

  function removeProduct(sectionId) {

    const section = document.getElementById(sectionId);
    if (!section) return;

    const product = section.closest(".vip-product");
    if (!product) return;

    product.remove(); // DOMから完全削除
  }

  /* ========================= */
  /* SOLD状態チェック */
  /* ========================= */

  function checkSoldState(sectionId) {

    if (localStorage.getItem("sold_" + sectionId) === "true") {
      removeProduct(sectionId);
    }
  }

  /* ========================= */
  /* PayPal初期化 */
  /* ========================= */

  function initializePayPal(buttonContainerId, sectionId) {

    // 既にSOLDならボタン生成しない
    if (localStorage.getItem("sold_" + sectionId) === "true") return;

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
        return actions.order.capture().then(function () {

          // SOLD保存
          localStorage.setItem("sold_" + sectionId, "true");

          // 即削除
          removeProduct(sectionId);

        });
      },

      onError: function (err) {
        console.error("PayPal Error:", err);
        alert("Payment Error Occurred");
      }

    }).render("#" + buttonContainerId);
  }

  /* ========================= */
  /* 初期処理 */
  /* ========================= */

  checkSoldState("vip-section-1");
  checkSoldState("vip-section-2");

  initializePayPal("paypal-button-1", "vip-section-1");
  initializePayPal("paypal-button-2", "vip-section-2");

});