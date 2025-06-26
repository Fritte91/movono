import { supabase } from './supabase-client';
import { createServerClient } from '@supabase/ssr';
import { createBrowserClient } from '@supabase/ssr';
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
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Start with a basic query
  let query = supabase
    .from("movies_mini")
    .select("id, imdb_id, title, year, poster_url, genre, ratings, vote_count, popularity")
    .range(options.offset || 0, (options.offset || 0) + 19);

  // Apply filters based on type
  switch (type) {
    case "popular":
      query = query
        .order("popularity", { ascending: false });
      break;

    case "top_rated":
      query = query
        .order("ratings->>imdb", { ascending: false });
      break;

    case "new_releases":
      query = query
        .order("year", { ascending: false });
      break;

    case "genre":
      if (options.genre) {
        query = query
          .contains("genre", [options.genre])
          .order("ratings->>imdb", { ascending: false });
      }
      break;
  }

  const { data: movies, error } = await query;

  if (error) {
    console.error("Error fetching movies:", error);
    return [];
  }

  // Log the results
  if (options.genre) {
    console.log(`Found ${movies?.length || 0} ${options.genre} movies after filtering`);
    if (movies && movies.length > 0) {
      console.log("First few movies:", movies.slice(0, 3).map(m => ({
        title: m.title,
        year: m.year,
        rating: m.ratings?.imdb,
        genre: m.genre
      })));
    }
  }

  // Map the movies to include the posterUrl and set id to imdb_id
  return (movies || []).map((movie: any) => ({
    ...movie,
    id: movie.imdb_id, // Overwrite id with imdb_id for slider compatibility
    posterUrl: movie.poster_url || '/placeholder.svg'
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
        set(name: string, value: string, options: any) {
          cookieStore?.set(name, value, options);
        },
        remove(name: string, options: any) {
          cookieStore?.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );

  let query = supabase
    .from('movies_mini')
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

  console.log(`[Server-side fetchMoviesFromSupabase] Fetched data for genre: ${genre || 'N/A'}, sortBy: ${sortBy}:`, data);

  return data;
} 