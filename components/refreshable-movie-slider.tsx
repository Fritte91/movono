"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
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

// Memoized slider component to prevent unnecessary re-renders
const MemoizedMovieSlider = memo(MovieSlider);

export function RefreshableMovieSlider({ title, initialMovies, onRefresh }: RefreshableMovieSliderProps) {
  const queryClient = useQueryClient();
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Memoized query key to prevent unnecessary re-renders
  const queryKey = useMemo(() => ['movies', title], [title]);

  // Initialize slider state if not exists
  if (!sliderState[title]) {
    sliderState[title] = {
      lastRefresh: 0,
      retryCount: 0,
      hasMovies: initialMovies.length > 0
    };
  }

  // Memoized refresh function to prevent unnecessary re-renders
  const memoizedOnRefresh = useCallback(async () => {
    try {
      const result = await onRefresh();
      return result;
    } catch (error) {
      console.error(`[${title}] Error in refresh function:`, error);
      return [];
    }
  }, [onRefresh, title]);

  // Set up React Query with optimized settings
  const { data: queryData } = useQuery({
    queryKey,
    queryFn: memoizedOnRefresh,
    initialData: initialMovies,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2, // Reduced retries
    retryDelay: 2000, // Increased delay between retries
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: false, // Prevent refetch on mount if we have data
  });

  // Memoized effect for updating movies state
  useEffect(() => {
    setMovies(initialMovies);
    sliderState[title].hasMovies = initialMovies.length > 0;
  }, [initialMovies, title]);

  // Memoized effect for handling query data updates
  useEffect(() => {
    if (queryData) {
      if (queryData.length > 0) {
        setMovies(queryData);
        sliderState[title].hasMovies = true;
        sliderState[title].retryCount = 0; // Reset retry count on success
      } else {
        // If query returns 0 movies, increment retry count and keep existing
        sliderState[title].retryCount++;
        sliderState[title].hasMovies = false;
      }
    }
  }, [queryData, title]);

  // Memoized refresh logic
  const checkAndRefresh = useCallback(async () => {
    if (isRefreshing) return; // Prevent concurrent refreshes

    const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
    const STAGGER_DELAY = 1000; // 1 second between each slider refresh
    const MAX_RETRIES = 3; // Maximum number of retries for empty results

    const now = Date.now();
    const state = sliderState[title];

    // Don't refresh if:
    // 1. It's too soon since last refresh
    // 2. We have no movies and have exceeded retry limit
    if ((now - state.lastRefresh < REFRESH_INTERVAL && !isInitialLoad) ||
        (!state.hasMovies && state.retryCount >= MAX_RETRIES)) {
      return;
    }

    // Only apply stagger delay for subsequent refreshes, not initial load
    if (!isInitialLoad) {
      const titleHash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const delay = (titleHash % 5) * STAGGER_DELAY;
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    try {
      setIsRefreshing(true);
      // Use queryClient.fetchQuery to trigger the queryFn
      await queryClient.fetchQuery({
        queryKey,
        queryFn: memoizedOnRefresh,
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
  }, [title, queryClient, isRefreshing, memoizedOnRefresh, queryKey]);

  // Set up periodic refresh with memoized effect
  useEffect(() => {
    // Initial refresh after component mounts (if not already loaded by SSR/initialData)
    if (initialMovies.length === 0 || isInitialLoad) {
      checkAndRefresh();
    }

    // Set up periodic refresh
    const intervalId = setInterval(checkAndRefresh, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(intervalId);
  }, [checkAndRefresh, initialMovies.length]);

  // Memoized display movies to prevent unnecessary re-renders
  const displayMovies = useMemo(() => {
    return queryData || movies;
  }, [queryData, movies]);

  return (
    <div>
      <MemoizedMovieSlider 
        title={title} 
        movies={displayMovies}
      />
    </div>
  );
} 