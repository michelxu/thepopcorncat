//Variables
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    }
});
const baseImgUrl = 'https://image.tmdb.org/t/p/w300'; //from api
const baseBgUrl = 'https://image.tmdb.org/t/p/original'; //from api
const defaultPosterImg = '../img/default-poster-movie.png';
const defaultBannerImg = '../img/cat_bg_3.png';

let currentPage = 1;
let apiLanguage = 'en-US'; // &language=en-US
let apiCountry = 'US'; //&watch_region=US

//Trending movies de la main page & main carousel
async function getTrendingMoviesPreview(mainParentDiv){
    const { data } = await api('/trending/movie/day');

    const movies = data.results;
    //console.log('Trending movies');
    //console.log({data, movies});

    try {
        let countMovies = 0;

        movies.forEach(movie => {
            //************ Main Page Trending ************
            if (countMovies === 18) return; //Display 18 movies (3 rows)
            
            //Situarse en section > div > _here_ para insertar contenido: 
            const sectionElement = document.getElementById(mainParentDiv); //'main-trending-movies'
            const childElement = sectionElement.querySelectorAll('div')[0];

            const movieTemplate = createMovieTemplate(movie); //create DOM elements
            childElement.appendChild(movieTemplate); //insertar        
            //************ Main Page Trending ************

            
            //************ Carousel ************
            if (countMovies < 5) { //# of movies to display
                const carousel = document.getElementById('banner-carousel');

                const childElement1 = carousel.querySelectorAll('div')[0];
                const childElement2 = childElement1.querySelectorAll('div')[0];

                let movieCarouselTemplate;
                if (countMovies === 1) {
                    movieCarouselTemplate = createMovieCarousel(movie, 'active');//movie, 'active' or ''
                    const divToRemove = document.getElementById("carousel-template");
                    divToRemove.remove();
                } else{
                    movieCarouselTemplate = createMovieCarousel(movie, '');//movie, 'active' or ''
                }
                
                childElement2.appendChild(movieCarouselTemplate); //insertar 
            }
            //************ Carousel ************
            

            countMovies += 1; //Max 18 movies
        });

        hideFromDom('main-page-template'); //esconde los templates no las secciones

    } catch (error) {
        console.log(`Error Trending Movies Preview :(! ${error.message}`);
    }
}

//Si no se le pasa un id, obtendrá movies-trending para la página trending
async function getMoviesByCategory(mainParentDiv, category_id){
    //Búsqueda por género o todas las movies
    let url;
    console.log('current page: '+currentPage);

    if(category_id){
        url = `/discover/movie?with_genres=${category_id}&page=${currentPage}&sort_by=popularity.desc`;
    } else {
        url = `/trending/movie/day?page=${currentPage}`;
    }
    currentPage++;
    
    const { data } = await api(url);
    const movies = data.results;
    console.log('Movies: ');
    console.log({data, movies});

    //Modificar banner
    const randomNumber = Math.floor(Math.random() * 20);
    movieBanner_img.setAttribute('src', `${baseBgUrl}${movies[randomNumber].backdrop_path}`);

    try {
        movies.forEach(movie => {
            //Situarse en section > div > _here_ para insertar contenido: 
            const sectionElement = document.getElementById(mainParentDiv); //'page-trending-movies'
            const childElement = sectionElement.querySelectorAll('div')[0];

            const movieTemplate = createMovieAllMoviesPage(movie); //create DOM elements
            childElement.appendChild(movieTemplate); //insertar        
        });
        hideFromDom('page-trending-template');
    } catch (error) {
        console.log(`Error getMoviesByCategory :(! ${error.message}`);
    }
}

//Latest Movies Main Page H-Scroll
async function getLatestMoviesPreview(mainParentDiv){
    //today date
    const todayDate = new Date().toISOString().substring(0, 10); //yyyy-mm-dd
    const { data } = await api(`/discover/movie?sort_by=release_date.desc&primary_release_date.lte=${todayDate}&vote_count.gte=2&language=us`);

    const movies = data.results;
    console.log('Latest movies');
    console.log({data, movies});

    try {
        movies.forEach(movie => {        
            //Situarse en section > _here_ para insertar contenido: 
            const sectionElement = document.getElementById(mainParentDiv); //'main-horizontal-scroll'
            const childElement = sectionElement.querySelectorAll('div')[0];

            const movieTemplate = createMovieHorizontalScroll(movie); //Llamado a la function que crea los elementos del DOM
            childElement.appendChild(movieTemplate); //insertar   
        });
        hideFromDom('main-page-template');
        
    } catch (error) {
        console.log(`Error Latest Movies Preview :(! ${error.message}`);
    }
}

//Búsqueda por query
async function getMoviesBySearch(mainParentDiv, query){
    const { data } = await api(`/search/movie?query=${query}&page=${currentPage}`);
    currentPage++;

    const movies = data.results;
    console.log('Query search: ' + query);
    console.log({data});
    
    if (movies.length === 0) {
        window.alert('No más resultados');
        //loadMore_btn.classList.add('disabled');
        return;
    }

    try {
        movies.forEach(movie => {
            //Situarse en section > div > _here_ para insertar contenido: 
            const sectionElement = document.getElementById(mainParentDiv); //'page-trending-movies'
            const childElement = sectionElement.querySelectorAll('div')[0];

            const movieTemplate = createMovieAllMoviesPage(movie); //create DOM elements
            childElement.appendChild(movieTemplate); //insertar     
        });
    } catch (error) {
        console.log(`Error searching movie by query :(! ${error.message}`);
    }
}

//Obtener una sola película *para movie page
async function getMoviesById(id){
    const { data } = await api(`/movie/${id}`);

    const movie = data;
    console.log('Movie by id:');
    console.log({data});

    try {
        //Modificar el DOM con movie data
        fillMoviePage(movie);

        //Crear sección RelatedMovies ::: 1.clear section 2.get/insert movies  3.show section
        deleteDivChilds('scroll-images');
        getRelatedMoviesById(id, 'main-horizontal-scroll');
        showElementsOnDom('horizontal-scroll');

        //Crear sección Providers 
        whereToWatchMovie(id);

    } catch (error) {
        console.log(`Error searching movie by query :(! ${error.message}`);
    }
}

//Películas relacionadas *sección de movie page
async function getRelatedMoviesById(id, mainParentDiv){
    const { data } = await api(`/movie/${id}/similar`);

    const movies = data.results;
    console.log(`--> Related movies to: ${id} (${movies.length})`);
    console.log({data, movies});

    try {
        if (movies.length > 0){
            movies.forEach(movie => {        
                //Situarse en section > _here_ para insertar contenido: 
                const sectionElement = document.getElementById(mainParentDiv); //'main-horizontal-scroll'
                const childElement = sectionElement.querySelectorAll('div')[0];
    
                const movieTemplate = createMovieHorizontalScroll(movie); //Llamado a la function que crea los elementos del DOM
                childElement.appendChild(movieTemplate); //insertar   

                //Modificar related movies título
                hScroll_title.innerHTML = 'Related movies';
            });
        } else{
            //No related movies ::: hide section but title
            hideFromDom('main-page');
            hScrollHeader_section.classList.remove('inactive');
            hScroll_title.innerHTML = 'No related movies';
        } 
        
    } catch (error) {
        console.log(`Error related movies by id :(! ${error.message}`);
    }

    
}


async function whereToWatchMovie(id){
    //Limpiar la sección primero
    deleteDivChilds('movie-on-streaming-container', 'class');
    deleteDivChilds('movie-on-free-container', 'class');
    onStreaming_title.className = 'movie-on-streaming-title text-light fw-medium ms-0 mb-1';
    onFree_title.className = 'movie-on-free-title text-light fw-medium ms-0 mb-1';

    //const type = ''; //flatrate, ads, rent, buy
    const url = `/movie/${id}/watch/providers`;
    const { data } = await api(url);
    console.log('--> Providers full data: ');
    console.log({data});

    const providerStreaming = data.results[apiCountry]?.flatrate ?? null;
    const providerFree = data.results[apiCountry]?.ads ?? null;
    console.log(`-->  Providers by id ${apiCountry} flatrate`);
    console.log(providerStreaming);
    console.log(`--> Providers by id ${apiCountry} ads(free)`);
    console.log(providerFree);
    
    try {
        //*********** Provider Streaming
        if (providerStreaming){
            providerStreaming.forEach(provider => {
                //Modificar el DOM con movie data
                createProvider(provider, 'movie-on-streaming-container');
            });
            onStreaming_title.innerText = `On streaming (${apiCountry})`;
        } else {
            onStreaming_title.innerText = `No streaming options (${apiCountry})`;
            onStreaming_title.className = 'movie-on-streaming-title text-secondary fw-medium ms-0 mb-1';
        }

        //*********** Provider Ads/free
        if (providerFree){
            providerFree.forEach(provider2 => {
                //Modificar el DOM con movie data
                createProvider(provider2, 'movie-on-free-container');
            });
            onFree_title.innerText = `For free (${apiCountry})`;
        } else {
            onFree_title.innerText = `No free options (${apiCountry})`;
            onFree_title.className = 'movie-on-free-title text-secondary fw-medium ms-0 mb-1';
        }
    } catch (error) {
        console.log(`Error whereToWatchMovie :(! ${error.message}`);
    }
}


//MODIFY banner title and navigation text for category/trending page
function AllMoviesPageHeader(cat_name, category_id) {
    let category_name = cat_name;
    let navigation_name = cat_name;
    //category_name = !category_id ? 'Trending' : getCategoryName(category_id);
    if (category_id) {
        const catname = getCategoryName(category_id);
        category_name = `${catname}`;
        navigation_name = `Categories > ${catname}`;
    } else if(category_name.includes('Search')){
        category_name = `Search for: ${cat_name.split('-')[1]}`;
        navigation_name = `Search > ${cat_name.split('-')[1]}`;
    }

    const navigationDiv = document.getElementById('navigation-all-movies');
    childText = navigationDiv.querySelectorAll('a')[1];
    childText.innerHTML = `${navigation_name}`; 

    const bannerDiv = document.getElementById('banner-all-movies-title');
    childText = bannerDiv.querySelectorAll('h2')[0];
    childText.innerHTML = `${category_name}`; 
    
}



/* **************************************************** */
// **************** Creating DOM Elements ****************
//Crear Template full movies (6 movies por fila)
function createMovieTemplate(movie){
    //Crear DIV container para cada movie
    const containerMovie = document.createElement('div');
    containerMovie.className = 'col-6 col-sm-4 col-md-3 col-lg-2 mb-3 text-center';
    //childElement.appendChild(containerMovie);
    
    //Crear <a> para dar url al div
    const aElement = document.createElement('a');
    aElement.href = `#movie=${movie.id}`;
    aElement.title = movie.title;
    aElement.className = 'thumbnail-2';
    containerMovie.appendChild(aElement);

    //Crear Div que posiciona el release date dentro de la img
    const imgContainer = document.createElement('div');
    imgContainer.classList.add('movie-image-container');
    aElement.appendChild(imgContainer);

    //Crear IMG Movie poster
    const movieImg = document.createElement('img');
    const movieImgUrl = baseImgUrl + movie.poster_path;
    movieImg.setAttribute('src', movieImgUrl);
    movieImg.classList = 'rounded-2 mb-2 thumbnail';
    movieImg.height = 225;
    movieImg.width = 150;
    imgContainer.appendChild(movieImg);

    //Crear btn txt de release date
    const releaseBtn = document.createElement('button');
    releaseBtn.className = 'release-year mb-3 ms-2';
    releaseBtn.innerHTML = movie.release_date.substring(0, 4);
    imgContainer.appendChild(releaseBtn);

    //Crear <p> título
    const title = document.createElement('p');
    title.classList = 'main-page-movie-title';
    title.innerText = movie.title;
    aElement.appendChild(title);

    return containerMovie;
}

//Template para la sección completa de trendings, cualquier category, etc. (6 movies por fila)
function createMovieAllMoviesPage(movie){
    //Crear main div container
    const containerMovie = document.createElement('div');
    containerMovie.className = 'col-6 col-sm-4 col-md-3 col-lg-2 mb-3 text-center';
    //childElement.appendChild(containerMovie);
    
    //Crear <a> para dar url al div
    const aElement = document.createElement('a');
    aElement.href = `#movie=${movie.id}`;
    aElement.title = movie.title;
    aElement.className = 'thumbnail-2';
    containerMovie.appendChild(aElement);

    //Crear Div que posiciona el release date dentro de la img
    const imgContainer = document.createElement('div');
    imgContainer.classList.add('movie-image-container');
    aElement.appendChild(imgContainer);

    //Crear IMG Movie poster
    const movieImg = document.createElement('img');
    //const movieImgUrl = baseImgUrl + movie.poster_path;
    const movieImgUrl = (movie.poster_path ? baseImgUrl + movie.poster_path : null) ?? defaultPosterImg;
    movieImg.setAttribute('src', movieImgUrl);
    movieImg.classList = 'rounded-2 mb-2 thumbnail';
    movieImg.height = 225;
    movieImg.width = 150;
    imgContainer.appendChild(movieImg);

    //Crear btn txt de release date
    const releaseYear = movie.release_date?.substring(0, 4) || 'soon';
    const releaseBtn = document.createElement('button');
    releaseBtn.className = 'release-year mb-3 ms-2';
    releaseBtn.innerHTML = releaseYear;
    imgContainer.appendChild(releaseBtn);

    //Crear <p> título
    const title = document.createElement('p');
    title.classList = 'main-page-movie-title';
    title.innerText = movie.title;
    aElement.appendChild(title);

    return containerMovie;
}

function fillMoviePage(movie){
    movie_duration = convertMovieTime(movie.runtime);
    const movie_poster = (movie.poster_path ? baseImgUrl + movie.poster_path : null) ?? defaultPosterImg;
    const movie_banner = (movie.backdrop_path ? baseBgUrl + movie.backdrop_path : null) ?? defaultBannerImg;

    // get the elements to edit
    const bannerSection = document.getElementById("banner-movie-page");
    const movieBanner = bannerSection.querySelector("img");

    const contentSection = document.getElementById("content-movie-page");
    const movieThumbnail = contentSection.querySelector(".thumbnail");
    const movieTitle = contentSection.querySelector(".movie-title");
    const movieGenre = contentSection.querySelector(".movie-genre");
    const movieRating = contentSection.querySelector(".movie-rating");
    const movieReleaseYear = contentSection.querySelector(".movie-release-year");
    const movieDuration = contentSection.querySelector(".movie-duration");
    const movieDescription = contentSection.querySelector(".movie-description");

    //set the movie content
    movieBanner.src = `${movie_banner}`;
    movieThumbnail.src = `${movie_poster}`;
    movieTitle.textContent = movie.title;
    movieGenre.textContent = `Genre(s): ${movie.genres.map(genre => genre.name).join(", ")}`; //map y join para obtener los géneros del array
    movieRating.textContent = `Language: ${movie.original_language}`;
    movieReleaseYear.textContent = `Release: ${movie.release_date}`;
    movieDuration.textContent = `Duration: ${movie_duration}`;
    movieDescription.textContent = movie.overview;

    //Movie navigation bar over the movie poster -> > Movie > Title (2019)
    const navigationDiv = document.getElementById('content-movie-page');
    childText = navigationDiv.querySelectorAll('a')[1];
    childText.innerHTML = `Movie > ${movie.original_title}`;
}

//Crear movies para Horizontal Scroll Section
function createMovieHorizontalScroll(movie){
    const movie_poster = (movie.poster_path ? baseImgUrl + movie.poster_path : null) ?? defaultPosterImg;

    //Crear DIV container para cada movie
    const containerMovie = document.createElement('div');
    containerMovie.className = 'movie-item';
    containerMovie.style.maxWidth = '150px';
    //childElement.appendChild(containerMovie);

    //Crear <a> para dar url al div
    const aElement = document.createElement('a');
    aElement.href = `#movie=${movie.id}`;
    aElement.title = movie.title;
    aElement.className = 'thumbnail-2';
    containerMovie.appendChild(aElement);

    //Crear Div que posiciona el release date dentro de la img
    const imgContainer = document.createElement('div');
    imgContainer.classList.add('movie-image-container');
    aElement.appendChild(imgContainer);

    //Crear IMG Movie poster
    const movieImg = document.createElement('img');
    const movieImgUrl = movie_poster;
    movieImg.setAttribute('src', movieImgUrl);
    movieImg.classList = 'rounded-2 mb-2 thumbnail';
    movieImg.height = 225;
    movieImg.width = 150;
    imgContainer.appendChild(movieImg);

    //Crear btn txt de release date
    const releaseBtn = document.createElement('button');
    releaseBtn.className = 'release-year mb-3 ms-2';
    releaseBtn.innerHTML = movie.release_date.substring(0, 4);
    imgContainer.appendChild(releaseBtn);

    //Crear <p> título
    const title = document.createElement('p');
    title.classList = 'main-page-movie-title mb-3';
    title.innerText = movie.title;
    aElement.appendChild(title);

    return containerMovie;
}

//Crear movies para carousel section
function createMovieCarousel(movie, item_active){
    //Crear DIV container para cada element del carousel
    const containerCarouselItem = document.createElement('div');
    containerCarouselItem.classList = `carousel-item ${item_active}`;
    //childElement.appendChild(containerCarouselItem); linea en getTrendingMoviesPreview()

    //Crear IMG Movie banner
    const movieImg = document.createElement('img');
    const movieImgUrl = baseBgUrl + movie.backdrop_path;
    movieImg.setAttribute('src', movieImgUrl);
    movieImg.classList = 'img-banner';
    containerCarouselItem.appendChild(movieImg); //insert

    //Crear div fade img
    const divFadeImg = document.createElement('div');
    divFadeImg.classList = 'position-absolute bottom-0 w-100 banner-overlay';
    containerCarouselItem.appendChild(divFadeImg); //insert

    //Crear div contenedor de movie details
    const divMovieDetails = document.createElement('div');
    divMovieDetails.classList = 'position-absolute top-50 start-50 translate-middle banner-description text-start';
    containerCarouselItem.appendChild(divMovieDetails); //insert

    //Crear <a> element w href
    const aElement = document.createElement('a');
    aElement.href = `#movie=${movie.id}`;
    divMovieDetails.appendChild(aElement); //insert

    //Crear Movie title, details, description, btn
    const movieTitle = document.createElement('h2');
    movieTitle.innerText = `${movie.title}`;

    const movieDetails = document.createElement('p');
    movieDetails.innerText = `${movie.release_date}`;
    
    const movieDescription = document.createElement('p');
    movieDescription.innerText = `${movie.overview}`;

    const viewMoreBtn = document.createElement('button');
    viewMoreBtn.classList = 'btn btn-warning';
    viewMoreBtn.innerHTML = 'View more';

    aElement.appendChild(movieTitle); //insert
    aElement.appendChild(movieDetails);
    aElement.appendChild(movieDescription);
    aElement.appendChild(viewMoreBtn);

    return containerCarouselItem; // para insertar en la apicall function
}

//Crear providers para whereToWatchMovie
function createProvider(provider, div){
    const logo = baseBgUrl+provider.logo_path;

    const container = document.querySelector(`.${div}`);

    //Crear a element to wrap the img
    const aElement = document.createElement('a');
    aElement.setAttribute('href', `https://www.google.com/search?q=${movie_title.innerText} ${provider.provider_name}`);
    aElement.setAttribute('target', '_blank')

    container.appendChild(aElement); //insert

    //Crear img logo provider
    const imgProvider = document.createElement('img');
    imgProvider.setAttribute('src', logo);
    imgProvider.setAttribute('alt', provider.provider_name);
    imgProvider.classList = 'img-fluid rounded-3 me-3 mb-2 thumbnail';
    imgProvider.style.maxHeight = '40px';

    aElement.appendChild(imgProvider); //insert
}

// **************** Creating DOM Elements ****************