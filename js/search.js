/*=========================================
=        BUSCADOR GLOBAL VICCM            =
=========================================*/

document.addEventListener("DOMContentLoaded", () => {

    //-----------------------------------
    // Elementos
    //-----------------------------------

    const searchBtn = document.getElementById("searchBtn");
    const overlay = document.getElementById("searchOverlay");
    const input = document.getElementById("searchInput");
    const results = document.getElementById("searchResults");
    const closeBtn = document.getElementById("closeSearch");

    let pages = [];

    //-----------------------------------
    // Cargar JSON
    //-----------------------------------

    fetch(`${window.location.origin}${window.location.pathname.includes("/noticias/") || window.location.pathname.includes("/simposios/") ? "../../data/search-index.json" : "data/search-index.json"}`)
        .then(response => response.json())
        .then(data => {

            pages = data;

        })
        .catch(error => {

            console.error("No se pudo cargar el índice de búsqueda.");

        });

    //-----------------------------------
    // Abrir
    //-----------------------------------

    function openSearch(){

        overlay.classList.add("active");

        input.value="";

        results.innerHTML="";

        input.focus();

    }

    //-----------------------------------
    // Cerrar
    //-----------------------------------

    function closeSearch(){

        overlay.classList.remove("active");

    }

    //-----------------------------------
    // Eventos
    //-----------------------------------

    if(searchBtn){

        searchBtn.addEventListener("click",openSearch);

    }

    if(closeBtn){

        closeBtn.addEventListener("click",closeSearch);

    }

    //-----------------------------------
    // Click fuera
    //-----------------------------------

    overlay.addEventListener("click",(e)=>{

        if(e.target===overlay){

            closeSearch();

        }

    });

    //-----------------------------------
    // ESC
    //-----------------------------------

    document.addEventListener("keydown",(e)=>{

        if(e.key==="Escape"){

            closeSearch();

        }

    });

    //-----------------------------------
    // CTRL + K
    //-----------------------------------

    document.addEventListener("keydown",(e)=>{

        if(e.ctrlKey && e.key.toLowerCase()==="k"){

            e.preventDefault();

            openSearch();

        }

    });

    //-----------------------------------
    // Buscar
    //-----------------------------------

    input.addEventListener("keyup",()=>{

        const text=input.value.toLowerCase().trim();

        results.innerHTML="";

        if(text===""){

            return;

        }

        const encontrados=pages.filter(item=>{

            return(

                item.titulo.toLowerCase().includes(text)

                ||

                item.descripcion.toLowerCase().includes(text)

                ||

                item.categoria.toLowerCase().includes(text)

            );

        });

        //----------------------------------

        if(encontrados.length===0){

            results.innerHTML=`

                <div class="no-results">

                    <i class="fas fa-search fa-2x"></i>

                    <p>No se encontraron resultados.</p>

                </div>

            `;

            return;

        }

        //----------------------------------

        encontrados.forEach(item=>{

            results.innerHTML+=`

                <div class="result-item" data-url="${item.url}">

                    <div class="result-title">

                        ${item.titulo}

                    </div>

                    <div class="result-category">

                        ${item.categoria}

                    </div>

                    <div class="result-description">

                        ${item.descripcion}

                    </div>

                </div>

            `;

        });

        //----------------------------------

        document.querySelectorAll(".result-item").forEach(card=>{

            card.addEventListener("click",()=>{

                window.location.href=card.dataset.url;

            });

        });

    });

});