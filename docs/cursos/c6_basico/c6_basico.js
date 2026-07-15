document.addEventListener("DOMContentLoaded", () => {
  const elementos = document.querySelectorAll(
    ".imagen-card, .organizadores-info, .col-derecha h1, .subtitulo, .objetivos, .resumen, .btn-volver"
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

  elementos.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = "all 0.6s ease";
    observer.observe(el);
  });
});