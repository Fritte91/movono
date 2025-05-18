import { allMovies, type Movie } from "./movie-data";

export interface Collection {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  movies: Movie[];
  gradientColor1?: string;
  gradientColor2?: string;
  gradientAngle?: number;
}

// Sample collections for demo purposes
export const sampleCollections: Collection[] = [
  {
    id: "1",
    name: "Halloween Marathon",
    description: "My favorite horror movies for Halloween night",
    coverImage: "/placeholder.svg?height=400&width=600",
    isPublic: true,
    createdAt: new Date(2023, 9, 15),
    updatedAt: new Date(2023, 9, 15),
    userId: "user1",
    movies: allMovies && Array.isArray(allMovies)
      ? allMovies.filter((_, index) => [2, 5, 8].includes(index))
      : [],
  },
  {
    id: "2",
    name: "Best of the 90s",
    description: "Classic films from the 1990s that defined a generation",
    coverImage: "/placeholder.svg?height=400&width=600",
    isPublic: true,
    createdAt: new Date(2023, 8, 10),
    updatedAt: new Date(2023, 8, 20),
    userId: "user1",
    movies: allMovies && Array.isArray(allMovies)
      ? allMovies.filter((movie) => movie.year >= 1990 && movie.year < 2000).slice(0, 5)
      : [],
  },
  {
    id: "3",
    name: "Sci-Fi Favorites",
    description: "Mind-bending science fiction films that make you think",
    coverImage: "/placeholder.svg?height=400&width=600",
    isPublic: false,
    createdAt: new Date(2023, 7, 5),
    updatedAt: new Date(2023, 7, 5),
    userId: "user1",
    movies: allMovies && Array.isArray(allMovies)
      ? allMovies.filter((movie) => movie.genre.includes("Sci-Fi")).slice(0, 4)
      : [],
  },
];

export function getCollectionById(id: string): Collection | undefined {
  return sampleCollections.find((collection) => collection.id === id);
}

export function getUserCollections(userId: string): Collection[] {
  return sampleCollections.filter((collection) => collection.userId === userId);
}

export function getPublicCollections(): Collection[] {
  return sampleCollections.filter((collection) => collection.isPublic);
}