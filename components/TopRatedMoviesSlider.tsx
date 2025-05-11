import { useEffect, useState } from "react";
import { getTopRatedMovies } from "@/lib/movie-data";
import MovieSlider from "@/components/MovieSlider"; // Assuming you already have the MovieSlider component

export function TopRatedMoviesSlider() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const fetchedMovies = await getTopRatedMovies();
        setMovies(fetchedMovies);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <div>Loading top-rated movies...</div>;

  return <MovieSlider movies={movies} title="Top Rated Movies" />;
}
