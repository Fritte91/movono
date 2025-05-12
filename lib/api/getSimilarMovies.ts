import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL, getMovieImdbId, getTmdbIdFromImdbId, mapTMDBGenres } from './tmdb';
import { Movie } from '../movie-data';

interface TMDBSimilarMoviesResponse {
  page: number;
  results: {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
    genre_ids: number[];
    popularity: number;
  }[];
}

interface TMDBMovieDetails {
  id: number;
  genre_ids: number[];
}

export async function getSimilarMovies(movieId: string): Promise<Movie[]> {
  try {
    let tmdbId: string | null = null;

    // Handle TMDB ID format (e.g., "tmdb-550")
    const tmdbIdMatch = movieId.match(/^tmdb-(\d+)$/);
    if (tmdbIdMatch) {
      tmdbId = tmdbIdMatch[1];
    } else {
      // Handle IMDb ID format (e.g., "tt0137523")
      const imdbIdMatch = movieId.match(/^tt\d+$/);
      if (imdbIdMatch) {
        const imdbId = movieId;
        tmdbId = await getTmdbIdFromImdbId(imdbId);
        if (!tmdbId) {
          console.warn(`No TMDB ID found for IMDb ID ${imdbId}`);
          return [];
        }
      }
    }

    if (!tmdbId) {
      console.warn(`Invalid movie ID format: ${movieId}`);
      return [];
    }

    if (!TMDB_API_KEY) {
      console.error("TMDB_API_KEY is not set");
      return [];
    }

    console.log(`Resolved TMDB ID: ${tmdbId}`);

    // Fetch similar movies from TMDB
    const similarUrl = `${TMDB_BASE_URL}/movie/${tmdbId}/similar?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
    console.log("Fetching TMDB Similar Movies URL:", similarUrl);
    const similarResponse = await fetch(similarUrl, { cache: "no-store" });

    if (!similarResponse.ok) {
      const text = await similarResponse.text();
      console.error(`TMDB API error: ${similarResponse.status} ${similarResponse.statusText}`);
      console.error("TMDB Response:", text);
      throw new Error(`TMDB API error: ${similarResponse.status}`);
    }

    const similarData: TMDBSimilarMoviesResponse = await similarResponse.json();
    console.log("TMDB Similar Movies Response:", similarData);
    let tmdbMovies = (similarData.results || []).slice(0, 4); // Limit to 4 movies

    // If no relevant similar movies, fall back to genre-based search
    if (tmdbMovies.length < 4) {
      console.warn(`Only ${tmdbMovies.length} similar movies found for TMDB ID ${tmdbId}, falling back to genre-based search`);
      // Fetch main movie's genres
      const movieDetailsUrl = `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`;
      const movieResponse = await fetch(movieDetailsUrl, { cache: "no-store" });
      if (!movieResponse.ok) {
        console.warn(`Failed to fetch movie details for TMDB ID ${tmdbId}`);
        return tmdbMovies;
      }
      const movieDetails: TMDBMovieDetails = await movieResponse.json();
      const genreIds = movieDetails.genre_ids || [];

      if (genreIds.length > 0) {
        // Fetch movies by genre
        const discoverUrl = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&with_genres=${genreIds.join(",")}&sort_by=popularity.desc&page=1`;
        console.log("Fetching TMDB Discover URL:", discoverUrl);
        const discoverResponse = await fetch(discoverUrl, { cache: "no-store" });
        if (discoverResponse.ok) {
          const discoverData: TMDBSimilarMoviesResponse = await discoverResponse.json();
          // Exclude the main movie and already included movies
          const additionalMovies = (discoverData.results || [])
            .filter((m) => m.id !== parseInt(tmdbId) && !tmdbMovies.some((sm) => sm.id === m.id))
            .slice(0, 4 - tmdbMovies.length);
          tmdbMovies = [...tmdbMovies, ...additionalMovies].slice(0, 4);
        }
      }
    }

    // Map to Movie interface
    const movies = await Promise.all(
      tmdbMovies.map(async (movie) => {
        const imdbId = await getMovieImdbId(movie.id);
        return {
          id: `tmdb-${movie.id}`,
          title: movie.title || "Unknown Title",
          year: movie.release_date ? parseInt(movie.release_date.split("-")[0]) : 0,
          genre: mapTMDBGenres(movie.genre_ids || []),
          posterUrl: movie.poster_path
            ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
            : "/placeholder.svg",
        };
      })
    );

    console.log("Returning similar movies:", movies.map((m) => ({ title: m.title, genres: m.genre })));
    return movies;
  } catch (error) {
    console.error(`Failed to fetch similar movies for movieId ${movieId}:`, error);
    return [];
  }
}