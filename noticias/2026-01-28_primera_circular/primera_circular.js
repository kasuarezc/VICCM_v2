document.addEventListener("DOMContentLoaded", () => {
  const secciones = document.querySelectorAll(
    ".noticia-body h2, .lista-numerada li, .lista-viñetas li, .nota-especial, .invitacion-especial, .autor-destacado"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.12 }
  );

  secciones.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = "all 0.6s ease";
    observer.observe(el);
  });

  const pdfBtn = document.querySelector(".pdf-download");
  if (pdfBtn) {
    pdfBtn.addEventListener("mouseenter", () => {
      pdfBtn.style.transform = "translateY(-3px) scale(1.02)";
    });

    pdfBtn.addEventListener("mouseleave", () => {
      pdfBtn.style.transform = "";
    });
  }
});