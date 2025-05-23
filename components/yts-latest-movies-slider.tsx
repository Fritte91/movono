"use client";

import { useEffect, useState } from "react";
import { MovieSlider } from "@/components/movie-slider";
import { getLatestYtsMovies, type YtsMovie } from "@/lib/yts-api";
import { Movie } from "@/lib/types";

export function YtsLatestMoviesSlider() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const transformYtsMovie = (movie: YtsMovie): Movie => ({
    id: movie.id,
    title: movie.title_english,
    year: movie.year,
    poster_url: movie.large_cover_image,
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

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const ytsMovies = await getLatestYtsMovies();
        const transformedMovies = ytsMovies.map(transformYtsMovie);
        setMovies(transformedMovies);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching YTS movies:", error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <div className="animate-pulse text-center py-4">Loading latest YTS movies...</div>;
  }

  return (
    <div className="space-y-8">
      <MovieSlider 
        title="Latest Download" 
        movies={movies}
      />
    </div>
  );
} 