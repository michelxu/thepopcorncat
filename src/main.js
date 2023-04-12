

async function getTrendingMoviesPreview(){
    const baseUrl = 'https://image.tmdb.org/t/p/w300';

    const response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`);
    const data = await response.json();

    const movies = data.results;
    console.log({data, movies});
    
    movies.forEach(movie => {
        const movieImg = document.createElement('img');
        const movieImgUrl = baseUrl + movie.poster_path;
        movieImg.setAttribute('src', movieImgUrl);
        console.log(movieImgUrl);

    });    
}

getTrendingMoviesPreview();