import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

interface FetchMoviesOptions {
  genre?: string;
  minYear?: number;
  maxYear?: number;
  minImdb?: number;
  sortBy?: string;
  limit?: number;
  language?: string;
}

export async function fetchMoviesFromSupabase({
  genre,
  minYear = 2000,
  maxYear = 2025,
  minImdb = 5,
  sortBy = 'ratings->>imdb',
  limit = 20,
  language = 'en',
}: FetchMoviesOptions = {}) {
  const cookieStore: any = await cookies();
  const supabase = createServerClient(
    'https://ylvgvgkyawmialfcudex.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlsdmd2Z2t5YXdtaWFsZmN1ZGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDM0OTEsImV4cCI6MjA2MjY3OTQ5MX0.7EMJcWM1e1LfwY1cbTmlyPYCwmEtZwZwg1fe6YGxo_0',
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: () => {},
        remove: () => {},
      },
    }
  );

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