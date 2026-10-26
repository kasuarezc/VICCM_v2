document.addEventListener("DOMContentLoaded", () => {
  console.log("simposios.js cargado"); // Para verificar que se ejecuta

  const botonesFiltro = document.querySelectorAll(".filtro-btn");
  const cards = document.querySelectorAll(".simposio-card");
  const inputBusqueda = document.getElementById("busquedaInput");
  const newsletterBtn = document.querySelector(".newsletter-btn");

  botonesFiltro.forEach((btn) => {
    btn.addEventListener("click", () => {
      const categoria = btn.dataset.categoria;

      botonesFiltro.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      cards.forEach((card) => {
        if (categoria === "todos" || card.dataset.categoria === categoria) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });

      if (inputBusqueda) {
        inputBusqueda.value = "";
      }
    });
  });

  if (inputBusqueda) {
    inputBusqueda.addEventListener("keyup", () => {
      const termino = inputBusqueda.value.toLowerCase();

      cards.forEach((card) => {
        const titulo = (card.dataset.titulo || "").toLowerCase();
        const organizadores = (card.dataset.organizadores || "").toLowerCase();
        const descripcion = (
          card.querySelector(".simposio-descripcion")?.textContent || ""
        ).toLowerCase();

        const coincide =
          titulo.includes(termino) ||
          organizadores.includes(termino) ||
          descripcion.includes(termino);

        card.style.display = coincide ? "block" : "none";
      });

      botonesFiltro.forEach((b) => b.classList.remove("active"));
    });
  }

  if (newsletterBtn) {
    newsletterBtn.addEventListener("click", () => {
      const emailInput = document.querySelector(".newsletter-input");
      const email = emailInput?.value?.trim() || "";

      if (email && email.includes("@")) {
        alert("¡Gracias por suscribirte! Pronto recibirás nuestras noticias.");
        emailInput.value = "";
      } else {
        alert("Por favor ingresa un correo electrónico válido.");
      }
    });
  }

  // ===== PAGINACIÓN CORREGIDA =====
  // Selecciona todos los enlaces dentro del contenedor .paginacion
 document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.paginacion');
  const actual = location.pathname.split('/').pop() || 'simposios.html';

  links.forEach((link) => {
    const destino = link.getAttribute('href').split('/').pop();
    link.classList.toggle('active', destino === actual);
  });
});
});