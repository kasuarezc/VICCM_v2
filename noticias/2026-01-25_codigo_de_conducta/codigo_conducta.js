document.addEventListener("DOMContentLoaded", () => {
  const pdfBtn = document.querySelector(".pdf-download");

  if (pdfBtn) {
    pdfBtn.addEventListener("mouseenter", () => {
      pdfBtn.style.transform = "translateY(-3px)";
    });

    pdfBtn.addEventListener("mouseleave", () => {
      pdfBtn.style.transform = "";
    });
  }
});