// lib/api/getMovieById.js
export async function getMovieByIdFromAPI(imdbID) {
  const omdbApiKey = process.env.OMDB_API_KEY || "e2253ed9";

  try {
    // Step 1: Get movie details from OMDb
    const omdbRes = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${omdbApiKey}`);
    if (!omdbRes.ok) throw new Error("OMDb API request failed");
    const movie = await omdbRes.json();
    if (movie.Response === "False") return null;

    // Step 2: Search YTS by IMDb ID
    const ytsRes = await fetch(
      `https://yts.mx/api/v2/list_movies.json?query_term=${imdbID}`
    );
    if (!ytsRes.ok) throw new Error("YTS API request failed");
    const ytsData = await ytsRes.json();
    console.log(`YTS data for ${movie.Title} (${imdbID}):`, ytsData); // Debug
    const ytsMovies = ytsData?.data?.movies || [];

    // Step 3: Find best match by IMDb ID, fallback to title and year
    let ytsMatch = ytsMovies.find((m) => m.imdb_code === imdbID);
    if (!ytsMatch) {
      ytsMatch = ytsMovies.find(
        (m) =>
          m.title.toLowerCase() === movie.Title.toLowerCase() &&
          (!m.year || m.year === parseInt(movie.Year))
      );
    }

    // Normalize ratings
    const ratings = {
      imdb: parseFloat(movie.imdbRating) || 0,
      rottenTomatoes:
        movie.Ratings?.find((r) => r.Source === "Rotten Tomatoes")?.Value || "N/A",
      metacritic: parseInt(movie.Metascore) || 0,
    };

    // Parse runtime, genre, actors, etc.
    const runtime = parseInt(movie.Runtime) || 0;
    const genre = movie.Genre ? movie.Genre.split(", ").map((g) => g.trim()) : [];
    const cast = movie.Actors ? movie.Actors.split(", ").map((a) => a.trim()) : [];
    const country = movie.Country ? movie.Country.split(", ").map((c) => c.trim()) : [];
    const language = movie.Language ? movie.Language.split(", ").map((l) => l.trim()) : [];

    // Structure torrents for download buttons
    const torrents = (ytsMatch?.torrents || []).map((torrent) => ({
      url: torrent.url,
      quality: torrent.quality,
      size: torrent.size,
      seeds: torrent.seeds,
      peers: torrent.peers,
    }));

    const youtubeTrailerUrl = ytsMatch?.yt_trailer_code
      ? `https://www.youtube.com/watch?v=${ytsMatch.yt_trailer_code}`
      : null;

    return {
      id: movie.imdbID || "",
      title: movie.Title || "Unknown",
      year: parseInt(movie.Year) || 0,
      posterUrl: movie.Poster !== "N/A" ? movie.Poster : "/placeholder.svg",
      plot: movie.Plot || "No plot available",
      genre,
      runtime,
      director: movie.Director || "Unknown",
      writer: movie.Writer || "Unknown",
      cast,
      country,
      language,
      ratings,
      awards: movie.Awards || "N/A",
      metascore: parseInt(movie.Metascore) || 0,
      imdbVotes: parseInt(movie.imdbVotes?.replace(/,/g, "")) || 0,
      type: movie.Type || "movie",
      dvd: movie.DVD || "N/A",
      boxOffice: movie.BoxOffice || "N/A",
      production: movie.Production || "N/A",
      website: movie.Website || "N/A",
      torrents,
      youtubeTrailerUrl,
      userRating: 0,
    };
  } catch (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
}