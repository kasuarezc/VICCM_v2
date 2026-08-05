/*=========================================
=        BUSCADOR GLOBAL VICCM            =
=========================================*/

document.addEventListener("DOMContentLoaded", () => {

    const searchBtn = document.getElementById("searchBtn");
    const overlay = document.getElementById("searchOverlay");
    const input = document.getElementById("searchInput");
    const results = document.getElementById("searchResults");
    const closeBtn = document.getElementById("closeSearch");

    if (!overlay || !input || !results) {
        return;
    }

    let pages = [];
    let searchIndexBaseUrl = null;

    function renderPlaceholder() {
        results.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search fa-2x"></i>
                <p>Escriba para comenzar la búsqueda.</p>
            </div>
        `;
    }

    function normalizeEntry(entry) {
        return {
            title: entry.title || entry.titulo || entry.Title || "Sin título",
            text: entry.text || entry.descripcion || entry.description || entry.summary || "",
            category: entry.section || entry.categoria || entry.category || "Página",
            href: entry.href || entry.url || entry.link || "#"
        };
    }

    function resolveHref(href) {
        if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("/")) {
            return href;
        }

        return new URL(href, searchIndexBaseUrl || window.location.href).href;
    }

    async function loadSearchIndex() {
        const candidates = [];
        const baseUrl = new URL("./", window.location.href);
        let currentDir = baseUrl;

        for (let i = 0; i < 6; i += 1) {
            candidates.push(new URL("search.json", currentDir));
            currentDir = new URL("../", currentDir);
        }

        const fallbackCandidates = [
            new URL("./data/search-index.json", window.location.href),
            new URL("../data/search-index.json", window.location.href),
            new URL("../../data/search-index.json", window.location.href)
        ];

        for (const candidate of [...candidates, ...fallbackCandidates]) {
            try {
                const response = await fetch(candidate.href);
                if (!response.ok) {
                    continue;
                }

                const data = await response.json();
                searchIndexBaseUrl = new URL(".", candidate.href);
                return Array.isArray(data) ? data.map(normalizeEntry) : [];
            } catch (error) {
                continue;
            }
        }

        return [];
    }

    function openSearch() {
        overlay.classList.add("active");
        input.value = "";
        renderPlaceholder();
        input.focus();
    }

    function closeSearch() {
        overlay.classList.remove("active");
    }

    function runSearch() {
        const text = input.value.toLowerCase().trim();

        if (text.length < 2) {
            renderPlaceholder();
            return;
        }

        const encontrados = pages.filter((item) => {
            const haystack = `${item.title} ${item.text} ${item.category} ${item.href}`.toLowerCase();
            return haystack.includes(text);
        });

        if (encontrados.length === 0) {
            results.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search fa-2x"></i>
                    <p>No se encontraron resultados.</p>
                </div>
            `;
            return;
        }

        const fragment = document.createDocumentFragment();

        encontrados.forEach((item) => {
            const card = document.createElement("div");
            card.className = "result-item";
            card.innerHTML = `
                <div class="result-title">${item.title}</div>
                <div class="result-category">${item.category}</div>
                <div class="result-description">${item.text}</div>
            `;
            card.addEventListener("click", () => {
                window.location.href = resolveHref(item.href);
            });
            fragment.appendChild(card);
        });

        results.innerHTML = "";
        results.appendChild(fragment);
    }

    if (searchBtn) {
        searchBtn.addEventListener("click", openSearch);
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeSearch);
    }

    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
            closeSearch();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeSearch();
        }

        if (event.ctrlKey && event.key.toLowerCase() === "k") {
            event.preventDefault();
            openSearch();
        }
    });

    input.addEventListener("input", runSearch);

    loadSearchIndex().then((data) => {
        pages = data;
    });

    window.openSiteSearch = openSearch;
});

});