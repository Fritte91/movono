// lib/api/getMovieById.js
import { createClient } from '@supabase/supabase-js';

// HARDCODED for local development/testing
const supabaseUrl = 'https://ylvgvgkyawmialfcudex.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlsdmd2Z2t5YXdtaWFsZmN1ZGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDM0OTEsImV4cCI6MjA2MjY3OTQ5MX0.7EMJcWM1e1LfwY1cbTmlyPYCwmEtZwZwg1fe6YGxo_0';

export async function getMovieById(imdbId) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    const { data: movie, error } = await supabase
      .from('movies')
      .select('*')
      .eq('id', imdbId)
      .single();

    if (error) {
      console.error('Error fetching movie:', error);
      return null;
    }

    if (!movie) {
      return null;
    }

    // Transform the data to match the expected format
    return {
      id: movie.id, // imdb id
      title: movie.title,
      posterUrl: movie.poster_url,
      year: movie.year,
      runtime: movie.runtime,
      language: movie.original_language ? [movie.original_language] : [],
      country: [], // not in schema
      genre: movie.genre || [],
      plot: movie.plot,
      director: movie.director, // not in schema, will be undefined
      writer: movie.writer, // not in schema, will be undefined
      cast: movie.cast || [], // not in schema, will be undefined or []
      awards: movie.awards, // not in schema, will be undefined
      metascore: movie.ratings?.metacritic,
      imdbVotes: movie.ratings?.imdbVotes,
      type: movie.type, // not in schema, will be undefined
      dvd: movie.dvd, // not in schema, will be undefined
      boxOffice: movie.box_office, // not in schema, will be undefined
      production: movie.production, // not in schema, will be undefined
      website: movie.website, // not in schema, will be undefined
      ratings: movie.ratings || {},
      userRating: movie.user_rating,
      torrents: movie.torrents || [],
      youtubeTrailerUrl: movie.youtube_trailer_url || null,
      tmdbId: movie.tmdb_id || null,
    };
  } catch (error) {
    console.error('Error in getMovieById:', error);
    return null;
  }
}