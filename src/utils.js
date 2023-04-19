
//Variables
const tmdbCategories = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 10770, name: 'TV Movie' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' }
];

//Obtener category (genre) name by id
function getCategoryName(categoryId) {
    const category = tmdbCategories.find(cat => cat.id === categoryId);
    if (category) {
        return category.name;
    }
    return null; // or return a default value if the category is not found
}


//Delete inside div, by id or class
function deleteDivChilds(div, type){
    let parentDiv;
    if(type === 'class'){
        parentDiv = document.querySelector(`.${div}`);
    } else{
        parentDiv = document.querySelector(`#${div}`);
    }

    // Remove all child elements of the parent div
    while (parentDiv.firstChild) {
    parentDiv.removeChild(parentDiv.firstChild);
    }
}


//Obtener duración de película :::input(runtime) -> 111::: output -> 1h 51m
function convertMovieTime(runtime){
    if (runtime == 0) {
        return '(?)';
    }
    const minutes = runtime;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const formattedTime = `${hours}h ${remainingMinutes}m`;

    return formattedTime;
}


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
