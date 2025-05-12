import { fetchMoviesByQuery } from './fetchMoviesByQuery';

export const getSimilarMovies = async (genre: string) => {
  try {
    const movies = await fetchMoviesByQuery({ genre, limit: 10 });
    return movies;
  } catch (error) {
    console.error("Failed to fetch similar movies:", error);
    return [];
  }
};
