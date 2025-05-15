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

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Similar Movies</h2>
      <MovieSlider 
        title="" 
        movies={similarMovies.map(movie => ({
          id: movie.imdb_id,
          title: movie.title,
          posterUrl: movie.poster_url,
          year: movie.year,
          imdbRating: movie.imdb_rating
        }))} 
      />
    </div>
  );
} 