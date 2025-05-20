import { createClient } from '@supabase/supabase-js';
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
  let query = supabase
    .from("movies")
    .select("*")
    .range(options.offset || 0, (options.offset || 0) + 19);

  switch (type) {
    case "popular":
      query = query
        .eq("original_language", "en")
        .gte("year", 2000)
        .lte("year", 2025)
        // Balanced quality filters
        .or('ratings->>imdb.gte.6.5,ratings->>imdb.is.null')
        .or('vote_count.gte.1000,vote_count.is.null')
        .or('popularity.gte.15,popularity.is.null')
        // Order by popularity and rating
        .order("popularity", { ascending: false })
        .order("ratings->>imdb", { ascending: false });
      break;
    case "top_rated":
      query = query
        .eq("original_language", "en")
        .gte("year", 2000)
        .lte("year", 2025)
        // Quality filters for top rated
        .or('ratings->>imdb.gte.7.0,ratings->>imdb.is.null')
        .or('vote_count.gte.2000,vote_count.is.null')
        .or('popularity.gte.20,popularity.is.null')
        // Order by rating first
        .order("ratings->>imdb", { ascending: false })
        .order("popularity", { ascending: false });
      break;
    case "new_releases":
      query = query
        .eq("original_language", "en")
        .eq("year", 2024)
        // More lenient filters for new releases
        .or('ratings->>imdb.gte.6.0,ratings->>imdb.is.null')
        .or('vote_count.gte.100,vote_count.is.null')
        .or('popularity.gte.10,popularity.is.null')
        // Order by popularity
        .order("popularity", { ascending: false })
        .order("ratings->>imdb", { ascending: false });
      break;
    case "genre":
      if (options.genre) {
        // Different thresholds for different genres
        const genreThresholds = {
          'Animation': { rating: 6.5, votes: 500, popularity: 15, minYear: 2015 },
          'War': { rating: 6.5, votes: 500, popularity: 15, minYear: 2015 },
          'Documentary': { rating: 6.5, votes: 300, popularity: 10, minYear: 2015 },
          'Romance': { rating: 6.5, votes: 1000, popularity: 20, minYear: 2015 },
          'Horror': { rating: 6.5, votes: 1000, popularity: 20, minYear: 2015 },
          'default': { rating: 7.0, votes: 2000, popularity: 25, minYear: 2015 }
        };

        const thresholds = genreThresholds[options.genre as keyof typeof genreThresholds] || genreThresholds.default;

        query = query
          .eq("original_language", "en")
          .overlaps("genre", [options.genre])
          .gte("year", thresholds.minYear)
          .lte("year", 2025)
          // Stricter quality filters
          .gte("ratings->>imdb", thresholds.rating.toString())
          .gte("vote_count", thresholds.votes)
          .gte("popularity", thresholds.popularity)
          // Order by year (newest first), then rating, then popularity
          .order("year", { ascending: false })
          .order("ratings->>imdb", { ascending: false })
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