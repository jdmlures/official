// URLからid取得
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"),10);

fetch("../package.json")
  .then(res=>res.json())
  .then(data=>{
    const item = data.packages.find(p=>p.id===id);
    if(item){
      const basePath = "../"; // detail.html から index.html 基準の image を表示するための補正
      document.getElementById("detail-hero-img").src = basePath + item.image;
      document.getElementById("detail-title").textContent = `Package #${item.package}`;
      document.getElementById("detail-price").textContent = `$ ${item.price}`;
      document.getElementById("detail-desc").textContent = item.description || "No description available";
    }
  });