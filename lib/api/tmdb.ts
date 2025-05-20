import { Movie } from '@/lib/types';

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

import { DetailedMovie } from "@/app/members/movie/[id]/page";

interface Video {
  site: string;
  type: string;
  official: boolean;
  key: string;
}

interface Person {
  name: string;
  job?: string;
}

interface Country {
  iso_3166_1: string;
  release_dates: Array<{ release_date: string }>;
}

interface Genre {
  name: string;
}

interface Language {
  english_name: string;
}

interface ProductionCompany {
  name: string;
}

interface TMDBMovieResponse {
  id: number;
  title: string;
  poster_path: string | null;
  videos?: {
    results: Video[];
  };
  credits?: {
    crew: Person[];
    cast: Person[];
  };
  release_dates?: {
    results: Country[];
  };
  release_date?: string;
  runtime: number;
  spoken_languages?: Language[];
  production_countries?: { name: string }[];
  genres?: Genre[];
  overview: string;
  production_companies?: ProductionCompany[];
  vote_average?: number;
}

export async function getMovieFromTmdbById(tmdbId: number): Promise<DetailedMovie | null> {
  if (!TMDB_API_KEY) {
    console.error("TMDB API key is not configured.");
    return null;
  }

  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits,release_dates`);
    
    if (!response.ok) {
      console.error(`Error fetching movie from TMDB: ${response.statusText}`);
      return null;
    }
    
    const data: TMDBMovieResponse = await response.json();

    // Find the official trailer (or the first available video if no official trailer)
    const trailer = data.videos?.results?.find(
      (video) => video.site === 'YouTube' && video.type === 'Trailer' && video.official
    ) || data.videos?.results?.find((video) => video.site === 'YouTube' && video.type === 'Trailer');

    // Find the director and cast (limit to first 5 cast members)
    const director = data.credits?.crew?.find((person) => person.job === 'Director')?.name;
    const cast = data.credits?.cast?.slice(0, 5).map((person) => person.name);

    // Find the US release date to extract year
    const releaseDateUS = data.release_dates?.results?.find((country) => country.iso_3166_1 === 'US');
    const year = releaseDateUS?.release_dates?.[0]?.release_date ? new Date(releaseDateUS.release_dates[0].release_date).getFullYear() : (data.release_date ? new Date(data.release_date).getFullYear() : undefined);

    return {
      id: data.id.toString(),
      title: data.title,
      posterUrl: data.poster_path ? `${TMDB_IMAGE_BASE_URL}${data.poster_path}` : '/placeholder.svg',
      youtubeTrailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
      year: year ?? 0,
      runtime: data.runtime ?? 0,
      language: [data.spoken_languages?.[0]?.english_name ?? ''],
      country: [data.production_countries?.[0]?.name ?? ''],
      genre: data.genres?.map(g => g.name) ?? [],
      plot: data.overview ?? '',
      director: director ?? '',
      cast: cast ?? [],
      ratings: {
        imdb: data.vote_average ?? 0,
        rottenTomatoes: '0',
        metacritic: 0
      }
    };
  } catch (error) {
    console.error('Error in getMovieFromTmdbById:', error);
    return null;
  }
}