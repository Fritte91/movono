import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function getMoviesFromSupabase({ genre, sortBy = "ratings->>imdb", limit = 500 } = {}) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  let query = supabase
    .from('movies_mini')
    .select('id, title, year, poster_url, imdb_id, genre, ratings');

  if (genre && genre !== "All") query = query.contains('genre', [genre]);
  if (sortBy) query = query.order(sortBy, { ascending: false });
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
