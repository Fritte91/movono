import { getMoviesByTitle } from './api/getMoviesByTitle';
import { getMovieById } from './api/getMovieById';
import { getSimilarMovies } from './api/getSimilarMovies';
import { Movie } from './types';

// Re-export the Movie type
export type { Movie };

export const popularTitles = [
  "Inception",
  "The Dark Knight",
  "Interstellar",
  "The Matrix",
  "Pulp Fiction",
  "The Shawshank Redemption",
  "The Godfather",
  "The Godfather: Part II",
  "12 Angry Men",
  "The French Dispatch",
  "The Power of the Dog"
];

export const popularMovies: Movie[] = [
  {
    id: "1",
    title: "Inception",
    year: 2010,
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
    genre: ["Action", "Adventure", "Sci-Fi"],
    plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    posterUrl: "/13 Sins.jpeg",
    trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0?si=ibM54OX4739kFj7d",
    runtime: 148,
    ratings: {
      imdb: 8.8,
      rottenTomatoes: "87",
      metacritic: 74
    },
    language: ["English"],
    country: ["USA"],
    similar: ["2", "3", "4"]
  },
  {
    id: "2",
    title: "The Dark Knight",
    year: 2008,
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    genre: ["Action", "Crime", "Drama"],
    plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    posterUrl: "/7500.jpeg",
    trailerUrl: "https://www.youtube.com/embed/EXeTwQWrcwY",
    runtime: 152,
    ratings: {
      imdb: 9.0,
      rottenTomatoes: "94",
      metacritic: 84
    },
    language: ["English"],
    country: ["USA"],
    similar: ["1", "3", "5"]
  }
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

export const allMovies = [...popularMovies];

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

// Example for getting upcoming movies
export const getUpcomingMovies = async () => {
  return await getMovies(upcomingTitles);
};

export { getSimilarMovies };
export { getMovieById };