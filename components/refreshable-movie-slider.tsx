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

// Keep track of last refresh time and retry count for each slider
const sliderState: { 
  [key: string]: { 
    lastRefresh: number;
    retryCount: number;
    hasMovies: boolean;
  } 
} = {};

let isInitialLoad = true;

export function RefreshableMovieSlider({ title, initialMovies, onRefresh }: RefreshableMovieSliderProps) {
  const queryClient = useQueryClient();
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize slider state if not exists
  if (!sliderState[title]) {
    sliderState[title] = {
      lastRefresh: 0,
      retryCount: 0,
      hasMovies: initialMovies.length > 0
    };
  }

  // Set up React Query with shorter stale time
  const { data: queryData } = useQuery({
    queryKey: ['movies', title],
    queryFn: onRefresh,
    initialData: initialMovies,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2, // Reduced retries
    retryDelay: 2000, // Increased delay between retries
  });

  useEffect(() => {
    console.log(`[${title}] RefreshableMovieSlider received initialMovies:`, initialMovies.length);
    setMovies(initialMovies);
    sliderState[title].hasMovies = initialMovies.length > 0;
  }, [initialMovies, title]); // Added title dependency

  useEffect(() => {
    if (queryData) {
      console.log(`[${title}] RefreshableMovieSlider useQuery fetched data:`, queryData.length);
      if (queryData.length > 0) {
        setMovies(queryData);
        sliderState[title].hasMovies = true;
        sliderState[title].retryCount = 0; // Reset retry count on success
      } else {
        // If query returns 0 movies, increment retry count and keep existing
        sliderState[title].retryCount++;
        sliderState[title].hasMovies = false;
        console.log(`[${title}] RefreshableMovieSlider received 0 movies from query. Retry count: ${sliderState[title].retryCount}`);
      }
    }
  }, [queryData, title]); // Added title dependency

  // Modify the refresh logic slightly to use queryClient.fetchQuery
  useEffect(() => {
    const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
    const STAGGER_DELAY = 1000; // 1 second between each slider refresh
    const TIMEOUT = 10000; // 10 second timeout for each refresh
    const MAX_RETRIES = 3; // Maximum number of retries for empty results

    const checkAndRefresh = async () => {
      if (isRefreshing) return; // Prevent concurrent refreshes

      const now = Date.now();
      const state = sliderState[title];

      // Don't refresh if:
      // 1. It's too soon since last refresh
      // 2. We have no movies and have exceeded retry limit
      if ((now - state.lastRefresh < REFRESH_INTERVAL && !isInitialLoad) ||
          (!state.hasMovies && state.retryCount >= MAX_RETRIES)) {
        console.log(`[${title}] Skipping refresh check.`);
        return;
      }

      // Only apply stagger delay for subsequent refreshes, not initial load
      if (!isInitialLoad) {
        const titleHash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const delay = (titleHash % 5) * STAGGER_DELAY;
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      console.log(`[${title}] Starting refresh...`);

      try {
        setIsRefreshing(true);
        // Use queryClient.fetchQuery to trigger the queryFn
        await queryClient.fetchQuery({
          queryKey: ['movies', title],
          queryFn: onRefresh,
          staleTime: 0, // Force refetch
          gcTime: 0, // Force garbage collection after fetch
        });
        state.lastRefresh = now;
        // The actual movie state update happens in the useEffect for queryData
      } catch (error) {
        console.error(`[${title}] Error refreshing movies:`, error);
        // Error will be handled by React Query's retry logic if enabled
      } finally {
        setIsRefreshing(false);
        isInitialLoad = false; // Mark initial load as complete after the first refresh attempt
      }
    };

    // Initial refresh after component mounts (if not already loaded by SSR/initialData)
    if (initialMovies.length === 0 || isInitialLoad) {
      checkAndRefresh();
    }

    // Set up periodic refresh
    const intervalId = setInterval(checkAndRefresh, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [title, onRefresh, queryClient, isRefreshing, initialMovies.length]); // Added initialMovies.length dependency

  // Use the cached data from React Query or initial data
  const displayMovies = queryData || movies;

  // Add logging for the data passed to MovieSlider
  useEffect(() => {
    console.log(`[${title}] Passing ${displayMovies?.length || 0} movies to MovieSlider`);
  }, [displayMovies, title]);

  return (
    <div>
      <MovieSlider 
        title={title} 
        movies={displayMovies}
      />
    </div>
  );
} 