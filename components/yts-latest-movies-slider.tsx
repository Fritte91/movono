"use client";

import { useEffect, useState } from "react";
import { MovieSlider } from "@/components/movie-slider";
import { getLatestYtsMovies, type YtsMovie } from "@/lib/yts-api";
import { Movie } from "@/lib/types";

const LAST_SYNC_KEY = 'yts_last_sync';

function shouldSyncYts() {
  const lastSync = localStorage.getItem(LAST_SYNC_KEY);
  if (!lastSync) return true;
  const last = new Date(lastSync);
  const now = new Date();
  return now.getTime() - last.getTime() > 24 * 60 * 60 * 1000; // 24 hours
}

export function YtsLatestMoviesSlider() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<string>("");

  const transformYtsMovie = (movie: YtsMovie): Movie => ({
    id: String(movie.id),
    title: movie.title_english,
    year: movie.year,
    posterUrl: movie.large_cover_image,
    genre: movie.genres,
    runtime: movie.runtime,
    ratings: {
      imdb: movie.rating,
      rottenTomatoes: "N/A",
      metacritic: 0
    },
    plot: movie.description_full || movie.summary,
    language: [movie.language],
    country: [],
    released: movie.date_uploaded,
    director: "",
    writer: "",
    actors: [],
    awards: "",
    metascore: 0,
    imdbVotes: 0,
    type: "movie",
    dvd: "",
    boxOffice: "",
    production: "",
    website: "",
    imdb_id: movie.imdb_code
  });

  // Function to sync YTS movies to database
  const syncYtsMoviesToDatabase = async (ytsMovies: YtsMovie[]) => {
    try {
      setSyncStatus("Syncing movies to database...");
      
      const response = await fetch('/api/sync-movies', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer admin-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'yts' }),
      });

      const result = await response.json();
      
      if (result.success) {
        const ytsResult = result.data.yts;
        if (ytsResult) {
          setSyncStatus(`Synced: ${ytsResult.added || 0} added, ${ytsResult.updated || 0} updated`);
        } else {
          setSyncStatus("Sync completed");
        }
      } else {
        setSyncStatus("Sync failed");
        console.error('Sync failed:', result.error);
      }
    } catch (error) {
      setSyncStatus("Sync error");
      console.error('Error syncing YTS movies:', error);
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setSyncStatus("Fetching latest movies...");
        
        const ytsMovies = await getLatestYtsMovies();
        const transformedMovies = ytsMovies.map(transformYtsMovie);
        
        setMovies(transformedMovies);
        setLoading(false);
        
        // Automatically sync movies to database in the background, but only once per day
        if (ytsMovies.length > 0 && shouldSyncYts()) {
          setTimeout(() => {
            syncYtsMoviesToDatabase(ytsMovies);
            localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
          }, 1000);
        }
      } catch (error) {
        console.error("Error fetching YTS movies:", error);
        setLoading(false);
        setSyncStatus("Failed to fetch movies");
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse text-center py-4">Loading latest YTS movies...</div>
        {syncStatus && (
          <div className="text-center text-sm text-muted-foreground">
            {syncStatus}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <MovieSlider 
        title="Latest Download" 
        movies={movies.slice(0, 20)}
      />
      {syncStatus && (
        <div className="text-center text-sm text-muted-foreground">
          {syncStatus}
        </div>
      )}
    </div>
  );
} 