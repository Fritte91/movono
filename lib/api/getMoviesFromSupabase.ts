import { createClient } from '@supabase/supabase-js';

// HARDCODED for local development/testing
const supabaseUrl = 'https://witpoqobiuvhokyjopod.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpdHBvcW9iaXV2aG9reWpvcG9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2Mjg1NDYsImV4cCI6MjA2MzIwNDU0Nn0.-a_2H_9eJP3lPMOcaK19kWVGrVhzGnhzqmggY9my9RQ';

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
