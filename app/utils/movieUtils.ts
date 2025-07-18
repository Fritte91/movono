export const fetchTrailerFromTmdbId = async (tmdbId: string): Promise<string | null> => {
  try {
    const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/movie/${tmdbId}/videos?api_key=${TMDB_API_KEY}&language=en-US`;

    const response = await fetch(url);
    const data = await response.json();

    // Check if the results array exists and has videos
    if (!data.results || data.results.length === 0) {
      return null;
    }

    // Look for a YouTube trailer with type 'Trailer' and site 'YouTube'
    const trailer = data.results.find((video: any) =>
      video.type === "Trailer" && video.site === "YouTube"
    );

    if (trailer) {
      // Return the trailer URL from YouTube
      return `https://www.youtube.com/watch?v=${trailer.key}`;
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
};

// A function to fetch TMDb movie data by movie ID
async function fetchTmdbMovieData(tmdbId: string) {
  const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching TMDb movie data:", err);
    return null;
  }
}
  