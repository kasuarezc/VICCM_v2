document.addEventListener("DOMContentLoaded", () => {
  const imagenes = Array.from(document.querySelectorAll(".foto-premio img"));

  if (!imagenes.length) return;

  let currentIndex = 0;

  const overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Cerrar">×</button>
    <button class="lightbox-nav lightbox-prev" type="button" aria-label="Imagen anterior">❮</button>
    <div class="lightbox-content">
      <img class="lightbox-image" alt="">
      <p class="lightbox-caption"></p>
    </div>
    <button class="lightbox-nav lightbox-next" type="button" aria-label="Imagen siguiente">❯</button>
  `;
  document.body.appendChild(overlay);

  const overlayImg = overlay.querySelector(".lightbox-image");
  const overlayCaption = overlay.querySelector(".lightbox-caption");
  const closeBtn = overlay.querySelector(".lightbox-close");
  const prevBtn = overlay.querySelector(".lightbox-prev");
  const nextBtn = overlay.querySelector(".lightbox-next");

  const style = document.createElement("style");
  style.textContent = `
    .lightbox-overlay{
      position:fixed;
      inset:0;
      background:rgba(0,0,0,.88);
      display:none;
      align-items:center;
      justify-content:center;
      z-index:5000;
      padding:2rem;
    }
    .lightbox-overlay.active{
      display:flex;
    }
    .lightbox-content{
      max-width:min(1000px, 92vw);
      max-height:90vh;
      text-align:center;
    }
    .lightbox-image{
      max-width:100%;
      max-height:78vh;
      display:block;
      margin:0 auto;
      border-radius:16px;
      box-shadow:0 20px 50px rgba(0,0,0,.35);
    }
    .lightbox-caption{
      color:#fff;
      margin-top:1rem;
      font-size:.95rem;
      line-height:1.5;
    }
    .lightbox-close{
      position:absolute;
      top:18px;
      right:24px;
      border:none;
      background:rgba(255,255,255,.12);
      color:#fff;
      width:46px;
      height:46px;
      border-radius:50%;
      font-size:2rem;
      cursor:pointer;
    }
    .lightbox-nav{
      position:absolute;
      top:50%;
      transform:translateY(-50%);
      border:none;
      background:rgba(255,255,255,.12);
      color:#fff;
      width:52px;
      height:52px;
      border-radius:50%;
      font-size:1.5rem;
      cursor:pointer;
    }
    .lightbox-prev{ left:22px; }
    .lightbox-next{ right:22px; }
    .lightbox-close:hover,
    .lightbox-nav:hover{
      background:rgba(255,255,255,.22);
    }
    @media (max-width:768px){
      .lightbox-overlay{ padding:1rem; }
      .lightbox-prev{ left:10px; }
      .lightbox-next{ right:10px; }
      .lightbox-close{ top:10px; right:10px; }
      .lightbox-nav{
        width:44px;
        height:44px;
      }
    }
  `;
  document.head.appendChild(style);

  function getCaption(img) {
    const figure = img.closest("figure");
    const caption = figure?.querySelector("figcaption");
    return caption ? caption.textContent.trim() : (img.alt || "");
  }

  function updateLightbox(index) {
    currentIndex = index;
    const img = imagenes[currentIndex];
    overlayImg.src = img.src;
    overlayImg.alt = img.alt || "";
    overlayCaption.textContent = getCaption(img);
  }

  function openLightbox(index) {
    updateLightbox(index);
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
    overlayImg.src = "";
  }

  function showNext() {
    const next = (currentIndex + 1) % imagenes.length;
    updateLightbox(next);
  }

  function showPrev() {
    const prev = (currentIndex - 1 + imagenes.length) % imagenes.length;
    updateLightbox(prev);
  }

  imagenes.forEach((img, index) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => openLightbox(index));
  });

  closeBtn.addEventListener("click", closeLightbox);
  nextBtn.addEventListener("click", showNext);
  prevBtn.addEventListener("click", showPrev);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("active")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });

  const elementos = document.querySelectorAll(".premio-seccion");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, { threshold: 0.1 });

  elementos.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.6s ease";
    observer.observe(el);
  });
});