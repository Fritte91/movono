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

// Remove or update all sampleCollections with userId: 'user1'.
// These are only for demo purposes and should not affect production.
// In production, collections should be loaded from the database using the real userId.

// Option 1: Remove all sampleCollections (recommended for production)
export const sampleCollections: Collection[] = [];

// Option 2: If you want to keep them for demo, change userId to 'demo-user' or similar.
// But make sure getUserCollections is only used for demo/testing, not in production.

export function getCollectionById(id: string): Collection | undefined {
  return sampleCollections.find((collection) => collection.id === id);
}

export function getUserCollections(userId: string): Collection[] {
  return sampleCollections.filter((collection) => collection.userId === userId);
}

export function getPublicCollections(): Collection[] {
  return sampleCollections.filter((collection) => collection.isPublic);
}