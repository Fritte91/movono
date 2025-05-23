export interface YtsMovie {
  id: number;
  url: string;
  imdb_code: string;
  title: string;
  title_english: string;
  title_long: string;
  slug: string;
  year: number;
  rating: number;
  runtime: number;
  genres: string[];
  summary: string;
  description_full: string;
  synopsis: string;
  yt_trailer_code: string;
  language: string;
  mpa_rating: string;
  background_image: string;
  background_image_original: string;
  small_cover_image: string;
  medium_cover_image: string;
  large_cover_image: string;
  state: string;
  torrents: {
    url: string;
    hash: string;
    quality: string;
    type: string;
    seeds: number;
    peers: number;
    size: string;
    size_bytes: number;
    date_uploaded: string;
    date_uploaded_unix: number;
  }[];
  date_uploaded: string;
  date_uploaded_unix: number;
}

export interface YtsResponse {
  status: string;
  status_message: string;
  data: {
    movie_count: number;
    limit: number;
    page_number: number;
    movies: YtsMovie[];
  };
}

export async function getLatestYtsMovies(): Promise<YtsMovie[]> {
  try {
    const response = await fetch(
      'https://yts.mx/api/v2/list_movies.json?limit=20&sort_by=date_added&order_by=desc&language=english'
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch YTS movies');
    }

    const data: YtsResponse = await response.json();
    return data.data.movies;
  } catch (error) {
    console.error('Error fetching YTS movies:', error);
    return [];
  }
}

export async function getYtsMovieById(movieId: number): Promise<YtsMovie | null> {
  try {
    const response = await fetch(
      `https://yts.mx/api/v2/movie_details.json?movie_id=${movieId}&with_images=true&with_cast=true`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch YTS movie details');
    }
    const data = await response.json();
    if (data.status === 'ok' && data.data && data.data.movie) {
      return data.data.movie as YtsMovie;
    }
    return null;
  } catch (error) {
    console.error('Error fetching YTS movie by ID:', error);
    return null;
  }
}

export async function getYtsMovieByImdbId(imdbId: string): Promise<YtsMovie | null> {
  try {
    const response = await fetch(
      `https://yts.mx/api/v2/list_movies.json?query_term=${imdbId}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch YTS movie by IMDb ID');
    }
    const data: YtsResponse = await response.json();
    if (data.status === 'ok' && data.data && data.data.movies && data.data.movies.length > 0) {
      return data.data.movies[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching YTS movie by IMDb ID:', error);
    return null;
  }
} 