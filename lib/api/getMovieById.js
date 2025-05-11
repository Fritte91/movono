// lib/api/getMovieById.js
export async function getMovieByIdFromAPI(imdbID) {
  const omdbApiKey = process.env.OMDB_API_KEY || "e2253ed9";

  try {
    // Step 1: Get movie details from OMDb
    const omdbRes = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${omdbApiKey}`);
    if (!omdbRes.ok) throw new Error("OMDb API request failed");
    const movie = await omdbRes.json();
    if (movie.Response === "False") return null;

    // Step 2: Search YTS by title
    const ytsRes = await fetch(
      `https://yts.mx/api/v2/list_movies.json?query_term=${encodeURIComponent(movie.Title)}`
    );
    if (!ytsRes.ok) throw new Error("YTS API request failed");
    const ytsData = await ytsRes.json();
    const ytsMovies = ytsData?.data?.movies || [];

    // Step 3: Find best match by title and year
    const ytsMatch = ytsMovies.find(
      (m) =>
        m.title.toLowerCase() === movie.Title.toLowerCase() &&
        (!m.year || m.year === parseInt(movie.Year))
    );

    // Normalize ratings
    const ratings = {
      imdb: parseFloat(movie.imdbRating) || 0,
      rottenTomatoes: 0,
      metacritic: 0,
    };
    movie.Ratings?.forEach((rating) => {
      if (rating.Source === "Rotten Tomatoes") {
        ratings.rottenTomatoes = parseInt(rating.Value) || 0;
      } else if (rating.Source === "Metacritic") {
        ratings.metacritic = parseInt(rating.Value) || 0;
      }
    });

    // Parse runtime, genre, actors
    const runtime = parseInt(movie.Runtime) || 0;
    const genre = movie.Genre ? movie.Genre.split(", ").map((g) => g.trim()) : [];
    const cast = movie.Actors ? movie.Actors.split(", ").map((a) => a.trim()) : [];

    const torrents = ytsMatch?.torrents || [];
    const youtubeTrailerUrl = ytsMatch?.yt_trailer_code
      ? `https://www.youtube.com/watch?v=${ytsMatch.yt_trailer_code}`
      : null;

    return {
      id: movie.imdbID || "",
      title: movie.Title || "Unknown",
      year: parseInt(movie.Year) || 0,
      posterUrl: movie.Poster !== "N/A" ? movie.Poster : "/placeholder.svg",
      plot: movie.Plot || "No plot available",
      rating: movie.imdbRating || "N/A",
      genre,
      runtime,
      director: movie.Director || "Unknown",
      cast,
      ratings,
      torrents,
      youtubeTrailerUrl,
      language: movie.Language || "English",
      userRating: 0,
    };
  } catch (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
}