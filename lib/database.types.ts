export type Database = {
    public: {
      Tables: {
        comments: {
          Row: {
            id: string;
            movie_id: string;
            user_id: string;
            username: string;
            content: string;
            created_at: string;
          };
          Insert: {
            id?: string;
            movie_id: string;
            user_id: string;
            username: string;
            content: string;
            created_at?: string;
          };
          Update: {
            id?: string;
            movie_id?: string;
            user_id?: string;
            username?: string;
            content?: string;
            created_at?: string;
          };
        };
        movies: {
          Row: {
            id: string;
            title: string;
            year: number;
            poster_url: string | null;
            plot: string | null;
            genre: string[] | null;
            runtime: number | null;
            ratings: { imdb: number; rottenTomatoes: string; metacritic: number } | null;
            torrents: { url: string; quality: string; size: string; seeds: number; peers: number }[] | null;
            youtube_trailer_url: string | null;
            user_rating: number | null;
            created_at: string | null;
            tmdb_id: string | null;
            original_language: string | null;
          };
          Insert: {
            id: string;
            title: string;
            year: number;
            poster_url?: string | null;
            plot?: string | null;
            genre?: string[] | null;
            runtime?: number | null;
            ratings?: { imdb: number; rottenTomatoes: string; metacritic: number } | null;
            torrents?: { url: string; quality: string; size: string; seeds: number; peers: number }[] | null;
            youtube_trailer_url?: string | null;
            user_rating?: number | null;
            created_at?: string | null;
            tmdb_id?: string | null;
            original_language?: string | null;
          };
          Update: {
            id?: string;
            title?: string;
            year?: number;
            poster_url?: string | null;
            plot?: string | null;
            genre?: string[] | null;
            runtime?: number | null;
            ratings?: { imdb: number; rottenTomatoes: string; metacritic: number } | null;
            torrents?: { url: string; quality: string; size: string; seeds: number; peers: number }[] | null;
            youtube_trailer_url?: string | null;
            user_rating?: number | null;
            created_at?: string | null;
            tmdb_id?: string | null;
            original_language?: string | null;
          };
        };
      };
    };
  };