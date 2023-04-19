//Variables
let isLoaded = false;

window.onload = function() {
    window.addEventListener('DOMContentLoaded', navigator, false);
    window.addEventListener('hashchange', navigator, false);
    navigator();

    listenerCategoryButtons();
    listenerSearchButton();
    listenerLoadMoreButton();
};

function navigator(){
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
    window.scrollTo(0,0);
}

function mainPage(){
    hideFromDom('movie-page');
    hideFromDom('trending-page');
    showElementsOnDom('main-page');

    deleteDivChilds('scroll-images');
    getLatestMoviesPreview('main-horizontal-scroll');
    hScroll_title.innerHTML = 'Latest Movies';
    hScroll_section.scrollTo(0,0); //horizontal scroll section reset

    if (!isLoaded) {
        getTrendingMoviesPreview('main-trending-movies');
        isLoaded = true; //evitar volver a cargar cuando se navega de vuelta.
    }

    currentPage = 1;
    console.log('navigation currentpage: '+currentPage);
}

function trendingPage(){
    console.log('#trending');
    hideFromDom('main-page');
    hideFromDom('movie-page');
    showElementsOnDom('trending-page');

    AllMoviesPageHeader('Trending');
    deleteDivChilds('all-movies-container');
    getMoviesByCategory('page-trending-movies', null);
}

function searchPage(){
    const inputValue = decodeURI(location.hash.split('=')[1]).trim();
    console.log('#search');
    hideFromDom('main-page');
    hideFromDom('movie-page');
    showElementsOnDom('trending-page');

    deleteDivChilds('all-movies-container');
    AllMoviesPageHeader(`Search-${inputValue}`);
    getMoviesBySearch('page-trending-movies', inputValue);
}

function categoryPage(){
    const category_id = parseInt(location.hash.split('=')[1].split('-')[0]);
    const category_name = location.hash.split('=')[1];

    console.log('#category page: '+category_name);
    hideFromDom('main-page');
    hideFromDom('movie-page');
    showElementsOnDom('trending-page');
    
    deleteDivChilds('all-movies-container');
    AllMoviesPageHeader(category_name, category_id);
    getMoviesByCategory('page-trending-movies', category_id);
}

function moviePage(){
    const movie_id = parseInt(location.hash.split('=')[1]);
    console.log('#movie page: ' + movie_id);
    hideFromDom('main-page');
    hideFromDom('trending-page');
    showElementsOnDom('movie-page');

    getMoviesById(movie_id);

    currentPage = 1;
    console.log('navigation currentpage: '+currentPage);
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
    const search_input = document.getElementById('search_input');
    search_bar.addEventListener('click', () => {
        if (search_input.value.length > 1){
            location.hash = `#search=${search_input.value}`;
        } else{
            window.alert('Please type a valid search');
        }
    });
}


function listenerLoadMoreButton(){
    loadMore_btn.addEventListener('click', () => {
        //console.log('loadmore button: '+location.hash);
        const value = location.hash.split('=')[0];
        
        if (value === '#trending'){
            getMoviesByCategory('page-trending-movies', null);
        }
        
        if (value === '#category'){
            const category_id = parseInt(location.hash.split('=')[1].split('-')[0]);
            getMoviesByCategory('page-trending-movies', category_id);
        }

        if (value === '#search') {
            const inputValue = decodeURI(location.hash.split('=')[1]).trim();
            getMoviesBySearch('page-trending-movies', inputValue);
        }
        
    });
}

//Listener para actualizar la lista de providers según el país
//Providers = plataformas que ofrecen la película
function listenerDropdownMenu(country){
    //Evitar que carguen múltiples veces al mismo país
    if(!country.includes(apiCountry)){
        const movie_id = parseInt(location.hash.split('=')[1]);
        apiCountry = country.split('-')[0];

        whereToWatchMovie(movie_id);
        dropDownCountry_btn.innerHTML = `<i class="bi bi-globe-americas"></i> ${country}`;
    }   
}