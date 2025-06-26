"use client";

import { Suspense, useState, useEffect } from "react";
import { RefreshableMovieSlider } from "./refreshable-movie-slider";
import { fetchMoviesFromSupabaseClient } from "@/lib/supabase-movies";
import { Movie } from "@/lib/movie-data";
import { getMoviesByCategory, fetchMoviesWithFilters } from '@/lib/filters/movieFilters';
import { Skeleton } from "@/components/ui/skeleton";

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

// Main genres for performance optimization
const mainGenres = [
  "Action",
  "Drama", 
  "Comedy",
  "Thriller",
  "Sci-Fi",
  "Horror"
];

// Helper function to get a random offset
const getRandomOffset = () => {
  return Math.floor(Math.random() * 1000);
};

// Loading skeleton for movie sliders
const MovieSliderSkeleton = ({ title }: { title: string }) => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-48" />
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {[1, 2, 3, 4, 5].map((j) => (
        <div key={j} className="space-y-2">
          <Skeleton className="aspect-[2/3] w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  </div>
);

export function MovieSlidersClient() {
  const [movies, setMovies] = useState<{
    popular: Movie[];
    topRated: Movie[];
    newReleases: Movie[];
    comingSoon: Movie[];
    genreMovies: Record<string, Movie[]>;
  }>({
    popular: [],
    topRated: [],
    newReleases: [],
    comingSoon: [],
    genreMovies: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [popular, topRated, newReleases, comingSoon] = await Promise.all([
          getMoviesByCategory('popular'),
          getMoviesByCategory('top_rated'),
          getMoviesByCategory('new_releases'),
          getMoviesByCategory('coming_soon')
        ]);

        // Create an array of possible sort options with correct types
        const sortOptions = [
          { sortBy: 'popularity' as const, sortOrder: 'desc' as const },
          { sortBy: 'ratings->>imdb' as const, sortOrder: 'desc' as const },
          { sortBy: 'year' as const, sortOrder: 'desc' as const },
          { sortBy: 'vote_count' as const, sortOrder: 'desc' as const }
        ];

        const genreMoviesPromises = mainGenres.map(genre => {
          // Get a random sort option
          const randomSort = sortOptions[Math.floor(Math.random() * sortOptions.length)];
          
          // Generate a random offset between 0 and 200 for more variety
          const randomOffset = Math.floor(Math.random() * 200);
          
          // Randomly adjust the year range to get more variety
          const currentYear = new Date().getFullYear();
          const randomYearRange = Math.floor(Math.random() * 3); // 0, 1, or 2
          const minYear = currentYear - (20 + randomYearRange * 10); // 20, 30, or 40 years back
          
          return fetchMoviesWithFilters({ 
            genre,
            minYear,
            maxYear: currentYear,
            minImdb: 5.0,
            minVoteCount: 50,
            minPopularity: 5,
            ...randomSort,
            limit: 20,
            offset: randomOffset
          });
        });
        
        const genreMoviesResults = await Promise.all(genreMoviesPromises);
        const genreMovies = Object.fromEntries(
          mainGenres.map((genre, index) => [genre, genreMoviesResults[index].movies])
        );

        setMovies({
          popular,
          topRated,
          newReleases,
          comingSoon,
          genreMovies
        });
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="container py-8 space-y-8">
        {['Popular', 'Top Rated', 'New Releases', 'Coming Soon', ...mainGenres].map((title) => (
          <MovieSliderSkeleton key={title} title={title} />
        ))}
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <Suspense fallback={<MovieSliderSkeleton title="Popular" />}>
        <RefreshableMovieSlider
          title="Popular"
          initialMovies={movies.popular}
          onRefresh={() => fetchMoviesFromSupabaseClient("popular", { offset: getRandomOffset() })}
        />
      </Suspense>

      <Suspense fallback={<MovieSliderSkeleton title="Top Rated" />}>
        <RefreshableMovieSlider
          title="Top Rated"
          initialMovies={movies.topRated}
          onRefresh={() => fetchMoviesFromSupabaseClient("top_rated", { offset: getRandomOffset() })}
        />
      </Suspense>

      <Suspense fallback={<MovieSliderSkeleton title="New Releases" />}>
        <RefreshableMovieSlider
          title="New Releases"
          initialMovies={movies.newReleases}
          onRefresh={() => fetchMoviesFromSupabaseClient("new_releases", { offset: getRandomOffset() })}
        />
      </Suspense>

      <Suspense fallback={<MovieSliderSkeleton title="Coming Soon" />}>
        <RefreshableMovieSlider
          title="Coming Soon"
          initialMovies={movies.comingSoon}
          onRefresh={async () => {
            const { getUpcomingMovies } = await import("@/lib/api/tmdb");
            const movies = await getUpcomingMovies();
            return movies
              .filter(movie => {
                // Access properties using bracket notation to avoid type issues
                const movieData = movie as any;
                return !!movieData.posterUrl;
              })
              .map(movie => {
                // Access properties using bracket notation to avoid type issues
                const movieData = movie as any;
                return {
                  imdb_id: movieData.id, // Use the TMDB ID (tmdb-{id}) as imdb_id for the slider
                  title: movie.title,
                  year: movie.year,
                  posterUrl: movieData.posterUrl ? movieData.posterUrl : (movieData.poster_url ? movieData.poster_url : '/placeholder.svg'),
                  genre: movie.genre || [],
                  ratings: movie.ratings || { imdb: 0, rottenTomatoes: '0', metacritic: 0 },
                  runtime: movie.runtime || 0,
                  released: "",
                  director: movie.director || "",
                  writer: "",
                  actors: movieData.cast || [],
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
                  id: movieData.id, // Use the TMDB ID (tmdb-{id}) as the main ID
                } as Movie;
              });
          }}
        />
      </Suspense>

      {/* Genre Sliders */}
      {Object.entries(movies.genreMovies).map(([genre, movies]) => (
        <Suspense key={genre} fallback={<MovieSliderSkeleton title={genre} />}>
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