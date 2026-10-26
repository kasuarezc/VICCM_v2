  /* ============================================================
     BLOQUE 1: Botón de búsqueda simple (abre buscador global)
     ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      if (window.openSiteSearch) {
        window.openSiteSearch();
      }
    });
  }

  /* ============================================================
     BLOQUE 2: Buscador con panel expandible (shell/toggleBtn/etc.)
     Solo se activa si TODOS los elementos requeridos existen
     ============================================================ */
  const shell = document.getElementById('searchShell');
  const toggleBtn = document.getElementById('searchToggleBtn');
  const input = document.getElementById('searchInput');
  const resultsPanel = document.getElementById('searchResults');
  const resultsList = document.getElementById('resultsList');

  if (shell && toggleBtn && input && resultsPanel && resultsList) {

    // Limpia numeración/puntos iniciales: "3. Titulo" -> "Titulo"
    function limpiarTexto(texto) {
      return texto.trim().replace(/^[\s.\d]+\.\s*/, '').replace(/^\.\s*/, '');
    }

    // Indexamos encabezados una sola vez al cargar
    const encabezados = Array.from(document.querySelectorAll('h1, h2, h3, h4')).map(el => {
      const limpio = limpiarTexto(el.textContent);
      return {
        textoLimpio: limpio,
        etiqueta: el.tagName,
        elemento: el
      };
    });

    let isOpen = false;

    function openSearch() {
      isOpen = true;
      shell.classList.add('open');
      setTimeout(() => input.focus(), 200);
    }

    function closeSearch() {
      isOpen = false;
      shell.classList.remove('open');
      input.value = '';
      hideResults();
    }

    function showResults() {
      resultsPanel.classList.add('visible');
    }

    function hideResults() {
      resultsPanel.classList.remove('visible');
    }

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!isOpen) {
        openSearch();
      }
    });

    input.addEventListener('input', () => {
      const q = input.value.toLowerCase().trim();
      resultsList.innerHTML = '';

      if (!q) { hideResults(); return; }

      const coincidencias = encabezados.filter(h =>
        h.textoLimpio.toLowerCase().includes(q)
      );

      if (coincidencias.length === 0) {
        resultsList.innerHTML = '<li class="empty">Sin resultados</li>';
      } else {
        coincidencias.forEach(h => {
          const li = document.createElement('li');
          li.innerHTML = `<span>${h.textoLimpio}</span>`;
          li.addEventListener('click', () => {
            h.elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
            closeSearch();
          });
          resultsList.appendChild(li);
        });
      }

      showResults();
    });

    // Cerrar al hacer click fuera del buscador
    document.addEventListener('click', (e) => {
      if (isOpen && !shell.contains(e.target) && !resultsPanel.contains(e.target)) {
        closeSearch();
      }
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) closeSearch();
    });

  }

  /* ============================================================
     BLOQUE 3: Menú hamburguesa (navToggle / mainNav)
     ============================================================ */
  const menuToggleBtn = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const navOverlay = document.getElementById('navOverlay');

  if (!menuToggleBtn || !mainNav) {
    console.warn('Menú: no se encontró navToggle o mainNav en esta página.');
  } else {

    function toggleMenu() {
      const abierto = mainNav.classList.toggle('nav-open');
      menuToggleBtn.classList.toggle('active', abierto);
      menuToggleBtn.setAttribute('aria-expanded', abierto);
      if (navOverlay) navOverlay.classList.toggle('is-visible', abierto);
    }

    function cerrarMenu() {
      mainNav.classList.remove('nav-open');
      menuToggleBtn.classList.remove('active');
      menuToggleBtn.setAttribute('aria-expanded', 'false');
      if (navOverlay) navOverlay.classList.remove('is-visible');
    }

    menuToggleBtn.addEventListener('click', toggleMenu);
    if (navOverlay) navOverlay.addEventListener('click', cerrarMenu);

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', cerrarMenu);
    });

  }

});