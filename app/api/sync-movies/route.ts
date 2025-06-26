import { NextRequest, NextResponse } from 'next/server';
import { runScheduledSync, runYtsSync, syncYtsMovies, syncUpcomingMovies } from '@/lib/api/auto-movie-sync';
import { supabase } from '@/lib/supabase-client';

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing Supabase URL configuration',
          details: 'NEXT_PUBLIC_SUPABASE_URL is not set'
        },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing Supabase anon key configuration',
          details: 'NEXT_PUBLIC_SUPABASE_ANON_KEY is not set'
        },
        { status: 500 }
      );
    }

    // Add basic authentication check (you can enhance this)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized',
          details: 'Missing or invalid authorization header'
        },
        { status: 401 }
      );
    }

    // Parse the request body to determine sync type
    let body: any = {};
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid request body',
          details: 'Request body must be valid JSON'
        },
        { status: 400 }
      );
    }

    const syncType = body.syncType || body.type || 'all';

    // Validate sync type
    if (!['all', 'yts', 'tmdb', 'update_torrents'].includes(syncType)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid sync type',
          details: `Sync type must be 'all', 'yts', 'tmdb', or 'update_torrents', got: ${syncType}`
        },
        { status: 400 }
      );
    }

    console.log(`Starting sync operation: ${syncType}`);

    let result;
    
    try {
      switch (syncType) {
        case 'update_torrents':
          // Handle torrent update
          const { imdbId, torrents } = body;
          if (!imdbId || !torrents) {
            return NextResponse.json(
              { 
                success: false,
                error: 'Missing required fields',
                details: 'imdbId and torrents are required for update_torrents sync'
              },
              { status: 400 }
            );
          }
          
          // Update the movie with torrent data
          const { error } = await supabase
            .from('movies_mini')
            .update({ 
              torrents: torrents,
              updated_at: new Date().toISOString()
            })
            .eq('imdb_id', imdbId);
          
          if (error) {
            throw error;
          }
          
          result = {
            success: true,
            message: `Updated torrents for movie ${imdbId}`,
            torrentCount: torrents.length
          };
          break;
          
        case 'yts':
          result = await runYtsSync();
          break;
        case 'tmdb':
          const tmdbResult = await syncUpcomingMovies();
          result = {
            upcoming: tmdbResult,
            timestamp: new Date().toISOString()
          };
          break;
        case 'all':
        default:
          result = await runScheduledSync();
          break;
      }
    } catch (syncError) {
      console.error(`Error during ${syncType} sync:`, syncError);
      return NextResponse.json(
        { 
          success: false,
          error: `Sync operation failed: ${syncType}`,
          details: syncError instanceof Error ? syncError.message : 'Unknown sync error'
        },
        { status: 500 }
      );
    }
    
    console.log(`Sync operation completed: ${syncType}`, result);
    
    return NextResponse.json({
      success: true,
      message: `Movie sync (${syncType}) completed successfully`,
      data: result
    });

  } catch (error) {
    console.error('Error in sync-movies API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to sync movies',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Movie sync API endpoint',
    usage: 'POST /api/sync-movies with Authorization header to trigger sync',
    syncTypes: {
      all: 'Sync both TMDB upcoming movies and YTS latest movies',
      yts: 'Sync only YTS latest movies',
      tmdb: 'Sync only TMDB upcoming movies',
      update_torrents: 'Update torrent data for a specific movie'
    },
    example: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        syncType: 'update_torrents',
        imdbId: 'tt1234567',
        torrents: [
          {
            url: 'https://example.com/torrent.torrent',
            hash: 'abc123',
            quality: '1080p',
            size: '2.5 GB',
            seeds: 100,
            peers: 50
          }
        ]
      }
    }
  });
} 