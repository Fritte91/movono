"use client";

import { useEffect, useState } from "react";
import { MovieSlider } from "@/components/movie-slider";
import { Movie } from "@/lib/movie-data";

export function SimilarMovies({ movieId }: { movieId: string }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSimilarMovies() {
      setLoading(true);
      try {
        const response = await fetch(`/api/similar?movieId=${movieId}`);
        const data = await response.json();
        
        if (data.movies && data.movies.length > 0) {
          const mappedMovies: Movie[] = data.movies.map((movie: any) => ({
            id: movie.imdb_id,
            title: movie.title,
            poster_url: movie.poster_url,
            year: movie.year,
            imdb_id: movie.imdb_id,
            genre: movie.genre || [],
            ratings: movie.ratings || { imdb: 0, rottenTomatoes: 'N/A', metacritic: 0 },
            runtime: 0,
            released: "",
            director: "",
            writer: "",
            actors: [],
            plot: "",
            language: [],
            country: [],
            awards: "",
            metascore: 0,
            imdbVotes: 0,
            type: "movie",
            dvd: "",
            boxOffice: "",
            production: "",
            website: ""
          }));
          
          setMovies(mappedMovies);
        } else {
          setMovies([]);
        }
      } catch (error) {
        setMovies([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSimilarMovies();
  }, [movieId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Similar Movies</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Similar Movies</h2>
      <MovieSlider title="Similar Movies" movies={movies} />
    </div>
  );
} 