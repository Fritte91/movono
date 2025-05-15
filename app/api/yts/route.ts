import { NextResponse } from "next/server";

// Cache responses for 1 hour to improve performance
const CACHE_DURATION = 60 * 60; // 1 hour in seconds

interface YtsTorrent {
  url: string;
  quality: string;
  size: string;
  seeds: number;
  peers: number;
}

interface YtsMovie {
  id: number;
  imdb_code: string;
  title: string;
  year: number;
  torrents: YtsTorrent[];
}

interface YtsResponse {
  status: string;
  status_message: string;
  data: {
    movie_count: number;
    movies: YtsMovie[];
  };
}

// In-memory cache with automatic cleanup
const cache = new Map<string, { data: YtsTorrent[]; timestamp: number }>();

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
    const imdbId = searchParams.get("imdbId");

    if (!imdbId) {
      return NextResponse.json(
        { error: "IMDb ID is required" },
        { status: 400 }
      );
    }

    // Check cache first
    const cached = cache.get(imdbId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION * 1000) {
      return NextResponse.json({ torrents: cached.data });
    }

    // Fetch from YTS API with aggressive caching
    const ytsUrl = `https://yts.mx/api/v2/list_movies.json?query_term=${imdbId}`;
    const response = await fetch(ytsUrl, {
      next: { revalidate: CACHE_DURATION },
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });

    if (!response.ok) {
      return NextResponse.json({ torrents: [] });
    }

    const data: YtsResponse = await response.json();
    const movie = data.data.movies?.find(m => m.imdb_code === imdbId);

    if (!movie?.torrents?.length) {
      return NextResponse.json({ torrents: [] });
    }

    const torrents = movie.torrents.map(t => ({
      url: t.url,
      quality: t.quality,
      size: t.size,
      seeds: t.seeds,
      peers: t.peers
    }));

    cache.set(imdbId, {
      data: torrents,
      timestamp: Date.now()
    });

    return NextResponse.json({ torrents });
  } catch {
    return NextResponse.json({ torrents: [] });
  }
} 