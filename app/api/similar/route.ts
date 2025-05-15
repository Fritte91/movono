import { NextResponse } from "next/server";
import { getSimilarMovies } from "@/lib/api/getSimilarMovies";

// Cache responses for 1 hour
const CACHE_DURATION = 60 * 60; // 1 hour in seconds

// In-memory cache with automatic cleanup
const cache = new Map<string, { data: any[]; timestamp: number }>();

// Cleanup old cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION * 1000) {
      cache.delete(key);
    }
  }
}, CACHE_DURATION * 1000);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("movieId");

    if (!movieId) {
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 }
      );
    }

    // Check cache first
    const cached = cache.get(movieId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION * 1000) {
      return NextResponse.json({ movies: cached.data });
    }

    // Fetch similar movies
    const movies = await getSimilarMovies(movieId);

    // Transform the data to match the expected format
    const transformedMovies = movies.map(movie => ({
      imdb_id: movie.id,
      title: movie.title,
      poster_url: movie.posterUrl,
      year: movie.year,
      imdb_rating: 0 // Default to 0 since we don't have ratings in the simplified Movie type
    }));

    // Update cache
    cache.set(movieId, {
      data: transformedMovies,
      timestamp: Date.now()
    });

    return NextResponse.json({ movies: transformedMovies });
  } catch (error) {
    console.error('Error in similar movies API:', error);
    return NextResponse.json({ movies: [] });
  }
} 