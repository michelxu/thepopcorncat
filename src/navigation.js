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

    } else if(location.hash.startsWith('#trending')){
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
    console.log('Estás en la main page');
    hideFromDom('movie-page');
    hideFromDom('trending-page');
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
    hideFromDom('main-page');
    hideFromDom('movie-page');
    //hideFromDom('search-page');
    //hideFromDom('category-page');
    showElementsOnDom('trending-page');
    window.scrollTo(0,0);
}

function searchPage(){
    console.log('Search page');
    hideFromDom('main-page');
    hideFromDom('trending-page');
    hideFromDom('movie-page');
    //hideFromDom('category-page');
    showElementsOnDom('search-page');
}

function categoryPage(){
    console.log('Categories page');
    hideFromDom('main-page');
    hideFromDom('movie-page');
    //hideFromDom('search-page');
    //hideFromDom('category-page');
    showElementsOnDom('trending-page');
}

function moviePage(){
    console.log('Movie full page');
    hideFromDom('main-page');
    hideFromDom('trending-page');
    //hideFromDom('search-page');
    //hideFromDom('category-page');
    showElementsOnDom('movie-page');
    window.scrollTo(0,0);
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
