import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL, getMovieImdbId, getTmdbIdFromImdbId, mapTMDBGenres, TMDB_GENRES } from './tmdb';
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

export async function getSimilarMovies(movieId: string): Promise<Movie[]> {
  if (!TMDB_API_KEY) return [];

  try {
    // First, try to get TMDB ID from IMDb ID
    const tmdbId = await getTmdbIdFromImdbId(movieId);
    
    if (!tmdbId) {
      return [];
    }

    // Fetch similar movies from TMDB
    const url = `${TMDB_BASE_URL}/movie/${tmdbId}/similar?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
    const response = await fetch(url);

    if (!response.ok) {
      return [];
    }

    const data: TMDBSimilarMoviesResponse = await response.json();
    const tmdbMovies = data.results || [];

    // Take only the first 4 similar movies
    const limitedMovies = tmdbMovies.slice(0, 4);

    const movies = await Promise.all(
      limitedMovies.map(async (movie) => {
        const imdbId = await getMovieImdbId(movie.id);
        const posterUrl = movie.poster_path
          ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
          : "/placeholder.svg";
        
        return {
          id: imdbId || `tmdb-${movie.id}`,
          title: movie.title || "Unknown Title",
          posterUrl: posterUrl,
          year: movie.release_date ? parseInt(movie.release_date.split("-")[0]) : 0,
          imdb_id: imdbId || undefined,
          genre: movie.genre_ids
            ? movie.genre_ids
                .map((id) => TMDB_GENRES[id])
                .filter((genre): genre is string => genre !== undefined)
            : [],
          ratings: {
            imdb: 0,
            rottenTomatoes: "N/A",
            metacritic: 0
          },
          runtime: 0,
          released: movie.release_date || "",
          director: "",
          writer: "",
          actors: [],
          plot: "",
          language: [],
          country: [],
          awards: "",
          metascore: 0,
          imdbVotes: 0,
          type: "movie",
          dvd: "",
          boxOffice: "",
          production: "",
          website: ""
        };
      })
    );

    return movies;
  } catch (error) {
    return [];
  }
}