// lib/types.ts
export interface Movie {
    id: string | number;
    title: string;
    year: number;
    poster_url: string;
    genre: string[];
    ratings: {
      imdb: number;
      rottenTomatoes: string;
      metacritic: number;
    };
    runtime: number;
    released: string;
    director: string;
    writer: string;
    actors: string[];
    plot: string;
    language: string[];
    country: string[];
    awards: string;
    metascore: number;
    imdbVotes: number;
    type: string;
    dvd: string;
    boxOffice: string;
    production: string;
    website: string;
    imdb_id?: string;
}

// Re-export the Movie type for backward compatibility
export type { Movie as DetailedMovie };