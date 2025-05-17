"use client";

import { useState, useEffect } from "react";
import { MovieSlider } from "./movie-slider";
import { Movie } from "@/lib/movie-data";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface RefreshableMovieSliderProps {
  title: string;
  initialMovies: Movie[];
  onRefresh: () => Promise<Movie[]>;
}

// Keep track of last refresh time for each slider
const lastRefreshTimes: { [key: string]: number } = {};
let isInitialLoad = true;

export function RefreshableMovieSlider({ title, initialMovies, onRefresh }: RefreshableMovieSliderProps) {
  const queryClient = useQueryClient();
  const [movies, setMovies] = useState<Movie[]>(initialMovies);

  // Set up React Query
  const { data: queryData } = useQuery({
    queryKey: ['movies', title],
    queryFn: onRefresh,
    initialData: initialMovies,
    staleTime: 20 * 60 * 1000, // 20 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  useEffect(() => {
    const REFRESH_INTERVAL = 20 * 60 * 1000; // 20 minutes
    const STAGGER_DELAY = 2000; // 2 seconds between each slider refresh

    const refreshMovies = async () => {
      try {
        // Check if it's time to refresh this slider
        const now = Date.now();
        const lastRefresh = lastRefreshTimes[title] || 0;
        
        if (now - lastRefresh < REFRESH_INTERVAL) {
          return;
        }

        // Only apply stagger delay for subsequent refreshes, not initial load
        if (!isInitialLoad) {
          const titleHash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const delay = (titleHash % 10) * STAGGER_DELAY;
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        console.log(`[${title}] Starting refresh...`);
        const newMovies = await onRefresh();
        console.log(`[${title}] Received ${newMovies.length} new movies`);
        
        // Update both local state and React Query cache
        setMovies(newMovies);
        queryClient.setQueryData(['movies', title], newMovies);
        
        lastRefreshTimes[title] = now;
      } catch (error) {
        console.error(`[${title}] Error refreshing movies:`, error);
      }
    };

    // Initial refresh after component mounts
    refreshMovies();
    isInitialLoad = false;

    // Set up periodic refresh
    const intervalId = setInterval(refreshMovies, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [title, onRefresh, queryClient]);

  // Use the cached data from React Query
  const displayMovies = queryData || movies;

  return (
    <div>
      <MovieSlider 
        title={title} 
        movies={displayMovies}
      />
    </div>
  );
} 