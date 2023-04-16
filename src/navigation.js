//Variables
let isLoaded = false;

window.onload = function() {
    window.addEventListener('DOMContentLoaded', navigator, false);
    window.addEventListener('hashchange', navigator, false);
    navigator();
    listenerCategoryButtons();
    listenerSearchButton();
};

function navigator(){
    console.log({ location });

    if (location.hash.length === 0 || location.hash.length === 1){
        mainPage();

    } else if(location.hash.startsWith('#trends')){
        trendingPage();

    } else if(location.hash.startsWith('#search')){
        searchPage();

    } else if(location.hash.startsWith('#category')){
        categoryPage();

    }
    else if(location.hash.startsWith('#movie')){
        moviePage();

    } else{
        mainPage();
    }
}

function mainPage(){
    console.log('Main page');
    hideFromDom('movie-page');
    //hideFromDom('trending-page');
    //hideFromDom('search-page');
    //hideFromDom('category-page');
    showElementsOnDom('main-page');

    if (!isLoaded) {
        getTrendingMoviesPreview('main-trending-movies');
        getLatestMoviesPreview('main-latest-movies');

        isLoaded = true; //evitar volver a cargar cuando se navega de vuelta.
    }
}

function trendingPage(){
    console.log('Trending movies page');
}

function searchPage(){
    console.log('Search page');
    hideFromDom('main-page');
}

function categoryPage(){
    console.log('Categories page');
}

function moviePage(){
    console.log('Movie full page');
    hideFromDom('main-page');
    showElementsOnDom('movie-page');
}

//Listener para las categorias btns
function listenerCategoryButtons(){
    // Get the buttons container
    const categoryButtons = document.getElementById('category-buttons');

    // Add an event listener to the container for button clicks
    categoryButtons.addEventListener('click', (event) => {
    // Check if the clicked element is a button
    if (event.target.nodeName === 'BUTTON') {
        // Get the data-genre-id attribute value
        const genreId = event.target.getAttribute('data-genre-id');
        // Get the button innerHTML
        const buttonHtml = event.target.innerHTML;
        // Change the URL
        window.location.href = `#category=${genreId}-${buttonHtml}`;
    }
    });
}

function listenerSearchButton(){
    const search_bar = document.getElementById('search_bar');
    search_bar.addEventListener('click', () => {
        location.hash = '#search=';
    });
}
