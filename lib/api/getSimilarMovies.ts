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

interface TMDBMovieDetails {
  id: number;
  genre_ids: number[];
}

export async function getSimilarMovies(movieId: string): Promise<Movie[]> {
  try {
    let tmdbId: string | null = null;

    // Handle both IMDb IDs and TMDB IDs
    if (movieId.startsWith('tt')) {
      const id = await getTmdbIdFromImdbId(movieId);
      tmdbId = id ? id.toString() : null;
    } else if (movieId.startsWith('tmdb-')) {
      tmdbId = movieId.replace('tmdb-', '');
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

    console.log('TMDB Movies:', tmdbMovies.map(m => ({ title: m.title, poster_path: m.poster_path })));

    const movies = await Promise.all(
      tmdbMovies.map(async (movie) => {
        const imdbId = await getMovieImdbId(movie.id);
        const posterUrl = movie.poster_path
          ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
          : "/placeholder.svg";
        
        console.log('Movie poster URL:', { title: movie.title, posterUrl });
        
        return {
          id: imdbId || `tmdb-${movie.id}`,
          title: movie.title || "Unknown Title",
          poster_url: posterUrl,
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

    console.log('Final movies:', movies.map(m => ({ title: m.title, poster_url: m.poster_url })));
    return movies;
  } catch (error) {
    console.error('Error fetching similar movies:', error);
    return [];
  }
}