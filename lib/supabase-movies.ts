import { createClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Movie } from './movie-data';

interface FetchMoviesOptions {
  genre?: string;
  minYear?: number;
  maxYear?: number;
  minImdb?: number;
  minVoteCount?: number;
  minPopularity?: number;
  sortBy?: string;
  limit?: number;
  language?: string;
  offset?: number;
  minBudget?: number;
  minRevenue?: number;
  certification?: string;
  productionCompany?: string;
  director?: string;
  cast?: string[];
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
        .or('ratings->>imdb.gte.5,ratings->>imdb.is.null')
        .or('vote_count.gte.50,vote_count.is.null')
        .or('popularity.gte.5,popularity.is.null')
        .order("popularity", { ascending: false });
      break;
    case "top_rated":
      query = query
        .gte("year", 2000)
        .lte("year", 2025)
        .or('ratings->>imdb.gte.6.5,ratings->>imdb.is.null')
        .or('vote_count.gte.100,vote_count.is.null')
        .or('popularity.gte.10,popularity.is.null')
        .order("ratings->>imdb", { ascending: false });
      break;
    case "new_releases":
      query = query
        .eq("year", 2024)
        .or('ratings->>imdb.gte.5,ratings->>imdb.is.null')
        .or('vote_count.gte.10,vote_count.is.null')
        .order("popularity", { ascending: false });
      break;
    case "genre":
      if (options.genre) {
        query = query
          .overlaps("genre", [options.genre])
          .gte("year", 1990)
          .lte("year", 2025)
          .or('ratings->>imdb.gte.5,ratings->>imdb.is.null')
          .or('vote_count.gte.50,vote_count.is.null')
          .or('popularity.gte.5,popularity.is.null')
          .order("popularity", { ascending: false });
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

// Server-side version
export async function fetchMoviesFromSupabase({
  genre,
  minYear = 2000,
  maxYear = 2025,
  minImdb = 5,
  minVoteCount = 50,
  minPopularity = 5,
  sortBy = 'popularity',
  limit = 20,
  language = 'en',
  offset = 0,
  minBudget,
  minRevenue,
  certification,
  productionCompany,
  director,
  cast,
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
    .or(`ratings->>imdb.gte.${minImdb},ratings->>imdb.is.null`)
    .or(`vote_count.gte.${minVoteCount},vote_count.is.null`)
    .or(`popularity.gte.${minPopularity},popularity.is.null`)
    .range(offset, offset + limit - 1);

  if (genre) query = query.contains('genre', [genre]);
  if (minBudget) query = query.or(`budget.gte.${minBudget},budget.is.null`);
  if (minRevenue) query = query.or(`revenue.gte.${minRevenue},revenue.is.null`);
  if (certification) query = query.eq('certification', certification);
  if (productionCompany) query = query.contains('production_companies', [productionCompany]);
  if (director) query = query.eq('director', director);
  if (cast && cast.length > 0) query = query.overlaps('cast', cast);
  
  // Handle different sort options
  switch (sortBy) {
    case 'popularity':
      query = query.order('popularity', { ascending: false });
      break;
    case 'vote_average':
      query = query.order('ratings->>imdb', { ascending: false });
      break;
    case 'vote_count':
      query = query.order('vote_count', { ascending: false });
      break;
    case 'revenue':
      query = query.order('revenue', { ascending: false });
      break;
    case 'year':
      query = query.order('year', { ascending: false });
      break;
    default:
      query = query.order(sortBy, { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
} 