import { NextResponse } from "next/server";
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

// In-memory cache with automatic cleanup
const cache = new Map<string, { data: YtsTorrent[]; timestamp: number }>();

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const imdbId = searchParams.get('imdbId');

    if (!imdbId) {
      return NextResponse.json(
        { error: 'IMDb ID is required' },
        { status: 400 }
      );
    }

    // Check cache first
    const cachedData = cache.get(imdbId);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      console.log('Using cached data for IMDb:', imdbId);
      return NextResponse.json({ torrents: cachedData.data });
    }

    // Try both endpoints to see which one works better
    const endpoints = [
      `https://yts.mx/api/v2/movie_details.json?imdb_id=${imdbId}`,
      `https://yts.mx/api/v2/list_movies.json?query_term=${imdbId}`
    ];

    let data: YtsResponse | null = null;
    let error: Error | null = null;

    for (const endpoint of endpoints) {
      try {
        console.log('Trying YTS API endpoint:', endpoint);
        const response = await fetch(endpoint, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });

        if (!response.ok) {
          console.error(`YTS API responded with status: ${response.status} for endpoint: ${endpoint}`);
          continue;
        }

        const responseData = await response.json();
        console.log('YTS API Response:', {
          endpoint,
          status: responseData.status,
          hasMovie: !!responseData.data?.movie,
          hasMovies: !!responseData.data?.movies,
          movieCount: responseData.data?.movie_count
        });

        if (responseData.status === 'ok') {
          data = responseData;
          break;
        }
      } catch (e) {
        console.error(`Error fetching from ${endpoint}:`, e);
        error = e as Error;
      }
    }

    if (!data) {
      console.error('All YTS API endpoints failed:', error);
      return NextResponse.json({ torrents: [] });
    }

    // Handle both response formats
    const movie = data.data.movie || (data.data.movies && data.data.movies[0]);
    
    if (!movie || !movie.torrents || movie.torrents.length === 0) {
      console.error('No movie or torrents found in response:', data);
      return NextResponse.json({ torrents: [] });
    }

    const torrents = movie.torrents.map(torrent => ({
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

    console.log('Found torrents:', {
      count: torrents.length,
      qualities: torrents.map(t => t.quality),
      hasUrls: torrents.every(t => !!t.url),
      hasHashes: torrents.every(t => !!t.hash)
    });

    // Cache the results
    cache.set(imdbId, {
      data: torrents,
      timestamp: Date.now()
    });

    return NextResponse.json({ torrents });
  } catch (error) {
    console.error('Error fetching from YTS:', error);
    return NextResponse.json(
      { error: 'Failed to fetch torrents', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 