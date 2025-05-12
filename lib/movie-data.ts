import { getMoviesByTitle } from './api/getMoviesByTitle';
import { getMovieByIdFromAPI } from './api/getMovieById';
import { getSimilarMovies } from './api/getSimilarMovies';

export interface Movie {
  id: string;
  title: string;
  year: number;
  genre: string[];
  posterUrl?: string;
}

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

export const upcomingTitles = [
  "Mission: Impossible – The Final Reckoning",
  "Final Destination: Bloodlines",
  "Fear Street: Prom Queen",
  "Deep Cover",
  "M3GAN 2.0",
  "28 Years Later",
  "F1",
  "Everything's Going to Be Great",
  "Sovereign",
  "Bride Hard",
  "Dangerous Animals",
  "Materialists",
  "The Phoenician Scheme",
  "The Life of Chuck",
  "Daydreamers",
  "Book of Joshua: Walls of Jericho",
  "Mountainhead",
  "Juliet & Romeo",
  "Thunderbolts*",
  "Bring Her Back",
  "Clown in a Cornfield",
  "Last Bullet",
  "Tin Soldier",
  "Rust",
  "Bad Influence",
  "Nonnas",
  "Karate Kid: Legends"
];

export const allMovieTitles = [...popularTitles, ...topRatedTitles, ...newReleasesTitles];

// Static allMovies array for collections-data.ts
export const allMovies: Movie[] = [
  { id: "1", title: "Inception", year: 2010, genre: ["Sci-Fi", "Thriller"], posterUrl: "/placeholder.svg" },
  { id: "2", title: "The Matrix", year: 1999, genre: ["Sci-Fi", "Action"], posterUrl: "/placeholder.svg" },
  { id: "3", title: "Fight Club", year: 1999, genre: ["Drama"], posterUrl: "/placeholder.svg" },
  { id: "4", title: "The Shawshank Redemption", year: 1994, genre: ["Drama"], posterUrl: "/placeholder.svg" },
  { id: "5", title: "The Godfather", year: 1972, genre: ["Crime", "Drama"], posterUrl: "/placeholder.svg" },
  { id: "6", title: "Dune: Part Two", year: 2024, genre: ["Sci-Fi", "Adventure"], posterUrl: "/placeholder.svg" },
  { id: "7", title: "Oppenheimer", year: 2023, genre: ["Biography", "Drama"], posterUrl: "/placeholder.svg" },
  { id: "8", title: "The Dark Knight", year: 2008, genre: ["Action", "Crime"], posterUrl: "/placeholder.svg" },
  { id: "9", title: "Pulp Fiction", year: 1994, genre: ["Crime", "Drama"], posterUrl: "/placeholder.svg" },
];

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
};

// Example for getting popular movies
export const getPopularMovies = async () => {
  return await getMovies(popularTitles);
};

// Example for getting top-rated movies
export const getTopRatedMovies = async () => {
  return await getMovies(topRatedTitles);
};

// Example for getting new releases
export const getNewReleasesMovies = async () => {
  return await getMovies(newReleasesTitles);
};

// Add this function
export const getMovieById = async (id: string) => {
  return await getMovieByIdFromAPI(id);
};

// Example for getting upcoming movies
export const getUpcomingMovies = async () => {
  return await getMovies(upcomingTitles);
};

export { getSimilarMovies };