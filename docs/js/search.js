/*=========================================
=        BUSCADOR GLOBAL VICCM            =
=========================================*/
// ====== PÁGINAS DEL SITIO ======
const PAGES = [
  "index.html",
  "comites.html",
  "noticias.html",
  "simposios.html",
  "cursos.html",
  "sede.html",
  // ...agrega todas las páginas
];

let index = [];
let indexPromise = null;

function indexDocument(doc, url, pageTitle) {
  const clone = doc.body.cloneNode(true);
  clone.querySelectorAll("script, style, noscript, .search-wrapper").forEach((n) => n.remove());

  const headings = clone.querySelectorAll("h1, h2, h3");
  const pageName = pageTitle || doc.title || url;

  headings.forEach((h) => {
    const title = h.textContent.replace(/\s+/g, " ").trim();
    if (!title) return;

    let body = "";
    let node = h.nextElementSibling;
    while (node && !node.matches("h1, h2, h3") && !node.querySelector("h1, h2, h3")) {
      body += " " + node.textContent;
      node = node.nextElementSibling;
    }
    body = body.replace(/\s+/g, " ").trim();

    index.push({
      title,
      text: body || title,
      norm: normalize(title + " " + body),
      page: pageName,
      url,
      id: h.id || null,
    });
  });

  // Si la página no tiene encabezados, se indexa todo su texto
  if (!headings.length) {
    const text = clone.textContent.replace(/\s+/g, " ").trim();
    index.push({ title: pageName, text, norm: normalize(text), page: pageName, url, id: null });
  }
}

function buildIndex() {
  if (indexPromise) return indexPromise; // se construye una sola vez

  indexPromise = (async () => {
    index = [];
    const current = location.pathname.split("/").pop() || "index.html";

    await Promise.all(PAGES.map(async (url) => {
      try {
        if (url === current) {
          // La página actual se lee del DOM vivo (incluye contenido dinámico)
          indexDocument(document, url, document.title);
          return;
        }
        const res = await fetch(url);
        if (!res.ok) return;
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        indexDocument(doc, url);
      } catch (err) {
        console.warn("No se pudo indexar", url, err);
      }
    }));
  })();

  return indexPromise;
}

