const API_KEY = "2d7146e281d69574136c0f8dd2c1f168";

const movieContainer = document.querySelector(".movies");
const searchInput = document.querySelector("#movie-search");
const searchBtn = document.querySelector("#search-btn");
const loadMoreBtn = document.querySelector("#load-more");

let timer;
let currentPage = 1;
let currentSearch = "";
let totalPages = 1;

// Fetch movies
async function getMovies(searchTerm = "", page = 1, append = false) {
    try {
        const endpoint = searchTerm
            ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}&page=${page}`
            : `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`;


        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} `);
        }

        const data = await response.json();

        totalPages = data.total_pages || 1;

        // New search = replace existing movies
        if (!append) {
            movieContainer.innerHTML = "";
        }

        if (!data.results || data.results.length === 0) {
            if (!append) {
                movieContainer.innerHTML = `
            <div class="no-results" >
                    <h2>No movies found</h2>
                    <p>Try searching for another movie.</p>
                </div>
            `;
            }

            loadMoreBtn.style.display = "none";
            return;
        }

        data.results.forEach((movie) => {
            const poster = movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/300x450?text=No+Poster";

            const movieCard = `
            <div class="card" data-movie-id="${movie.id}">
                <div class="card-body">
                    <img src="${poster}" alt="${movie.title}" />
                    <h2>${movie.title}</h2>
                    <p>${movie.release_date || "Not available"}</p>
                    <button class="details-btn" data-movie-id="${movie.id}">
                        Details
                    </button>
                </div>
            </div>
        `;

            movieContainer.insertAdjacentHTML("beforeend", movieCard);
        });

        currentPage = page;

        // Show Load More only when more pages exist
        if (currentPage < totalPages) {
            loadMoreBtn.style.display = "block";
        } else {
            loadMoreBtn.style.display = "none";
        }

    } catch (error) {
        console.error("Failed to fetch movies:", error);
    }

}

// Fetch full movie details
async function getMovieDetails(movieId) {
    try {
        const endpoint =
            `https://api.themoviedb.org/3/movie/${movieId}` +
            `?api_key=${API_KEY}&append_to_response=credits`;


        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} `);
        }

        const movie = await response.json();

        showMovieModal(movie);

    } catch (error) {
        console.error("Failed to fetch movie details:", error);
    }


}

// Display movie details in modal
function showMovieModal(movie) {
    const poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://via.placeholder.com/300x450?text=No+Poster";


    const cast = movie.credits?.cast
        ?.slice(0, 8)
        .map(actor => actor.name)
        .join(", ") || "Not available";

    const genres = movie.genres
        ?.map(genre => genre.name)
        .join(", ") || "Not available";

    const modal = document.querySelector("#movie-modal");

    modal.innerHTML = `
        <div class="modal-content">
        <button class="close-modal">&times;</button>

        <div class="modal-movie">
            <img src="${poster}" alt="${movie.title}" />

            <div class="modal-details">
                <h2>${movie.title}</h2>

                <p class="rating">
                    ⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                    / 10
                </p>

                <p>
                    <strong>Release Date:</strong>
                    ${movie.release_date || "Not available"}
                </p>

                <p>
                    <strong>Genre:</strong>
                    ${genres}
                </p>

                <p>
                    <strong>Cast:</strong>
                    ${cast}
                </p>

                <h3>Plot</h3>
                <p class="overview">
                    ${movie.overview || "No plot information available."}
                </p>
            </div>
        </div>
    </div> `;

    modal.classList.add("active");

    // Close button
    modal.querySelector(".close-modal").addEventListener("click", closeModal);


}

// Close modal
function closeModal() {
    const modal = document.querySelector("#movie-modal");
    modal.classList.remove("active");
}

// Close modal by clicking outside content
document.querySelector("#movie-modal").addEventListener("click", (event) => {
    if (event.target.id === "movie-modal") {
        closeModal();
    }
});

// Event delegation for movie cards
movieContainer.addEventListener("click", (event) => {
    const card = event.target.closest(".card");

    if (!card) return;

    const movieId = card.dataset.movieId;

    getMovieDetails(movieId);


});

// Search button
searchBtn.addEventListener("click", () => {
    const searchTerm = searchInput.value.trim();


    currentSearch = searchTerm;
    currentPage = 1;

    getMovies(currentSearch, 1, false);


});

// Search input
searchInput.addEventListener("input", () => {
    clearTimeout(timer);

    timer = setTimeout(() => {
        const searchTerm = searchInput.value.trim();

        currentSearch = searchTerm;
        currentPage = 1;

        getMovies(currentSearch, 1, false);
    }, 500);


});

// Load more button
loadMoreBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
        getMovies(currentSearch, currentPage + 1, true);
    }
});

// Initial movies
getMovies();
