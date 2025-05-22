// lib/api/getMovieById.js
import { createClient } from '@supabase/supabase-js';
import { getMovieFromTmdbById } from "./tmdb"; // Assuming a tmdb utility file exists

// Use the same Supabase project as the rest of the app
const supabaseUrl = 'https://witpoqobiuvhokyjopod.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpdHBvcW9iaXV2aG9reWpvcG9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2Mjg1NDYsImV4cCI6MjA2MzIwNDU0Nn0.-a_2H_9eJP3lPMOcaK19kWVGrVhzGnhzqmggY9my9RQ';

export async function getMovieById(movieId) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    console.log('Fetching movie by imdb_id:', movieId);
    if (!movieId || !movieId.startsWith('tt')) return null;
    const { data: movie, error } = await supabase
      .from('movies_mini')
      .select('*')
      .eq('imdb_id', movieId)
      .single();
    if (error) {
      console.error('Error fetching movie from Supabase by imdb_id:', error);
      return null;
    }
    if (!movie) {
      return null;
    }
    console.log('Fetched movie:', movie);
    return {
      id: movie.imdb_id,
      title: movie.title,
      posterUrl: movie.poster_url,
      year: movie.year,
      runtime: movie.runtime,
      language: movie.spoken_languages || movie.language || ['en'],
      country: movie.production_countries || [],
      genre: movie.genre || [],
      plot: movie.plot,
      director: movie.director,
      writer: movie.writer,
      cast: movie.cast || [],
      awards: movie.awards,
      metascore: movie.ratings?.metacritic,
      imdbVotes: movie.ratings?.imdbVotes,
      type: movie.type,
      dvd: movie.dvd,
      boxOffice: movie.box_office,
      production: movie.production,
      website: movie.website,
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