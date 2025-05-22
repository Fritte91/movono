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
const getRandomOffset = () => {
  // Generate a random number between 0 and 1000 to get more variety
  return Math.floor(Math.random() * 1000);
};

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
            return movies
              .filter(movie => !!movie.imdbId && !!movie.posterUrl)
              .map(movie => ({
                imdb_id: movie.imdbId,
                title: movie.title,
                year: movie.year,
                poster_url: movie.posterUrl,
                genre: movie.genre || [],
                ratings: movie.ratings || { imdb: 0, rottenTomatoes: '0', metacritic: 0 },
                runtime: movie.runtime || 0,
                released: "",
                director: movie.director || "",
                writer: "",
                actors: movie.cast || [],
                plot: movie.plot || "",
                language: movie.language || [],
                country: movie.country || [],
                awards: "",
                metascore: 0,
                imdbVotes: 0,
                type: "movie",
                dvd: "",
                boxOffice: "",
                production: "",
                website: "",
                id: movie.imdbId,
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