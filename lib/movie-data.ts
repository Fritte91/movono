// lib/movie-data.ts
import { getMoviesByTitle } from './api/getMoviesByTitle';
import { getMovieByIdFromAPI } from './api/getMovieById';
import { getSimilarMovies } from './api/getSimilarMovies';

export const popularTitles = [
  "Inception",
  "The Matrix",
  "Fight Club",
  "Avatar",
  "Gladiator",
  "Titanic",
  "The Avengers",
  "Interstellar",
  "Jurassic Park",
  "The Wolf of Wall Street",
  "The Hunger Games",
  "Black Panther",
  "Iron Man",
  "Deadpool",
  "Mad Max: Fury Road",
  "The Lion King",
  "Pirates of the Caribbean: The Curse of the Black Pearl",
  "The Lord of the Rings: The Fellowship of the Ring",
  "Forrest Gump",
  "The Social Network"
];

export const topRatedTitles = [
  "The Shawshank Redemption",
  "The Godfather",
  "The Dark Knight",
  "The Godfather Part II",
  "12 Angry Men",
  "Schindler's List",
  "The Lord of the Rings: The Return of the King",
  "Pulp Fiction",
  "Goodfellas",
  "The Empire Strikes Back",
  "One Flew Over the Cuckoo's Nest",
  "The Green Mile",
  "Se7en",
  "City of God",
  "Spirited Away",
  "Parasite",
  "Life Is Beautiful",
  "Whiplash",
  "The Pianist",
  "The Departed"
];

export const newReleasesTitles = [
  "Dune: Part Two",
  "Oppenheimer",
  "The Batman",
  "Barbie",
  "John Wick: Chapter 4",
  "Spider-Man: Across the Spider-Verse",
  "The Marvels",
  "Killers of the Flower Moon",
  "Napoleon",
  "Wonka",
  "The Super Mario Bros. Movie",
  "Guardians of the Galaxy Vol. 3",
  "Indiana Jones and the Dial of Destiny",
  "The Creator",
  "Mission: Impossible – Dead Reckoning Part One",
  "The Flash",
  "Aquaman and the Lost Kingdom",
  "Poor Things",
  "Maestro",
  "Saltburn"
];

export const allMovieTitles = [...popularTitles, ...topRatedTitles, ...newReleasesTitles];

// Consolidated genres array (matches OMDB API genres)
export const genres = [
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "War",
  "Western"
];

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