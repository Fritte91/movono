import { useEffect, useState } from "react";
import { MovieSlider } from "@/components/movie-slider";
import { getPopularMovies, Movie } from "@/lib/movie-data";

export function PopularMoviesSlider() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const fetchedMovies = await getPopularMovies();
        setMovies(fetchedMovies);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <div>Loading popular movies...</div>;

  return <MovieSlider movies={movies.slice(0, 20)} title="Popular Movies" />;
}
