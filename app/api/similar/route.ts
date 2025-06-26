import { NextRequest, NextResponse } from 'next/server';
import { getSimilarMovies } from '@/lib/api/getSimilarMovies';

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get('movieId');

  if (!movieId) {
    return NextResponse.json(
      { error: 'Missing movieId parameter' },
      { status: 400 }
    );
  }

  try {
    // Check cache first
    const cached = cache.get(movieId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json({ movies: cached.data });
    }

    // Fetch similar movies
    const movies = await getSimilarMovies(movieId);

    // Transform movies to match expected format
    const transformedMovies = movies.map(movie => ({
      id: movie.id,
      title: movie.title,
      posterUrl: movie.posterUrl,
      year: movie.year,
      imdb_id: movie.imdb_id,
      genre: movie.genre,
      ratings: movie.ratings
    }));

    // Cache the results
    cache.set(movieId, {
      data: transformedMovies,
      timestamp: Date.now()
    });

    return NextResponse.json({ movies: transformedMovies });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch similar movies', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 