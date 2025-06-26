import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

// Cache duration for responses
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

interface YtsTorrent {
  url: string;
  hash: string;
  quality: string;
  type: string;
  seeds: number;
  peers: number;
  size: string;
  size_bytes: number;
  date_uploaded: string;
  date_uploaded_unix: number;
}

interface YtsMovie {
  id: number;
  url: string;
  imdb_code: string;
  title: string;
  title_english: string;
  title_long: string;
  slug: string;
  year: number;
  rating: number;
  runtime: number;
  genres: string[];
  summary: string;
  description_full: string;
  synopsis: string;
  yt_trailer_code: string;
  language: string;
  mpa_rating: string;
  background_image: string;
  background_image_original: string;
  small_cover_image: string;
  medium_cover_image: string;
  large_cover_image: string;
  state: string;
  torrents: YtsTorrent[];
  date_uploaded: string;
  date_uploaded_unix: number;
}

interface YtsResponse {
  status: string;
  status_message: string;
  data: {
    movie?: YtsMovie;
    movies?: YtsMovie[];
    movie_count?: number;
  };
}

// Simple in-memory cache for torrent data
const cache = new Map<string, { data: any; timestamp: number }>();

// Clean up old cache entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
}, CACHE_DURATION);

async function getYtsSession() {
  try {
    const response = await fetch(`${config.app.url}/api/yts-auth`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get YTS session');
    }

    const sessionData = await response.json();
    if (!sessionData.success) {
      throw new Error('Failed to authenticate with YTS');
    }

    // Get the cookies from the response
    const cookies = response.headers.getSetCookie();
    return cookies;
  } catch (error) {
    console.error('Error getting YTS session:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imdbId = searchParams.get('imdb_id');

  if (!imdbId) {
    return NextResponse.json(
      { error: 'Missing imdb_id parameter' },
      { status: 400 }
    );
  }

  try {
    // Check cache first
    const cached = cache.get(imdbId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json({ torrents: cached.data });
    }

    // Try multiple YTS API endpoints
    const endpoints = [
      `https://yts.mx/api/v2/movie_details.json?imdb_id=${imdbId}`,
      `https://yts.mx/api/v2/movie_details.json?imdb_id=${imdbId}&with_images=true&with_cast=true`,
      `https://yts.mx/api/v2/list_movies.json?query_term=${imdbId}`,
    ];

    let data: any = null;
    let error: Error | null = null;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });

        if (!response.ok) {
          continue;
        }

        const responseData = await response.json();

        if (responseData.status === 'ok') {
          data = responseData;
          break;
        }
      } catch (e) {
        error = e as Error;
      }
    }

    if (!data) {
      return NextResponse.json({ torrents: [] });
    }

    // Handle both response formats
    const movie = data.data.movie || (data.data.movies && data.data.movies[0]);
    
    if (!movie || !movie.torrents || !Array.isArray(movie.torrents) || movie.torrents.length === 0) {
      return NextResponse.json({ torrents: [] });
    }

    const torrents = movie.torrents.map((torrent: any) => ({
      url: torrent.url,
      hash: torrent.hash,
      quality: torrent.quality,
      type: torrent.type,
      seeds: torrent.seeds,
      peers: torrent.peers,
      size: torrent.size,
      size_bytes: torrent.size_bytes,
      date_uploaded: torrent.date_uploaded,
      date_uploaded_unix: torrent.date_uploaded_unix
    }));

    // Cache the results
    cache.set(imdbId, {
      data: torrents,
      timestamp: Date.now()
    });

    return NextResponse.json({ torrents });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch torrents', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 