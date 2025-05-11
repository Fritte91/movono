// lib/movie-data.ts
import { getMoviesByTitle } from './api/getMoviesByTitle';
import { getMovieByIdFromAPI } from './api/getMovieById';
import { getSimilarMovies } from './api/getSimilarMovies';
export const popularTitles = ["Inception", "The Matrix", "Fight Club", "Avatar"];
export const topRatedTitles = ["The Shawshank Redemption", "The Godfather", "The Dark Knight"];
export const newReleasesTitles = ["Dune: Part Two", "Oppenheimer", "The Batman"];
export const allMovieTitles = [...popularTitles, ...topRatedTitles, ...newReleasesTitles];

export const genres = ["Action", "Adventure", "Sci-Fi", "Drama", "Crime", "Thriller"];

// Function to get movies by title
export const getMovies = async (titles: string[]) => {
  const movies = await getMoviesByTitle(titles);
  return movies;
}

// Example for getting popular movies
export const getPopularMovies = async () => {
  return await getMovies(popularTitles);
}

// Example for getting top-rated movies
export const getTopRatedMovies = async () => {
  return await getMovies(topRatedTitles);
}

// Example for getting new releases
export const getNewReleasesMovies = async () => {
  return await getMovies(newReleasesTitles);
}

// Add this function
export const getMovieById = async (id: string) => {
  return await getMovieByIdFromAPI(id);
};

export { getSimilarMovies };