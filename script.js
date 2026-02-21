const slidesContainer = document.querySelector(".hero");
const dotsContainer = document.querySelector(".dots");
const cardSlider = document.querySelector(".card-slider");

let slides = [], dots = [], index = 0, slideInterval = null;

const packageData = [
  {"image":"https://picsum.photos/800/550?1","package":1,"price":130,"status":"stock","link":"detail.html?id=1","sold":"2026-02-21","listed":"2026-02-15","shipped":"Japan"},
  {"image":"https://picsum.photos/800/550?2","package":2,"price":150,"status":"stock","link":"detail.html?id=2","sold":"2026-02-20","listed":"2026-02-14","shipped":"USA"},
  {"image":"https://picsum.photos/800/550?3","package":3,"price":180,"status":"stock","link":"detail.html?id=3","sold":"2026-02-19","listed":"2026-02-13","shipped":"Canada"},
  {"image":"https://picsum.photos/800/550?4","package":4,"price":200,"status":"stock","link":"detail.html?id=4","sold":"2026-02-18","listed":"2026-02-12","shipped":"UK"},
  {"image":"https://picsum.photos/800/550?5","package":5,"price":220,"status":"stock","link":"detail.html?id=5","sold":"2026-02-17","listed":"2026-02-11","shipped":"USA"},
  {"image":"https://picsum.photos/800/550?dummy","package":0,"price":0,"status":"dummy","link":"","sold":"","listed":"","shipped":""}
];

// ================= HERO =================
function createSlides(data){
  slidesContainer.innerHTML = "";
  dotsContainer.innerHTML = "";
  slides = []; dots = [];

  data.forEach((item,i)=>{
    const slide = document.createElement("div");
    slide.className = "slide";
    if(item.status === "dummy") slide.classList.add("coming");

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.status==="dummy" ? "Coming Soon" : `Package #${item.package}`;
    slide.appendChild(img);

    const info = document.createElement("div");
    info.className = "product-info";

    const p = document.createElement("p");
    p.className = "package";
    p.textContent = item.status==="dummy" ? "COMING SOON" : `Package #${item.package}`;
    info.appendChild(p);

    if(item.status!=="dummy"){
      const priceBtn = document.createElement("span");
      priceBtn.className = "price";
      priceBtn.textContent = `$ ${item.price}`;
      info.appendChild(priceBtn);

      info.addEventListener("click",()=> window.location.href = item.link);
      info.style.cursor = "pointer";
    }

    slide.appendChild(info);

    const tri = document.createElement("div");
    tri.className = "triangle";
    if(item.status==="dummy") tri.classList.add("coming");
    const span = document.createElement("span");
    span.textContent = item.status==="dummy" ? "COMING" : "STOCK";
    tri.appendChild(span);
    slide.appendChild(tri);

    slidesContainer.appendChild(slide);
    slides.push(slide);

    const dot = document.createElement("span");
    dot.addEventListener("click",()=>showSlide(i));
    dotsContainer.appendChild(dot);
    dots.push(dot);
  });

  showSlide(0);
  startAutoSlide();
}

// ================= SLIDE CONTROL =================
function showSlide(i){
  slides.forEach((s,idx)=>s.classList.toggle("active",idx===i));
  dots.forEach((d,idx)=>d.classList.toggle("active",idx===i));
  index = i;
}

function startAutoSlide(){
  if(slideInterval) clearInterval(slideInterval);
  slideInterval = setInterval(()=>showSlide((index+1)%slides.length),4000);
}

// ================= CARD SLIDER =================
function createCardSlider(data){
  cardSlider.innerHTML = "";

  data.forEach(item=>{
    if(item.status==="dummy") return;

    const card = document.createElement("div");
    card.className = "card";

    // 画像
    const img = document.createElement("img");
    img.src = item.image;
    card.appendChild(img);

    // タイトル
    const title = document.createElement("h3");
    title.textContent = `Package #${item.package}`;
    card.appendChild(title);

    // メタ情報
    const metaSold = document.createElement("p");
    metaSold.textContent = `✅ Sold date: ${item.sold}`;
    card.appendChild(metaSold);

    const metaListed = document.createElement("p");
    metaListed.textContent = `🏷️ Listed date: ${item.listed}`;
    card.appendChild(metaListed);

    const metaShipped = document.createElement("p");
    metaShipped.innerHTML = `✈️ Shipped to <img src="https://upload.wikimedia.org/wikipedia/en/9/9e/Flag_of_${item.shipped.replace(" ","_")}.svg" class="flag" style="width:20px;height:14px;vertical-align:middle;">`;
    card.appendChild(metaShipped);

    cardSlider.appendChild(card);
  });
}

// ================= JAPAN TIME =================
function updateTime(){
  const t = new Date().toLocaleTimeString("en-US",{
    timeZone:"Asia/Tokyo",
    hour12:false,
    hour:"2-digit", minute:"2-digit", second:"2-digit"
  });
  const el = document.getElementById("japan-time");
  if(el) el.textContent = "Japan Time: "+t;
}
updateTime();
setInterval(updateTime,1000);

// ================= INIT =================
createSlides(packageData);
createCardSlider(packageData);