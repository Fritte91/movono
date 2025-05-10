export interface Movie {
  id: string
  title: string
  year: number
  director: string
  cast: string[]
  genre: string[]
  plot: string
  posterUrl: string
  trailerUrl: string
  runtime: number
  ratings: {
    imdb: number
    rottenTomatoes: number
    metacritic: number
  }
  userRating?: number
  language: string
  country: string
  similar: string[]
}

export const popularMovies: Movie[] = [
  {
    id: "1",
    title: "Inception",
    year: 2010,
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
    genre: ["Action", "Adventure", "Sci-Fi"],
    plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    posterUrl: "/placeholder.svg?height=600&width=400",
    trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0",
    runtime: 148,
    ratings: {
      imdb: 8.8,
      rottenTomatoes: 87,
      metacritic: 74,
    },
    language: "English",
    country: "USA",
    similar: ["2", "3", "4"],
  },
  {
    id: "2",
    title: "The Dark Knight",
    year: 2008,
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    genre: ["Action", "Crime", "Drama"],
    plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    posterUrl: "/placeholder.svg?height=600&width=400",
    trailerUrl: "https://www.youtube.com/embed/EXeTwQWrcwY",
    runtime: 152,
    ratings: {
      imdb: 9.0,
      rottenTomatoes: 94,
      metacritic: 84,
    },
    language: "English",
    country: "USA",
    similar: ["1", "3", "5"],
  },
  {
    id: "3",
    title: "Interstellar",
    year: 2014,
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    genre: ["Adventure", "Drama", "Sci-Fi"],
    plot: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    posterUrl: "/placeholder.svg?height=600&width=400",
    trailerUrl: "https://www.youtube.com/embed/zSWdZVtXT7E",
    runtime: 169,
    ratings: {
      imdb: 8.6,
      rottenTomatoes: 72,
      metacritic: 74,
    },
    language: "English",
    country: "USA",
    similar: ["1", "2", "4"],
  },
  {
    id: "4",
    title: "The Matrix",
    year: 1999,
    director: "Lana Wachowski, Lilly Wachowski",
    cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
    genre: ["Action", "Sci-Fi"],
    plot: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    posterUrl: "/placeholder.svg?height=600&width=400",
    trailerUrl: "https://www.youtube.com/embed/vKQi3bBA1y8",
    runtime: 136,
    ratings: {
      imdb: 8.7,
      rottenTomatoes: 88,
      metacritic: 73,
    },
    language: "English",
    country: "USA",
    similar: ["1", "3", "5"],
  },
  {
    id: "5",
    title: "Pulp Fiction",
    year: 1994,
    director: "Quentin Tarantino",
    cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
    genre: ["Crime", "Drama"],
    plot: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    posterUrl: "/placeholder.svg?height=600&width=400",
    trailerUrl: "https://www.youtube.com/embed/s7EdQ4FqbhY",
    runtime: 154,
    ratings: {
      imdb: 8.9,
      rottenTomatoes: 92,
      metacritic: 94,
    },
    language: "English",
    country: "USA",
    similar: ["2", "4", "6"],
  },
  {
    id: "6",
    title: "The Shawshank Redemption",
    year: 1994,
    director: "Frank Darabont",
    cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
    genre: ["Drama"],
    plot: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    posterUrl: "/placeholder.svg?height=600&width=400",
    trailerUrl: "https://www.youtube.com/embed/6hB3S9bIaco",
    runtime: 142,
    ratings: {
      imdb: 9.3,
      rottenTomatoes: 91,
      metacritic: 80,
    },
    language: "English",
    country: "USA",
    similar: ["5", "7", "8"],
  },
]

export const newReleases: Movie[] = [
  {
    id: "7",
    title: "Dune",
    year: 2021,
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Rebecca Ferguson", "Zendaya"],
    genre: ["Action", "Adventure", "Drama"],
    plot: "Feature adaptation of Frank Herbert's science fiction novel, about the son of a noble family entrusted with the protection of the most valuable asset and most vital element in the galaxy.",
    posterUrl: "/placeholder.svg?height=600&width=400",
    trailerUrl: "https://www.youtube.com/embed/8g18jFHCLXk",
    runtime: 155,
    ratings: {
      imdb: 8.0,
      rottenTomatoes: 83,
      metacritic: 74,
    },
    language: "English",
    country: "USA",
    similar: ["1", "3", "8"],
  },
  {
    id: "8",
    title: "No Time to Die",
    year: 2021,
    director: "Cary Joji Fukunaga",
    cast: ["Daniel Craig", "Ana de Armas", "Rami Malek"],
    genre: ["Action", "Adventure", "Thriller"],
    plot: "James Bond has left active service. His peace is short-lived when Felix Leiter, an old friend from the CIA, turns up asking for help, leading Bond onto the trail of a mysterious villain armed with dangerous new technology.",
    posterUrl: "/placeholder.svg?height=600&width=400",
    trailerUrl: "https://www.youtube.com/embed/BIhNsAtPbPI",
    runtime: 163,
    ratings: {
      imdb: 7.3,
      rottenTomatoes: 84,
      metacritic: 68,
    },
    language: "English",
    country: "UK",
    similar: ["7", "9", "10"],
  },
  {
    id: "9",
    title: "The French Dispatch",
    year: 2021,
    director: "Wes Anderson",
    cast: ["Benicio Del Toro", "Adrien Brody", "Tilda Swinton"],
    genre: ["Comedy", "Drama", "Romance"],
    plot: "A love letter to journalists set in an outpost of an American newspaper in a fictional twentieth century French city that brings to life a collection of stories published in 'The French Dispatch Magazine'.",
    posterUrl: "/placeholder.svg?height=600&width=400",
    trailerUrl: "https://www.youtube.com/embed/TcPk2p0Zaw4",
    runtime: 108,
    ratings: {
      imdb: 7.2,
      rottenTomatoes: 75,
      metacritic: 74,
    },
    language: "English",
    country: "USA",
    similar: ["5", "8", "10"],
  },
  {
    id: "10",
    title: "The Power of the Dog",
    year: 2021,
    director: "Jane Campion",
    cast: ["Benedict Cumberbatch", "Kirsten Dunst", "Jesse Plemons"],
    genre: ["Drama", "Romance", "Western"],
    plot: "Charismatic rancher Phil Burbank inspires fear and awe in those around him. When his brother brings home a new wife and her son, Phil torments them until he finds himself exposed to the possibility of love.",
    posterUrl: "/placeholder.svg?height=600&width=400",
    trailerUrl: "https://www.youtube.com/embed/LRDPo0CHrko",
    runtime: 126,
    ratings: {
      imdb: 6.9,
      rottenTomatoes: 94,
      metacritic: 89,
    },
    language: "English",
    country: "New Zealand",
    similar: ["6", "8", "9"],
  },
]

export const topRated: Movie[] = [
  {
    id: "11",
    title: "The Godfather",
    year: 1972,
    director: "Francis Ford Coppola",
    cast: ["Marlon Brando", "Al Pacino", "James Caan"],
    genre: ["Crime", "Drama"],
    plot: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    posterUrl: "/placeholder.svg?height=600&width=400",
    trailerUrl: "https://www.youtube.com/embed/sY1S34973zA",
    runtime: 175,
    ratings: {
      imdb: 9.2,
      rottenTomatoes: 97,
      metacritic: 100,
    },
    language: "English",
    country: "USA",
    similar: ["6", "12", "13"],
  },
  {
    id: "12",
    title: "The Godfather: Part II",
    year: 1974,
    director: "Francis Ford Coppola",
    cast: ["Al Pacino", "Robert De Niro", "Robert Duvall"],
    genre: ["Crime", "Drama"],
    plot: "The early life and career of Vito Corleone in 1920s New York City is portrayed, while his son, Michael, expands and tightens his grip on the family crime syndicate.",
    posterUrl: "/placeholder.svg?height=600&width=400",
    trailerUrl: "https://www.youtube.com/embed/9O1Iy9od7-A",
    runtime: 202,
    ratings: {
      imdb: 9.0,
      rottenTomatoes: 96,
      metacritic: 90,
    },
    language: "English",
    country: "USA",
    similar: ["11", "13", "6"],
  },
  {
    id: "13",
    title: "12 Angry Men",
    year: 1957,
    director: "Sidney Lumet",
    cast: ["Henry Fonda", "Lee J. Cobb", "Martin Balsam"],
    genre: ["Crime", "Drama"],
    plot: "A jury holdout attempts to prevent a miscarriage of justice by forcing his colleagues to reconsider the evidence.",
    posterUrl: "/placeholder.svg?height=600&width=400",
    trailerUrl: "https://www.youtube.com/embed/_13J_9B5jEk",
    runtime: 96,
    ratings: {
      imdb: 9.0,
      rottenTomatoes: 100,
      metacritic: 96,
    },
    language: "English",
    country: "USA",
    similar: ["11", "12", "6"],
  },
]

export const allMovies = [...popularMovies, ...newReleases, ...topRated]

export function getMovieById(id: string): Movie | undefined {
  return allMovies.find((movie) => movie.id === id)
}

export function getSimilarMovies(movieId: string): Movie[] {
  const movie = getMovieById(movieId)
  if (!movie) return []

  return movie.similar.map((id) => getMovieById(id)).filter((movie): movie is Movie => movie !== undefined)
}

export function searchMovies(
  query: string,
  filters?: {
    year?: number
    genre?: string
    language?: string
  },
): Movie[] {
  return allMovies.filter((movie) => {
    const matchesQuery =
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.director.toLowerCase().includes(query.toLowerCase()) ||
      movie.cast.some((actor) => actor.toLowerCase().includes(query.toLowerCase())) ||
      movie.plot.toLowerCase().includes(query.toLowerCase())

    if (!matchesQuery) return false

    if (filters?.year && movie.year !== filters.year) return false
    if (filters?.genre && !movie.genre.includes(filters.genre)) return false
    if (filters?.language && movie.language !== filters.language) return false

    return true
  })
}

export const genres = [
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Sport",
  "Thriller",
  "War",
  "Western",
]

export const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Japanese",
  "Korean",
  "Chinese",
  "Russian",
  "Hindi",
  "Portuguese",
  "Arabic",
]

export const years = Array.from({ length: 2024 - 1950 + 1 }, (_, i) => 2024 - i)

import { upcomingMovies } from "./upcoming-movies-data"

// Add this line at the end of the file, after the existing allMovies declaration
export const allMoviesWithUpcoming = [...allMovies, ...upcomingMovies]
