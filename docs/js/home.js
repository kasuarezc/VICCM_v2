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
});