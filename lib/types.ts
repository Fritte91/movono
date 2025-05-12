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
      imdb?: number;
      rottenTomatoes?: number;
      metacritic?: number;
    };
    language: string;
    country: string;
    similar?: string[];
    torrents?: any; // Adjust based on actual torrent data structure
    youtubeTrailerUrl?: string | null;
    userRating?: number;
  }