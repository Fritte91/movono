// lib/api/getMoviesByTitle.js
export async function getMoviesByTitle(titles) {
    const apiKey = "e2253ed9";
  
    const fetches = titles.map(title =>
      fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`)
        .then(res => res.json())
    );
  
    const results = await Promise.all(fetches);
  
    // Filter out failed lookups and map to your internal Movie format
    return results
      .filter(movie => movie.Response !== "False")
      .map(movie => ({
        id: movie.imdbID,             // ✅ use imdbID as your unique ID
        title: movie.Title,
        year: parseInt(movie.Year),
        posterUrl: movie.Poster !== "N/A" ? movie.Poster : "/placeholder.svg",  // fallback image
      }));
  }
  