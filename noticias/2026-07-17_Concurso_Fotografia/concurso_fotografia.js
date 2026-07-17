document.addEventListener("DOMContentLoaded", () => {
  const elementos = document.querySelectorAll(
    ".autor-destacado, .modalidad-card, .lista-viñetas li, .lista-criterios li, .requisitos-list li, .criterios-box, .btn-animado, .noticia-body h2"
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

  const botones = document.querySelectorAll(".btn-animado");

  botones.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "translateY(-4px) scale(1.02)";
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
});