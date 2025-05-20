// lib/types.ts
export interface Movie {
    id: string;
    title: string;
    year: number;
    director: string;
    cast: string[];
    genre: string[];
    plot: string;
    posterUrl: string;
    trailerUrl?: string;
    runtime: number;
    ratings: {
      imdb: number;
      rottenTomatoes: string;
      metacritic: number;
    };
    language: string[];
    country: string[];
    similar?: string[];
    torrents?: {
      url: string;
      quality: string;
      size: string;
      seeds: number;
      peers: number;
    }[];
    youtubeTrailerUrl?: string | null;
    userRating?: number;
    tmdbId?: string;
    imdbId?: string;
  }

// Re-export the Movie type for backward compatibility
export type { Movie as DetailedMovie };