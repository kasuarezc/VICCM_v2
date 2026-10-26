document.addEventListener("DOMContentLoaded", () => {

    const searchBtn = document.getElementById("searchBtn");

    if (searchBtn) {
        searchBtn.addEventListener("click", () => {
            if (window.openSiteSearch) {
                window.openSiteSearch();
            }
        });
    }

});