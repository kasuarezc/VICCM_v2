document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  const slides = Array.from(document.querySelectorAll(".venue-slide"));
  const dotsContainer = document.getElementById("venueDots");

  if (slides.length && dotsContainer) {
    let currentIndex = 0;
    let intervalId = null;

    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = "venue-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Mostrar imagen ${index + 1}`);
      dot.addEventListener("click", () => {
        goToSlide(index);
        restartAuto();
      });
      dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.querySelectorAll(".venue-dot"));

    function goToSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });

      currentIndex = index;
    }

    function nextSlide() {
      const nextIndex = (currentIndex + 1) % slides.length;
      goToSlide(nextIndex);
    }

    function startAuto() {
      intervalId = setInterval(nextSlide, 4000);
    }

    function restartAuto() {
      clearInterval(intervalId);
      startAuto();
    }

    goToSlide(0);
    startAuto();
  }

  // ===== Aviso emergente (fechas / tarifas) =====
  const overlay = document.getElementById('avisoOverlay');
  const btnX = document.getElementById('avisoCerrarX');
  const btnOk = document.getElementById('avisoCerrarBtn');

  if (overlay && btnX && btnOk) {

    function abrirAviso() {
      overlay.classList.add('activo');
    }

    function cerrarAviso() {
      overlay.classList.remove('activo');
    }

    abrirAviso();

    btnX.addEventListener('click', cerrarAviso);
    btnOk.addEventListener('click', cerrarAviso);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) cerrarAviso();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') cerrarAviso();
    });

  } else {
    console.warn('Aviso: no se encontró avisoOverlay/avisoCerrarX/avisoCerrarBtn en esta página.');
  }

  /* =====================================================================
     NOTA: el bloque del menú hamburguesa (navToggle / mainNav) se ELIMINÓ
     de este archivo porque ya se registra globalmente en main.js.
     Tenerlo aquí también causaba un doble addEventListener sobre el mismo
     botón, lo que anulaba el toggle (se abría y cerraba en el mismo clic).
     ===================================================================== */

  // ===== Ventana modal (pestañas del aviso: fechas / tarifas) =====
  const botonesTab = document.querySelectorAll('.aviso-pestana-btn');
  const paneles = document.querySelectorAll('.aviso-panel');

  botonesTab.forEach(function (boton) {
    boton.addEventListener('click', function () {
      const destino = boton.getAttribute('data-aviso-tab');

      botonesTab.forEach(function (b) { b.classList.remove('activo'); });
      paneles.forEach(function (p) { p.classList.remove('activo'); });

      boton.classList.add('activo');
      const panelDestino = document.querySelector('.aviso-panel[data-aviso-panel="' + destino + '"]');
      if (panelDestino) panelDestino.classList.add('activo');
    });
  });

});