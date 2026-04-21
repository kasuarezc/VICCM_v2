document.addEventListener("DOMContentLoaded", () => {
  const elementos = document.querySelectorAll(
    ".fecha-card, .pregunta-card, .introduccion, .imagen-destacada, .btn-formulario, .organizadores-section"
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

  const btn = document.querySelector(".btn-formulario");
  if (btn) {
    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "translateY(-5px) scale(1.02)";
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  }
});