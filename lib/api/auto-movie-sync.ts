import { supabase } from '../supabase-client';
import { getUpcomingMovies } from './tmdb';
import { getLatestYtsMovies } from '../yts-api';
import { config } from '../config';

interface MovieToSync {
  imdb_id: string;
  title: string;
  poster_url: string;
  year: number;
  genre: string[];
  plot: string;
  director: string;
  cast: string[];
  runtime: number;
  language: string[];
  country: string[];
  ratings: {
    imdb: number;
    rottenTomatoes: string;
    metacritic: number;
  };
  source: 'tmdb' | 'yts';
  torrents?: any[];
  yts_id?: number;
}

export async function syncUpcomingMovies() {
  try {
    // Fetch upcoming movies from TMDB
    const upcomingMovies = await getUpcomingMovies();
    
    if (!upcomingMovies || upcomingMovies.length === 0) {
      return { success: false, message: 'No upcoming movies found' };
    }

    let addedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const movie of upcomingMovies) {
      try {
        // Access properties using bracket notation to avoid type issues
        const movieData = movie as any;
        const imdbId = movieData.imdbId;
        const posterUrl = movieData.posterUrl;
        
        // Skip if no IMDb ID
        if (!imdbId) {
          skippedCount++;
          continue;
        }

        // Check if movie already exists in movies_mini table
        const { data: existingMovie } = await supabase
          .from('movies_mini')
          .select('imdb_id')
          .eq('imdb_id', imdbId)
          .single();

        if (existingMovie) {
          skippedCount++;
          continue;
        }

        // Prepare movie data for insertion
        const movieToInsert: MovieToSync = {
          imdb_id: imdbId,
          title: movie.title,
          poster_url: posterUrl || '/placeholder.svg',
          year: movie.year,
          genre: movie.genre || [],
          plot: '',
          director: '',
          cast: [],
          runtime: 0,
          language: ['en'],
          country: [],
          ratings: {
            imdb: 0,
            rottenTomatoes: '0',
            metacritic: 0
          },
          source: 'tmdb'
        };

        // Insert movie into database
        const { error } = await supabase
          .from('movies_mini')
          .insert(movieToInsert);

        if (error) {
          errorCount++;
        } else {
          addedCount++;
        }
      } catch (error) {
        errorCount++;
      }
    }

    return {
      success: true,
      message: `TMDB sync completed: ${addedCount} added, ${skippedCount} skipped, ${errorCount} errors`
    };
  } catch (error) {
    return { success: false, message: 'TMDB sync failed', error: error };
  }
}

export async function syncYtsMovies() {
  try {
    // Fetch latest movies from YTS
    const ytsMovies = await getLatestYtsMovies();
    
    if (!ytsMovies || ytsMovies.length === 0) {
      return { success: false, message: 'No movies found from YTS' };
    }

    let addedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const ytsMovie of ytsMovies) {
      try {
        // Skip if no IMDb code
        if (!ytsMovie.imdb_code) {
          skippedCount++;
          continue;
        }

        // Check if movie already exists in movies_mini table
        const { data: existingMovie } = await supabase
          .from('movies_mini')
          .select('*')
          .eq('imdb_id', ytsMovie.imdb_code)
          .single();

        // Prepare movie data
        const movieData: MovieToSync = {
          imdb_id: ytsMovie.imdb_code,
          title: ytsMovie.title_english,
          poster_url: ytsMovie.large_cover_image,
          year: ytsMovie.year,
          genre: ytsMovie.genres || [],
          plot: ytsMovie.description_full || ytsMovie.summary || '',
          director: '',
          cast: [],
          runtime: ytsMovie.runtime || 0,
          language: [ytsMovie.language || 'en'],
          country: [],
          ratings: {
            imdb: ytsMovie.rating || 0,
            rottenTomatoes: '0',
            metacritic: 0
          },
          torrents: ytsMovie.torrents || [],
          yts_id: ytsMovie.id,
          source: 'yts'
        };

        if (existingMovie) {
          // Update existing movie with YTS data
          const { error } = await supabase
            .from('movies_mini')
            .update({
              poster_url: movieData.poster_url,
              plot: movieData.plot,
              runtime: movieData.runtime,
              ratings: movieData.ratings,
              torrents: movieData.torrents,
              yts_id: movieData.yts_id,
              source: movieData.source
            })
            .eq('imdb_id', ytsMovie.imdb_code);

          if (error) {
            errorCount++;
          } else {
            updatedCount++;
          }
        } else {
          // Insert new movie
          const { error } = await supabase
            .from('movies_mini')
            .insert(movieData);

          if (error) {
            errorCount++;
          } else {
            addedCount++;
          }
        }
      } catch (error) {
        errorCount++;
      }
    }

    return {
      success: true,
      message: `YTS sync completed: ${addedCount} added, ${updatedCount} updated, ${skippedCount} skipped, ${errorCount} errors`
    };
  } catch (error) {
    return { success: false, message: 'YTS sync failed', error: error };
  }
}

export async function syncPopularMovies() {
  try {
    // This could be expanded to fetch popular movies from TMDB
    // For now, we'll just return a placeholder
    return {
      success: true,
      message: 'Popular movies sync not yet implemented'
    };
  } catch (error) {
    return { success: false, message: 'Popular movies sync failed', error: error };
  }
}

// Function to run sync on a schedule (can be called from a cron job or API route)
export async function runScheduledSync() {
  const upcomingResult = await syncUpcomingMovies();
  const ytsResult = await syncYtsMovies();
  const popularResult = await syncPopularMovies();
  
  return {
    upcoming: upcomingResult,
    yts: ytsResult,
    popular: popularResult,
    timestamp: new Date().toISOString()
  };
}

// Function to sync only YTS movies (for manual triggers)
export async function runYtsSync() {
  const ytsResult = await syncYtsMovies();
  
  return {
    yts: ytsResult,
    timestamp: new Date().toISOString()
  };
} 