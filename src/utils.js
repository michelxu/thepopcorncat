//Cargar contenido -->
window.onload = function() {
    //hideFromDom('main-page');
};


//Cargar contenido -->


//Ocultar elements from DOM
function hideFromDom(className){
    className = '.'+className;
    const elements = document.querySelectorAll(className);

    elements.forEach(function(element) {
        element.classList.add("inactive");
    });
}

//Mostrar elements en Dom (eliminando la propiedad inactive)
function showElementsOnDom(className){
    className = '.'+className;
    const elements = document.querySelectorAll(className);

    elements.forEach(function(element) {
        element.classList.remove("inactive");
    });
}
