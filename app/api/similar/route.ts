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
      console.log('Returning cached data for movieId:', movieId);
      return NextResponse.json({ movies: cached.data });
    }

    // Fetch similar movies
    const movies = await getSimilarMovies(movieId);
    console.log('Fetched similar movies:', movies.map(m => ({ title: m.title, poster_url: m.poster_url })));

    // Transform the data to match the expected format
    const transformedMovies = movies.map(movie => {
      console.log('Transforming movie:', { title: movie.title, poster_url: movie.poster_url });
      return {
        imdb_id: movie.id,
        title: movie.title,
        poster_url: movie.poster_url,
        year: movie.year,
        imdb_rating: movie.ratings.imdb
      };
    });

    console.log('Transformed movies:', transformedMovies);

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