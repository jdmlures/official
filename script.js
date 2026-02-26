// ====================== SELECTORS ======================
const slidesContainer = document.querySelector(".hero");
const cardSlider = document.querySelector(".card-slider");

let slides = [], index = 0, slideInterval = null;

// ====================== COUNTRY FLAG UTILS ======================
function getFlagEmoji(code){
  if(!code) return "";
  code = code.toUpperCase();
  const offset = 0x1F1E6 - 'A'.charCodeAt(0);
  return String.fromCodePoint(code.charCodeAt(0)+offset, code.charCodeAt(1)+offset);
}

// ====================== HERO SLIDES ======================
function createSlides(data){
  slidesContainer.innerHTML = "";
  slides = [];

  data.forEach((item)=>{
    // STOCK スライドのみ生成、購入済みは非表示
    if(item.status === "stock" && !localStorage.getItem(`purchased_${item.id}`)) {
      const slide = document.createElement("div");
      slide.className = "slide";
      slide.id = `hero-slide-${item.id}`;

      const img = document.createElement("img");
      img.src = item.image;
      img.alt = `Package #${item.package}`;
      slide.appendChild(img);

      const info = document.createElement("div");
      info.className = "product-info";
      const p = document.createElement("p");
      p.className = "package";
      p.textContent = `Package #${item.package}`;
      info.appendChild(p);

      const priceBtn = document.createElement("span");
      priceBtn.className = "price";
      priceBtn.textContent = `$ ${item.price}`;
      info.appendChild(priceBtn);

      info.addEventListener("click",()=>window.location.href=`detail/detail.html?id=${item.id}`);
      info.style.cursor = "pointer";
      slide.appendChild(info);

      const tri = document.createElement("div");
      tri.className = "triangle";
      const span = document.createElement("span");
      span.textContent = "STOCK";
      tri.appendChild(span);
      slide.appendChild(tri);

      slidesContainer.appendChild(slide);
      slides.push(slide);
    }
  });

  showSlide(0);
  startAutoSlide();
  addSwipeSupport();
}

// ====================== COMING SOON ======================
function appendComingSoonSlide() {
  const slide = document.createElement("div");
  slide.className = "slide coming";

  const tri = document.createElement("div");
  tri.className = "triangle coming";
  const span = document.createElement("span");
  span.textContent = "COMING";
  tri.appendChild(span);
  slide.appendChild(tri);

  const button = document.createElement("div");
  button.className = "coming-soon-btn";
  button.textContent = "COMING SOON";
  slide.appendChild(button);

  slidesContainer.appendChild(slide);
  slides.push(slide);
}

// ====================== SHOW / AUTO SLIDE ======================
function showSlide(i){
  slides.forEach((s,idx)=>s.classList.toggle("active",idx===i));
  index=i;
}

function startAutoSlide(){
  if(slideInterval) clearInterval(slideInterval);
  slideInterval = setInterval(()=>showSlide((index+1)%slides.length),4000);
}

// ====================== SWIPE SUPPORT ======================
function addSwipeSupport(){
  let startX=0,endX=0;
  slidesContainer.addEventListener("touchstart",e=>{ startX=e.touches[0].clientX; });
  slidesContainer.addEventListener("touchend",e=>{
    endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if(Math.abs(diff) > 50){
      if(diff > 0) showSlide((index+1)%slides.length);
      else showSlide((index-1+slides.length)%slides.length);
      startAutoSlide();
    }
  });
}

// ====================== CARD SLIDER ======================
function createCardSlider(data){
  cardSlider.innerHTML = "";
  data.forEach(item=>{
    if(item.status==="dummy") return;

    const card=document.createElement("div");
    card.className="card";

    const img=document.createElement("img");
    if(item.salesImages && item.salesImages.length>0){
      img.src=item.salesImages[0];
    }
    card.appendChild(img);

    const title=document.createElement("h3");
    title.textContent=`Package #${item.package}`;
    card.appendChild(title);

    const metaSold=document.createElement("p");
    metaSold.textContent=`✅ Sold date: ${item.sold}`;
    card.appendChild(metaSold);

    const metaListed=document.createElement("p");
    metaListed.textContent=`🏷️ Listed date: ${item.listed}`;
    card.appendChild(metaListed);

    const metaShipped=document.createElement("p");
    metaShipped.textContent=`✈️ Shipped to ${getFlagEmoji(item.shipped)}`;
    card.appendChild(metaShipped);

    // HISTORY のカードは手動リンク追加可能
    if(item.historyLink) {
      const link = document.createElement("a");
      link.href = item.historyLink;
      link.target = "_blank";
      link.appendChild(card);
      cardSlider.appendChild(link);
    } else {
      cardSlider.appendChild(card);
    }
  });
}

// ====================== JAPAN TIME ======================
function updateTime(){
  const t=new Date().toLocaleTimeString("en-US",{ timeZone:"Asia/Tokyo", hour12:false, hour:"2-digit", minute:"2-digit", second:"2-digit" });
  const el=document.getElementById("japan-time");
  if(el) el.textContent="Japan Time: "+t;
}
updateTime();
setInterval(updateTime,1000);

// ====================== INIT ======================
fetch("package.json")
  .then(res=>res.json())
  .then(data=>{
    createSlides(data.packages);
    appendComingSoonSlide();
    createCardSlider(data.packages);
  });