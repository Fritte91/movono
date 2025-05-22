import { createServerClient, createBrowserClient, type CookieOptions } from '@supabase/ssr';
import { Database } from '@/lib/database.types';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://witpoqobiuvhokyjopod.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpdHBvcW9iaXV2aG9reWpvcG9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2Mjg1NDYsImV4cCI6MjA2MzIwNDU0Nn0.-a_2H_9eJP3lPMOcaK19kWVGrVhzGnhzqmggY9my9RQ'

interface CookieStore {
  get: (name: string) => { value: string } | undefined;
  set: (name: string, value: string, options: CookieOptions) => void;
  remove: (name: string, options: CookieOptions) => void;
}

interface FetchMoviesOptions {
  genre?: string;
  minYear?: number;
  maxYear?: number;
  minImdb?: number;
  sortBy?: string;
  limit?: number;
  language?: string;
}

// Server client with flexible cookie store
export function createSupabaseServerClient(cookieStore?: CookieStore) {
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get: (name: string) => cookieStore?.get(name)?.value,
      set: (name: string, value: string, options: CookieOptions) => {
        cookieStore?.set(name, value, options);
      },
      remove: (name: string, options: CookieOptions) => {
        cookieStore?.remove(name, options);
      },
    },
  });
}

// Client-side Supabase client with custom configuration
export const supabaseClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
  db: {
    schema: 'public',
  },
  auth: {
    persistSession: true,
  },
});

export async function fetchMoviesFromSupabase({
  genre,
  minYear = 2000,
  maxYear = 2025,
  minImdb = 5,
  sortBy = 'ratings->>imdb',
  limit = 20,
  language = 'en',
}: FetchMoviesOptions = {}, cookieStore?: CookieStore) {
  const supabase = createSupabaseServerClient(cookieStore);

  let query = supabase
    .from('movies')
    .select('*')
    .eq('original_language', language)
    .gte('year', minYear)
    .lte('year', maxYear)
    .gte('ratings->>imdb', minImdb);

  if (genre) query = query.contains('genre', [genre]);
  if (sortBy) query = query.order(sortBy, { ascending: false });
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getMoviesFromSupabase({ genre, sortBy = 'ratings->>imdb', limit = 500 } = {}, cookieStore?: CookieStore) {
  const supabase = createSupabaseServerClient(cookieStore);

  let query = supabase.from('movies').select('*');

  if (genre && genre !== 'All') query = query.contains('genre', [genre]);
  if (sortBy) query = query.order(sortBy, { ascending: false });
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function syncSession(accessToken: string, refreshToken: string, cookieStore?: CookieStore) {
  const supabase = createSupabaseServerClient(cookieStore);
  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  if (error) {
    console.error('Error syncing session:', error);
  }
  return !error;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

const fetchCollections = async () => {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('user_id', currentUser.id)

  if (error) {
    console.error('Error fetching collections:', error)
    return []
  }

  return data
}