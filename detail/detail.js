// URLからid取得
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"), 10);

fetch("../package.json")
  .then(res => res.json())
  .then(data => {
    const item = data.packages.find(p => p.id === id);
    if(item){
      const basePath = "../"; 

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

      // 上部PayPalボタン描画（黄色）
      paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
          height: 48
        },
        createOrder: function(data, actions) {
          return actions.order.create({
            purchase_units: [{
              amount: { value: item.price.toString() },
              description: item.title
            }]
          });
        },
        onApprove: function(data, actions) {
          return actions.order.capture().then(function(details) {
            alert("Payment completed by " + details.payer.name.given_name);
          });
        }
      }).render('#paypal-button-container');

      // 下部PayPalボタン描画（黄色）
      paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
          height: 48
        },
        createOrder: function(data, actions) {
          return actions.order.create({
            purchase_units: [{
              amount: { value: item.price.toString() },
              description: item.title
            }]
          });
        },
        onApprove: function(data, actions) {
          return actions.order.capture().then(function(details) {
            alert("Payment completed by " + details.payer.name.given_name);
          });
        }
      }).render('#paypal-button-container-bottom');

    } else {
      console.warn("Item not found in JSON");
    }
  })
  .catch(err => console.error("Failed to load JSON:", err));