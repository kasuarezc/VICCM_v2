document.addEventListener("DOMContentLoaded", () => {
  const secciones = document.querySelectorAll(
    ".noticia-body h2, .lista-viñetas li, .ganadora-card, .invitacion-especial, .autor-destacado"
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
});
