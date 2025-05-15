export interface Movie {
    id: string;
    title: string;
    posterUrl: string;
    year: number;
    imdbId?: string;
    genre?: string[];
  }
  
  const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "765fa06e8b22a3e52c775f28eceef740";
  const TMDB_BASE_URL = "https://api.themoviedb.org/3";
  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
  
  interface TMDBMovie {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
    imdb_id?: string;
    genre_ids?: number[];
  }
  
  // TMDB genre mapping (based on /genre/movie/list)
  const TMDB_GENRES: { [key: number]: string } = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Sci-Fi",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
  };
  
  export async function getUpcomingMovies(): Promise<Movie[]> {
    if (!TMDB_API_KEY) return [];
  
    try {
      const url = `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
      const response = await fetch(url, { 
        cache: "no-store",
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'public, max-age=3600'
        }
      });
  
      if (!response.ok) return [];
  
      const data = await response.json();
      const tmdbMovies: TMDBMovie[] = data.results || [];
  
      const movies = await Promise.all(
        tmdbMovies.slice(0, 10).map(async (movie) => {
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
  
  export async function getMovieImdbId(tmdbId: number): Promise<string | null> {
    if (!TMDB_API_KEY) return null;
  
    try {
      const url = `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`;
      const response = await fetch(url, { 
        cache: "no-store",
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'public, max-age=3600'
        }
      });
  
      if (!response.ok) return null;
  
      const data: TMDBMovie = await response.json();
      return data.imdb_id || null;
    } catch {
      return null;
    }
  }
  
  export async function getTmdbIdFromImdbId(imdbId: string): Promise<number | null> {
    if (!TMDB_API_KEY) return null;
  
    try {
      const url = `${TMDB_BASE_URL}/find/${imdbId}?api_key=${TMDB_API_KEY}&language=en-US&external_source=imdb_id`;
      const response = await fetch(url, { 
        cache: "no-store",
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'public, max-age=3600'
        }
      });
  
      if (!response.ok) return null;
  
      const data = await response.json();
      const movieResults = data.movie_results || [];
      return movieResults.length > 0 ? movieResults[0].id : null;
    } catch {
      return null;
    }
  }
  
  export function mapTMDBGenres(genreIds: number[]): string[] {
    return genreIds
      .map((id) => TMDB_GENRES[id])
      .filter((genre): genre is string => genre !== undefined);
  }
  
  export { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL };