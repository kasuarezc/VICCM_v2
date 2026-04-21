document.addEventListener("DOMContentLoaded", () => {
  function iniciarCarrusel(contenedorId, slidesId, prevId, nextId, indicadoresId, intervalo = 5000) {
    const carrusel = document.getElementById(contenedorId);
    const slides = document.getElementById(slidesId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    const indicadoresDiv = document.getElementById(indicadoresId);

    if (!carrusel || !slides || !prevBtn || !nextBtn || !indicadoresDiv) return;

    let index = 0;
    let autoInterval;
    const totalSlides = slides.children.length;

    for (let i = 0; i < totalSlides; i++) {
      const indicador = document.createElement("div");
      indicador.classList.add("indicador");
      if (i === 0) indicador.classList.add("activo");
      indicador.addEventListener("click", () => irASlide(i));
      indicadoresDiv.appendChild(indicador);
    }

    function actualizarIndicadores() {
      const indicadores = indicadoresDiv.querySelectorAll(".indicador");
      indicadores.forEach((ind, i) => {
        ind.classList.toggle("activo", i === index);
      });
    }

    function irASlide(nuevoIndex) {
      if (nuevoIndex < 0) nuevoIndex = totalSlides - 1;
      if (nuevoIndex >= totalSlides) nuevoIndex = 0;
      index = nuevoIndex;
      slides.style.transform = `translateX(-${index * 100}%)`;
      actualizarIndicadores();
      reiniciarIntervalo();
    }

    function siguiente() {
      irASlide(index + 1);
    }

    function anterior() {
      irASlide(index - 1);
    }

    function reiniciarIntervalo() {
      clearInterval(autoInterval);
      autoInterval = setInterval(siguiente, intervalo);
    }

    prevBtn.addEventListener("click", anterior);
    nextBtn.addEventListener("click", siguiente);

    autoInterval = setInterval(siguiente, intervalo);

    carrusel.addEventListener("mouseenter", () => clearInterval(autoInterval));
    carrusel.addEventListener("mouseleave", () => {
      clearInterval(autoInterval);
      autoInterval = setInterval(siguiente, intervalo);
    });
  }

  iniciarCarrusel("carruselFlorencia", "slidesFlorencia", "prevFlorencia", "nextFlorencia", "indicadoresFlorencia", 5000);
  iniciarCarrusel("carruselUni", "slidesUni", "prevUni", "nextUni", "indicadoresUni", 5000);

  const modal = document.getElementById("modalImagen");
  const imagenAmpliada = document.getElementById("imagenAmpliada");
  const cerrarModal = document.querySelector(".cerrar-modal");
  const todasImagenes = document.querySelectorAll(".carrusel-slide img");

  function abrirModal(src) {
    if (!modal || !imagenAmpliada) return;
    imagenAmpliada.src = src;
    modal.classList.add("activo");
    document.body.style.overflow = "hidden";
  }

  function cerrarModalFunc() {
    if (!modal) return;
    modal.classList.remove("activo");
    document.body.style.overflow = "";
  }

  todasImagenes.forEach((img) => {
    img.addEventListener("click", () => abrirModal(img.src));
  });

  if (cerrarModal) {
    cerrarModal.addEventListener("click", cerrarModalFunc);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) cerrarModalFunc();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarModalFunc();
  });
});