// lib/api/fetchMoviesByQuery.ts

const BASE_URL = 'https://yts.mx/api/v2/list_movies.json';

type QueryOptions = {
  genre?: string;
  query_term?: string;
  limit?: number;
  sort_by?: string;
};

export const fetchMoviesByQuery = async (options: QueryOptions = {}) => {
  const {
    genre,
    query_term,
    limit = 10,
    sort_by = 'download_count',
  } = options;

  const params = new URLSearchParams();

  if (genre) params.append('genre', genre);
  if (query_term) params.append('query_term', query_term);
  params.append('limit', limit.toString());
  params.append('sort_by', sort_by);

  const url = `${BASE_URL}?${params.toString()}`;

  try {
    const res = await fetch(url);
    const json = await res.json();

    return json.data.movies || [];
  } catch (error) {
    console.error('Error fetching from YTS:', error);
    return [];
  }
};
