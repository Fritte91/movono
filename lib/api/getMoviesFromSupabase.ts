import { createClient } from '@supabase/supabase-js';

// HARDCODED for local development/testing
const supabaseUrl = 'https://ylvgvgkyawmialfcudex.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlsdmd2Z2t5YXdtaWFsZmN1ZGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDM0OTEsImV4cCI6MjA2MjY3OTQ5MX0.7EMJcWM1e1LfwY1cbTmlyPYCwmEtZwZwg1fe6YGxo_0';

export async function getMoviesFromSupabase({ genre, sortBy = "ratings->>imdb", limit = 500 } = {}) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  let query = supabase
    .from('movies')
    .select('*');

  if (genre && genre !== "All") query = query.contains('genre', [genre]);
  if (sortBy) query = query.order(sortBy, { ascending: false });
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
