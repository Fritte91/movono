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

    const tmdbIdMatch = movieId.match(/^tmdb-(\d+)$/);
    if (tmdbIdMatch) {
      tmdbId = tmdbIdMatch[1];
    } else {
      const imdbIdMatch = movieId.match(/^tt\d+$/);
      if (imdbIdMatch) {
        const imdbId = movieId;
        tmdbId = await getTmdbIdFromImdbId(imdbId);
        if (!tmdbId) return [];
      }
    }

    if (!tmdbId || !TMDB_API_KEY) return [];

    const similarUrl = `${TMDB_BASE_URL}/movie/${tmdbId}/similar?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
    const similarResponse = await fetch(similarUrl, { 
      cache: "no-store",
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });

    if (!similarResponse.ok) return [];

    const similarData: TMDBSimilarMoviesResponse = await similarResponse.json();
    const tmdbMovies = (similarData.results || []).slice(0, 4);

    const movies = await Promise.all(
      tmdbMovies.map(async (movie) => {
        const imdbId = await getMovieImdbId(movie.id);
        return {
          id: `tmdb-${movie.id}`,
          title: movie.title || "Unknown Title",
          posterUrl: movie.poster_path
            ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
            : "/placeholder.svg",
          year: movie.release_date ? parseInt(movie.release_date.split("-")[0]) : 0,
          imdbId: imdbId || undefined,
          genre: movie.genre_ids
            ? movie.genre_ids
                .map((id) => TMDB_GENRES[id])
                .filter((genre): genre is string => genre !== undefined)
            : [],
        };
      })
    );

    return movies;
  } catch {
    return [];
  }
}