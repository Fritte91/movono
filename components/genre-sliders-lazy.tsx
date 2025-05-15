"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const LazyMovieSlider = dynamic(
  () => import("./movie-slider").then((mod) => mod.MovieSlider),
  { ssr: false }
);

export function GenreSlidersLazy({ genreList, genreSliders }) {
  return (
    <>
      {genreList.map((genre, idx) => (
        <Suspense key={genre} fallback={<div>Loading {genre} movies...</div>}>
          <LazyMovieSlider title={genre} movies={genreSliders[idx]} />
        </Suspense>
      ))}
    </>
  );
} 