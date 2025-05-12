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

export const upcomingTitles = [
  "Mission: Impossible – The Final Reckoning",  // May 23, 2025
  "Final Destination: Bloodlines",              // May 16, 2025
  "Fear Street: Prom Queen",                    // May 23, 2025 (Netflix)
  "Deep Cover",                                 // June 12, 2025 (Amazon Prime Video)
  "M3GAN 2.0",                                  // June 6, 2025
  "28 Years Later",                             // June 20, 2025
  "F1",                                         // June 27, 2025
  "Everything's Going to Be Great",             // June 2025
  "Sovereign",                                  // June 2025
  "Bride Hard",                                 // June 2025
  "Dangerous Animals",                          // June 2025
  "Materialists",                               // June 2025
  "The Phoenician Scheme",                      // June 6, 2025
  "The Life of Chuck",                          // June 6, 2025 (Limited Release)
  "Daydreamers",                                // June 3, 2025
  "Book of Joshua: Walls of Jericho",           // June 3, 2025
  "Mountainhead",                               // May 31, 2025
  "Juliet & Romeo",                             // May 2025
  "Thunderbolts*",                              // May 2025
  "Bring Her Back",                             // May 2025
  "Clown in a Cornfield",                       // May 2025
  "Last Bullet",                                // May 2025
  "Tin Soldier",                                // May 2025
  "Rust",                                       // May 2025
  "Bad Influence",                              // May 2025
  "Nonnas",                                     // May 2025
  "Karate Kid: Legends",                        // May 2025
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

// Example for getting upcoming movies
export const getUpcomingMovies = async () => {
  return await getMovies(upcomingTitles);
};

export { getSimilarMovies };