import { supabase } from '../supabase-client';

export async function getMoviesFromSupabase({ genre = "", sortBy = "ratings->>imdb", limit = 500 } = {}) {
  let query = supabase
    .from('movies_mini')
    .select('id, title, year, poster_url, imdb_id, genre, ratings');

  let data = null;
  let error = null;

  if (genre && genre !== "All") {
    // Try case-insensitive contains for array and string
    query = query.contains('genre', [genre]);
    ({ data, error } = await query);
    // Fallback: try lowercased genre
    if ((!data || data.length === 0) && genre) {
      const lowerGenre = genre.toLowerCase();
      query = supabase
        .from('movies_mini')
        .select('id, title, year, poster_url, imdb_id, genre, ratings')
        .filter('genre', 'ilike', `%${lowerGenre}%`);
      ({ data, error } = await query);
    }
    // Fallback: show all movies if still none found
    if (!data || data.length === 0) {
      query = supabase
        .from('movies_mini')
        .select('id, title, year, poster_url, imdb_id, genre, ratings');
      if (sortBy) query = query.order(sortBy, { ascending: false });
      if (limit) query = query.limit(limit);
      ({ data, error } = await query);
    }
  } else {
    if (sortBy) query = query.order(sortBy, { ascending: false });
    if (limit) query = query.limit(limit);
    ({ data, error } = await query);
  }

  if (error) throw error;
  return data;
}
