import { useEffect, useState } from "react";
import { getPopularMovies } from "@/lib/movie-data";
import MovieSlider from "@/components/MovieSlider"; // Assuming you already have the MovieSlider component

export function PopularMoviesSlider() {
  const [movies, setMovies] = useState([]);
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

  return <MovieSlider movies={movies} title="Popular Movies" />;
}
