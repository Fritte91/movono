export const fetchTrailerFromTmdbId = async (tmdbId: string): Promise<string | null> => {
    console.log("Fetching trailer for TMDb ID:", tmdbId);
  
    try {
      const TMDB_API_KEY = "765fa06e8b22a3e52c775f28eceef740"; // Replace with your TMDB API Key
      const url = `https://api.themoviedb.org/3/movie/${tmdbId}/videos?api_key=${TMDB_API_KEY}&language=en-US`;
  
      const response = await fetch(url);
      const data = await response.json();
  
      // Log the data for debugging
      console.log("TMDb Video Data:", JSON.stringify(data, null, 2));
  
      // Check if the results array exists and has videos
      if (!data.results || data.results.length === 0) {
        console.warn("No video results found for this movie.");
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
        console.warn("No valid YouTube trailer found.");
        return null;
      }
    } catch (err) {
      console.error("Error fetching trailer:", err);
      return null;
    }
  };
  
  // A function to fetch TMDb movie data by movie ID
  async function fetchTmdbMovieData(tmdbId: string) {
    const TMDB_API_KEY = "765fa06e8b22a3e52c775f28eceef740"; // Replace with your TMDB API Key
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
  