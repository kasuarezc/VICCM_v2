document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("miembroModal");
  const modalBody = document.getElementById("modalBody");
  const modalNombre = document.getElementById("modalNombre");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const navItems = document.querySelectorAll(".comite-nav-item");
  const sections = document.querySelectorAll(".comite-section");

  if (!modal || !modalBody || !modalNombre || !modalCloseBtn) {
    console.warn("No se encontró la estructura del modal en la página.");
    return;
  }

  /* =========================
     NAVEGACIÓN LATERAL
  ========================= */
  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();

      const targetId = item.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      navItems.forEach((nav) => nav.classList.remove("active"));
      item.classList.add("active");

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.clientHeight;

      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navItems.forEach((item) => {
      item.classList.remove("active");
      if (item.getAttribute("href") === `#${current}`) {
        item.classList.add("active");
      }
    });
  });

  /* =========================
     APERTURA DE MODAL CON EVENT DELEGATION
  ========================= */
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".miembro-card");

    if (!card) return;
    if (card.classList.contains("placeholder")) return;

    const data = {
      nombre: card.dataset.nombre || "",
      rol: card.dataset.rol || "",
      img: card.dataset.img || "",
      comite: card.dataset.comite || "",
      biografia: card.dataset.biografia || "",
      rolViccm: card.dataset.rolViccm || "",
      enlaces: parseJsonSafe(card.dataset.enlaces, []),
      posts: parseJsonSafe(card.dataset.posts, [])
    };

    openModal(data);
  });

  /* =========================
     CERRAR MODAL
  ========================= */
  modalCloseBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  /* =========================
     FUNCIONES AUXILIARES
  ========================= */
  function parseJsonSafe(value, fallback) {
    try {
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      console.warn("No se pudo convertir JSON:", value);
      return fallback;
    }
  }

  function getIconSymbol(tipo) {
    const iconMap = {
      "google-scholar": "🎓",
      "researchgate": "📘",
      "linkedin": "💼",
      "github": "💻",
      "x-twitter": "𝕏",
      "instagram": "📸",
      "facebook": "📘",
      "globe": "🌐",
      "orcid": "🆔",
      "youtube": "▶"
    };

    return iconMap[tipo] || "🔗";
  }

  function domainFromUrl(url) {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  }

  function openModal(data) {
    modalNombre.textContent = data.nombre || "Perfil del Miembro";

    const enlacesHTML = Array.isArray(data.enlaces) && data.enlaces.length
      ? data.enlaces.map((enlace) => `
          <a href="${enlace.url}" target="_blank" rel="noopener noreferrer" class="enlace-card">
            <div class="enlace-icon">${getIconSymbol(enlace.tipo)}</div>
            <div class="enlace-info">
              <h4>${enlace.texto}</h4>
              <span>${domainFromUrl(enlace.url)}</span>
            </div>
          </a>
        `).join("")
      : `<p class="no-data">No hay enlaces disponibles</p>`;

    const postsHTML = Array.isArray(data.posts) && data.posts.length
      ? `
        <button class="tab-btn" data-tab="posts">📰 Publicaciones</button>
      `
      : "";

    const postsPaneHTML = Array.isArray(data.posts) && data.posts.length
      ? `
        <div class="tab-pane" id="posts">
          <h3 style="margin-bottom:1rem;">Publicaciones recientes</h3>
          <ul class="publicaciones-list">
            ${data.posts.map((post) => `
              <li class="publicacion-item">
                <a href="${post.url}">
                  <span>📄</span>
                  <span>${post.titulo}</span>
                  <span class="fecha">${post.fecha}</span>
                </a>
              </li>
            `).join("")}
          </ul>
        </div>
      `
      : "";

    modalBody.innerHTML = `
      <div class="perfil-header">
        <div class="perfil-img">
          <img src="${data.img}" alt="${data.nombre}">
        </div>
        <div class="perfil-titulo">
          <h3>${data.nombre}</h3>
          <div class="rol-principal">${data.rol}</div>
          <span class="comite-badge">👥 ${data.comite}</span>
        </div>
      </div>

      <div class="tabs-container">
        <div class="tabs-header">
          <button class="tab-btn active" data-tab="biografia">📋 Biografía</button>
          <button class="tab-btn" data-tab="enlaces">🔗 Enlaces</button>
          ${postsHTML}
        </div>

        <div class="tab-pane active" id="biografia">
          <div class="biografia">
            <p>${data.biografia || "Información biográfica no disponible."}</p>
            <div class="destacado">
              <strong>En el VICCM:</strong> ${data.rolViccm || "Rol no especificado."}
            </div>
          </div>
        </div>

        <div class="tab-pane" id="enlaces">
          <h3 style="margin-bottom:1rem;">Enlaces y redes sociales</h3>
          <div class="enlaces-grid">
            ${enlacesHTML}
          </div>
        </div>

        ${postsPaneHTML}
      </div>
    `;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    activarTabs();
  }

  function activarTabs() {
    const tabButtons = modalBody.querySelectorAll(".tab-btn");
    const panes = modalBody.querySelectorAll(".tab-pane");

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;

        tabButtons.forEach((b) => b.classList.remove("active"));
        panes.forEach((p) => p.classList.remove("active"));

        btn.classList.add("active");

        const pane = modalBody.querySelector(`#${tab}`);
        if (pane) {
          pane.classList.add("active");
        }
      });
    });
  }

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
});