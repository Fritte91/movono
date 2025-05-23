"use client";

import { useEffect, useState } from "react";
import { MovieSlider } from "@/components/movie-slider";

interface SimilarMovie {
  imdb_id: string;
  title: string;
  poster_url: string;
  year: number;
  imdb_rating: number;
}

export function SimilarMovies({ movieId }: { movieId: string }) {
  const [similarMovies, setSimilarMovies] = useState<SimilarMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSimilarMovies() {
      setLoading(true);
      try {
        const res = await fetch(`/api/similar?movieId=${movieId}`);
        const data = await res.json();
        console.log('API Response:', data.movies);
        setSimilarMovies(data.movies || []);
      } catch (err) {
        console.error('Error fetching similar movies:', err);
        setSimilarMovies([]);
      }
      setLoading(false);
    }
    fetchSimilarMovies();
  }, [movieId]);

  if (loading) {
    return <div className="animate-pulse text-center py-4">Loading similar movies...</div>;
  }

  if (!similarMovies.length) {
    return null;
  }

  const mappedMovies = similarMovies.map(movie => {
    console.log('Processing movie:', { title: movie.title, poster_url: movie.poster_url });
    return {
      id: movie.imdb_id,
      title: movie.title,
      poster_url: movie.poster_url,
      year: movie.year,
      imdbRating: movie.imdb_rating,
      genre: [],
      ratings: {
        imdb: movie.imdb_rating,
        rottenTomatoes: "N/A",
        metacritic: 0
      },
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
      website: "",
      imdb_id: movie.imdb_id
    };
  });

  console.log('Mapped movies for slider:', mappedMovies.map(m => ({ title: m.title, poster_url: m.poster_url })));

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Similar Movies</h2>
      <MovieSlider 
        title="" 
        movies={mappedMovies}
      />
    </div>
  );
} 