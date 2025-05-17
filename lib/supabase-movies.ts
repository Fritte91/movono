import { createClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Movie } from './movie-data';

interface FetchMoviesOptions {
  genre?: string;
  minYear?: number;
  maxYear?: number;
  minImdb?: number;
  sortBy?: string;
  limit?: number;
  language?: string;
  offset?: number;
}

// Client-side version
export async function fetchMoviesFromSupabaseClient(
  type: "popular" | "top_rated" | "new_releases" | "coming_soon" | "genre",
  options: {
    genre?: string;
    offset?: number;
  } = {}
) {
  const supabase = createClientComponentClient();
  let query = supabase
    .from("movies")
    .select("*")
    .range(options.offset || 0, (options.offset || 0) + 19);

  switch (type) {
    case "popular":
      query = query
        .gte("year", 1990)
        .lte("year", 2025)
        .gte("ratings->>imdb", 6)
        .order("ratings->>imdb", { ascending: false });
      break;
    case "top_rated":
      query = query
        .gte("year", 2000)
        .lte("year", 2025)
        .gte("ratings->>imdb", 8)
        .order("ratings->>imdb", { ascending: false });
      break;
    case "new_releases":
      query = query
        .eq("year", 2024)
        .gte("ratings->>imdb", 6)
        .order("year", { ascending: false });
      break;
    case "genre":
      if (options.genre) {
        query = query
          .overlaps("genre", [options.genre])
          .gte("year", 1990)
          .lte("year", 2025)
          .gte("ratings->>imdb", 6)
          .order("year", { ascending: false });
      }
      break;
  }

  const { data: movies, error } = await query;

  if (error) {
    console.error("Error fetching movies:", error);
    return [];
  }

  return movies.map((movie: any) => ({
    ...movie,
    posterUrl: movie.poster_url || movie.posterUrl || '/placeholder.svg',
  }));
}

// Server-side version (keep the existing implementation)
export async function fetchMoviesFromSupabase({
  genre,
  minYear = 2000,
  maxYear = 2025,
  minImdb = 5,
  sortBy = 'ratings->>imdb',
  limit = 20,
  language = 'en',
  offset = 0,
}: FetchMoviesOptions = {}, cookieStore?: any) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore?.get(name)?.value;
        },
      },
    }
  );

  let query = supabase
    .from('movies')
    .select('*')
    .eq('original_language', language)
    .gte('year', minYear)
    .lte('year', maxYear)
    .gte('ratings->>imdb', minImdb)
    .range(offset, offset + limit - 1);

  if (genre) query = query.contains('genre', [genre]);
  if (sortBy) query = query.order(sortBy, { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return data;
} 