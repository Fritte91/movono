"use client";

import { Suspense } from "react";
import { RefreshableMovieSlider } from "./refreshable-movie-slider";
import { fetchMoviesFromSupabaseClient } from "@/lib/supabase-movies";
import { Movie } from "@/lib/movie-data";

interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  genre_ids: number[];
}

// TMDB genre mapping
const TMDB_GENRES: { [key: number]: string } = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  53: "Thriller",
  10752: "War",
  37: "Western"
};

// Helper function to get a random offset
const getRandomOffset = () => Math.floor(Math.random() * 100);

interface MovieSlidersClientProps {
  initialMovies: {
    popular: Movie[];
    topRated: Movie[];
    newReleases: Movie[];
    comingSoon: Movie[];
    genreMovies: Record<string, Movie[]>;
  };
}

export function MovieSlidersClient({ initialMovies }: MovieSlidersClientProps) {
  return (
    <div className="space-y-8">
      <Suspense fallback={<div>Loading popular movies...</div>}>
        <RefreshableMovieSlider
          title="Popular"
          initialMovies={initialMovies.popular}
          onRefresh={() => fetchMoviesFromSupabaseClient("popular", { offset: getRandomOffset() })}
        />
      </Suspense>

      <Suspense fallback={<div>Loading top rated movies...</div>}>
        <RefreshableMovieSlider
          title="Top Rated"
          initialMovies={initialMovies.topRated}
          onRefresh={() => fetchMoviesFromSupabaseClient("top_rated", { offset: getRandomOffset() })}
        />
      </Suspense>

      <Suspense fallback={<div>Loading new releases...</div>}>
        <RefreshableMovieSlider
          title="New Releases"
          initialMovies={initialMovies.newReleases}
          onRefresh={() => fetchMoviesFromSupabaseClient("new_releases", { offset: getRandomOffset() })}
        />
      </Suspense>

      <Suspense fallback={<div>Loading coming soon movies...</div>}>
        <RefreshableMovieSlider
          title="Coming Soon"
          initialMovies={initialMovies.comingSoon}
          onRefresh={async () => {
            const { getUpcomingMovies } = await import("@/lib/api/tmdb");
            const movies = await getUpcomingMovies();
            return movies.map(movie => ({
              id: movie.id,
              title: movie.title,
              year: movie.year,
              genre: movie.genre || [],
              posterUrl: movie.posterUrl || '/placeholder.svg'
            }));
          }}
        />
      </Suspense>

      {/* Genre Sliders */}
      {Object.entries(initialMovies.genreMovies).map(([genre, movies]) => (
        <Suspense key={genre} fallback={<div>Loading {genre} movies...</div>}>
          <RefreshableMovieSlider
            title={genre}
            initialMovies={movies}
            onRefresh={() => fetchMoviesFromSupabaseClient("genre", { 
              genre: genre,
              offset: getRandomOffset()
            })}
          />
        </Suspense>
      ))}
    </div>
  );
} 