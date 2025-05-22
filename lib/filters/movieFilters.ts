import { createServerClient } from '@supabase/ssr';
import { Movie } from '../types';

const TABLE_NAME = 'movies_mini'; // Use the high-quality table

export interface MovieFilterOptions {
  // Basic filters
  genre?: string;
  minYear?: number;
  maxYear?: number;
  language?: string;
  
  // Rating filters
  minImdb?: number;
  minVoteCount?: number;
  minPopularity?: number;
  
  // Content filters
  certification?: string;
  releaseType?: string;
  excludeGenres?: string[];
  
  // Production filters
  minBudget?: number;
  minRevenue?: number;
  productionCompany?: string;
  director?: string;
  cast?: string[];
  
  // Pagination
  limit?: number;
  offset?: number;
  
  // Sorting
  sortBy?: 'popularity' | 'ratings->>imdb' | 'year' | 'vote_count';
  sortOrder?: 'asc' | 'desc';
}

export interface FilterResult {
  movies: Movie[];
  totalCount: number;
  appliedFilters: MovieFilterOptions;
  relaxedFilters?: {
    filter: keyof MovieFilterOptions;
    originalValue: any;
    newValue: any;
  }[];
}

const DEFAULT_FILTERS: MovieFilterOptions = {
  minYear: 2000,
  maxYear: 2025,
  minImdb: 6.5,
  minVoteCount: 500,
  minPopularity: 12,
  language: 'en',
  limit: 20,
  offset: 0,
  sortBy: 'popularity',
  sortOrder: 'desc',
  excludeGenres: ['Documentary', 'Concert', 'Music', 'TV Movie', 'Animation']
};

// --- Mapping function ---
function mapSupabaseMovieToMovie(row: any): Movie {
  return {
    ...row,
    posterUrl: row.poster_url || '/placeholder.svg',
    // Ensure all required Movie fields are present
    director: row.director || '',
    cast: row.cast || [],
    plot: row.plot || '',
    runtime: row.runtime || 0,
    ratings: row.ratings || { imdb: 0, rottenTomatoes: '0', metacritic: 0 },
    language: row.spoken_languages || row.language || ['en'],
    country: row.production_countries || row.country || [],
    youtubeTrailerUrl: row.youtube_trailer_url || null,
    torrents: row.torrents || [],
    genre: row.genre || [],
    year: row.year || 0,
    id: row.id?.toString() || '',
    title: row.title || '',
  };
}

export async function fetchMoviesWithFilters(
  options: MovieFilterOptions = {},
  cookieStore?: any
): Promise<FilterResult> {
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

  // Merge default filters with provided options
  const filters = { ...DEFAULT_FILTERS, ...options };
  const relaxedFilters: FilterResult['relaxedFilters'] = [];

  // Start building the query
  let query = supabase
    .from(TABLE_NAME)
    .select('*', { count: 'exact' });

  // Apply basic filters
  if (filters.language) {
    query = query.eq('original_language', filters.language);
  }
  if (filters.minYear) {
    query = query.gte('year', filters.minYear);
  }
  if (filters.maxYear) {
    query = query.lte('year', filters.maxYear);
  }

  // Apply rating filters
  if (filters.minImdb) {
    query = query.or(`ratings->>imdb.gte.${filters.minImdb},ratings->>imdb.is.null`);
  }
  if (filters.minVoteCount) {
    query = query.or(`vote_count.gte.${filters.minVoteCount},vote_count.is.null`);
  }
  if (filters.minPopularity) {
    query = query.or(`popularity.gte.${filters.minPopularity},popularity.is.null`);
  }

  // Apply content filters
  if (filters.genre) {
    query = query.contains('genre', [filters.genre]);
  }
  if (filters.excludeGenres && filters.excludeGenres.length > 0) {
    query = query.not('genre', 'cs', `{${filters.excludeGenres.join(',')}}`);
  }
  if (filters.certification) {
    query = query.eq('certification', filters.certification);
  }
  if (filters.releaseType) {
    query = query.eq('release_type', filters.releaseType);
  }

  // Apply production filters
  if (filters.minBudget) {
    query = query.or(`budget.gte.${filters.minBudget},budget.is.null`);
  }
  if (filters.minRevenue) {
    query = query.or(`revenue.gte.${filters.minRevenue},revenue.is.null`);
  }
  if (filters.productionCompany) {
    query = query.contains('production_companies', [filters.productionCompany]);
  }
  if (filters.director) {
    query = query.eq('director', filters.director);
  }
  if (filters.cast && filters.cast.length > 0) {
    query = query.overlaps('cast', filters.cast);
  }

  // Apply sorting
  if (filters.sortBy) {
    query = query.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' });
  }

  // Apply pagination
  if (filters.limit) {
    query = query.range(filters.offset || 0, (filters.offset || 0) + filters.limit - 1);
  }

  // Execute query
  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }

  // If no results and we have strict filters, try relaxing them
  if (!data || data.length === 0) {
    const relaxedOptions = { ...filters };
    
    // Relax filters in order of importance
    if (filters.minImdb && filters.minImdb > 4.0) {
      relaxedOptions.minImdb = 4.0;
      relaxedFilters.push({
        filter: 'minImdb',
        originalValue: filters.minImdb,
        newValue: 4.0
      });
    }
    
    if (filters.minVoteCount && filters.minVoteCount > 20) {
      relaxedOptions.minVoteCount = 20;
      relaxedFilters.push({
        filter: 'minVoteCount',
        originalValue: filters.minVoteCount,
        newValue: 20
      });
    }
    
    if (filters.minPopularity && filters.minPopularity > 2) {
      relaxedOptions.minPopularity = 2;
      relaxedFilters.push({
        filter: 'minPopularity',
        originalValue: filters.minPopularity,
        newValue: 2
      });
    }

    // If we relaxed any filters, try the query again
    if (relaxedFilters.length > 0) {
      return fetchMoviesWithFilters(relaxedOptions, cookieStore);
    }
  }

  // --- Use the mapping function here ---
  return {
    movies: (data || []).map(mapSupabaseMovieToMovie),
    totalCount: count || 0,
    appliedFilters: filters,
    relaxedFilters: relaxedFilters.length > 0 ? relaxedFilters : undefined
  };
}

// Helper function to get movies by category
export async function getMoviesByCategory(
  category: 'popular' | 'top_rated' | 'new_releases' | 'coming_soon',
  cookieStore?: any
): Promise<Movie[]> {
  const categoryFilters: Record<string, MovieFilterOptions> = {
    popular: {
      sortBy: 'popularity',
      minYear: 2000,
      maxYear: 2025,
      minImdb: 6.5,
      minVoteCount: 500,
      minPopularity: 12,
      limit: 20
    },
    top_rated: {
      sortBy: 'ratings->>imdb',
      minYear: 2000,
      maxYear: 2025,
      minImdb: 7.0,
      minVoteCount: 1000,
      minPopularity: 15,
      limit: 20
    },
    new_releases: {
      sortBy: 'year',
      minYear: 2024,
      maxYear: 2024,
      minImdb: 6.5,
      minVoteCount: 500,
      minPopularity: 12,
      limit: 20
    },
    coming_soon: {
      sortBy: 'popularity',
      minYear: 2024,
      maxYear: 2025,
      minImdb: 6.5,
      minVoteCount: 500,
      minPopularity: 12,
      limit: 20
    }
  };

  const result = await fetchMoviesWithFilters(categoryFilters[category], cookieStore);
  return result.movies;
} 