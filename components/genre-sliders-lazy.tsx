"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { fetchMoviesFromSupabaseClient } from "@/lib/supabase-movies";
import { Movie } from "@/lib/movie-data";

const LazyMovieSlider = dynamic(
  () => import("./movie-slider").then((mod) => mod.MovieSlider),
  { ssr: false }
);

interface GenreSlidersLazyProps {
  genreList: string[];
  genreSliders: Movie[][];
}

export function GenreSlidersLazy({ genreList, genreSliders }: GenreSlidersLazyProps) {
  return (
    <>
      {genreList.map((genre: string, idx: number) => (
        <Suspense key={genre} fallback={<div>Loading {genre} movies...</div>}>
          <LazyMovieSlider 
            title={genre} 
            movies={genreSliders[idx]} 
            onRefresh={async () => {
              const newMovies = await fetchMoviesFromSupabaseClient({ 
                genre, 
                minYear: 1990, 
                maxYear: 2025, 
                minImdb: 6, 
                sortBy: 'year', 
                limit: 20 
              });
              return newMovies.map(movie => ({
                ...movie,
                posterUrl: movie.poster_url || movie.posterUrl || '/placeholder.svg',
              }));
            }}
          />
        </Suspense>
      ))}
    </>
  );
} 