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

//Fns
async function getTrendingMoviesPreview(mainParentDiv, genre){
    //con este IF implementamos 2 páginas más, la página de trending movies (que no es la página principal)
    //y la página de películas por género que también son trending movies sólo con un filtro extra.
    let url;

    console.log('género: '+genre);
    if (genre == undefined){
        url = '/trending/movie/day';
    } else {
        url = 'trending_by_genre';
    }

    const { data } = await api(url);

    const movies = data.results;
    console.log('Trending movies');
    console.log({data, movies});

    try {
        let countMovies = 0;
        movies.forEach(movie => {
            //Desplegar 3 filas (18 movies), la API regresa 20
            if (countMovies === 18) return;
            
            //Situarse en section > div > _here_ para insertar contenido: 
            const sectionElement = document.getElementById(mainParentDiv); //'main-trending-movies'
            const childElement = sectionElement.querySelectorAll('div')[0];

            const movieTemplate = createMovieTemplate(movie); //Llamado a la function que crea los elementos del DOM
            childElement.appendChild(movieTemplate); //insertar        

            

            if (countMovies < 3) {
                //****** Carousel ******
                const carousel = document.getElementById('banner-carousel');
                const childElement1 = carousel.querySelectorAll('div')[0];
                const childElement2 = childElement1.querySelectorAll('div')[0];

                const movieCarouselTemplate = createMovieCarousel(movie, ''); //Llamado a la function que crea los elementos del DOM            
                childElement2.appendChild(movieCarouselTemplate); //insertar 
                //****** Carousel ******
            } else{
                //const divToRemove = document.getElementById("carousel-template");
                //divToRemove.remove();
            }
            

            countMovies += 1; //Max 18 movies
        });

        hideFromDom('main-page-template'); //esconde los templates no las secciones

    } catch (error) {
        console.log(`Error Trending Movies Preview :(! ${error.message}`);
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
            const sectionElement = document.getElementById(mainParentDiv); //'main-latest-movies'
            const childElement = sectionElement.querySelectorAll('div')[0];

            const movieTemplate = createMovieHorizontalScroll(movie); //Llamado a la function que crea los elementos del DOM
            childElement.appendChild(movieTemplate); //insertar   
        });
        hideFromDom('main-page-template');
        
    } catch (error) {
        console.log(`Error Latest Movies Preview :(! ${error.message}`);
    }
}

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

//Crear movies para Horizontal Scroll Section
function createMovieHorizontalScroll(movie){
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
    //childElement.appendChild(containerCarouselItem); en el metodo llamada a api

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
    viewMoreBtn.classList = 'btn btn-danger';
    viewMoreBtn.innerHTML = 'View more';

    aElement.appendChild(movieTitle); //insert
    aElement.appendChild(movieDetails);
    aElement.appendChild(movieDescription);
    aElement.appendChild(viewMoreBtn);

    return containerCarouselItem; // para insertar en la apicall function
}

// **************** Creating DOM Elements ****************


//Llamados iniciales
//getTrendingMoviesPreview('main-trending-movies');
//getLatestMoviesPreview('main-latest-movies');