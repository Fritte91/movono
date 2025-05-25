// lib/api/getMoviesByTitle.js
export async function getMoviesByTitle(titles) {
  const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;

  const fetches = titles.map((title) =>
    fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`)
      .then((res) => res.json())
  );

  const results = await Promise.all(fetches);

  return results
    .filter((movie) => movie.Response === "True")
    .map((movie) => ({
      ...movie,
      id: movie.imdbID,
      title: movie.Title || "Unknown Title",
      year: parseInt(movie.Year) || 0,
      posterUrl: movie.Poster !== "N/A" ? movie.Poster : "/placeholder.svg",
      genre: movie.Genre ? movie.Genre.split(", ").map((g) => g.trim()) : [],
      ratings: {
        imdb: parseFloat(movie.imdbRating) || 0,
        rottenTomatoes:
          movie.Ratings?.find((r) => r.Source === "Rotten Tomatoes")?.Value || "N/A",
        metacritic: parseInt(movie.Metascore) || 0,
      },
      runtime: parseInt(movie.Runtime) || 0,
      released: movie.Released || "N/A",
      director: movie.Director || "N/A",
      writer: movie.Writer || "N/A",
      actors: movie.Actors ? movie.Actors.split(", ").map((a) => a.trim()) : [],
      plot: movie.Plot || "N/A",
      language: movie.Language ? movie.Language.split(", ").map((l) => l.trim()) : [],
      country: movie.Country ? movie.Country.split(", ").map((c) => c.trim()) : [],
      awards: movie.Awards || "N/A",
      metascore: parseInt(movie.Metascore) || 0,
      imdbVotes: parseInt(movie.imdbVotes?.replace(/,/g, "")) || 0,
      type: movie.Type || "movie",
      youtubeTrailerUrl: null,
      torrents: [],
      dvd: movie.DVD || "N/A",
      boxOffice: movie.BoxOffice || "N/A",
      production: movie.Production || "N/A",
      website: movie.Website || "N/A",
    }));
}