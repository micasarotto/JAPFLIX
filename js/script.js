document.addEventListener("DOMContentLoaded", () => {
    let movieData = [];

    // Cargar datos de la API
    fetch('https://japceibal.github.io/japflix_api/movies-data.json')
        .then(response => response.json())
        .then(data => movieData = data)
        .catch(console.error);

    // Buscar y filtrar películas
    document.getElementById('btnBuscar').addEventListener('click', () => {
        const searchTerm = document.getElementById('inputBuscar').value.toLowerCase().trim();
        if (!searchTerm) return alert("Por favor ingrese un término de búsqueda.");

        const filteredMovies = movieData.filter(movie =>
            [movie.title, movie.tagline, movie.overview]
                .some(field => field.toLowerCase().includes(searchTerm)) ||
            movie.genres.some(genre => genre.name.toLowerCase().includes(searchTerm))
        );

        const lista = document.getElementById('lista');
        lista.innerHTML = filteredMovies.length ?
            filteredMovies.map(createMovieListItem).join('') :
            '<li class="list-group-item">No se encontraron resultados.</li>';
    });

    // Crear el HTML para cada película
    const createMovieListItem = movie => `
    <li class="list-group-item bg-dark text-light border-light">
        <h5>${movie.title}</h5>
        <div class="d-flex justify-content-between align-items-center">
            <p>${movie.tagline}</p>
            <div>${getStars(movie.vote_average)}</div>
        </div>
        <button class="btn btn-info" onclick="showMovieDetails(${movie.id})">View More</button>
    </li>`;

    // Mostrar detalles en el modal
    window.showMovieDetails = id => {
        const movie = movieData.find(m => m.id === id);
        if (!movie) return;

        document.getElementById('movieDetailsModalLabel').textContent = movie.title;
        document.getElementById('movieOverview').textContent = movie.overview;
        document.getElementById('movieGenres').innerHTML = movie.genres.map(g => `<li>${g.name}</li>`).join('');
        document.getElementById('movieDetailsDropdown').innerHTML = `
            <li>Release Date: ${movie.release_date.split('-')[0]}</li>
            <li>Runtime: ${movie.runtime} Minutes</li>
            <li>Budget: $${movie.budget.toLocaleString()}</li>
            <li>Revenue: $${movie.revenue.toLocaleString()}</li>
        `;
        new bootstrap.Modal(document.getElementById('movieDetailsModal')).show();
    };

    // Función para convertir el vote_average en estrellas
    const getStars = vote_average => {
        const stars = Math.round(vote_average);
        return Array.from({ length: 10 }, (_, i) =>
            `<i class="fa ${i < stars ? 'fa-star checked' : 'fa-star-o'}"></i>`
        ).join('');
    };
});
