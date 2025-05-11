// app/members/movies/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMovies, genres } from "@/lib/movie-data";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function MoviesPage() {
  const searchParams = useSearchParams();
  const genreParam = searchParams.get("genre");

  const [selectedGenre, setSelectedGenre] = useState<string>(genreParam || "All");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredMovies, setFilteredMovies] = useState<any[]>([]); // Initialize as empty array
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const moviesPerPage = 50;

  useEffect(() => {
    async function fetchMovies() {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch movies using getMovies (expects movie titles, returns Movie objects)
        const movies = await getMovies([
          "Inception",
          "The Matrix",
          "The Shawshank Redemption",
          // Add more titles or use allMovieTitles
        ]);
        setFilteredMovies(movies || []);
      } catch (err) {
        setError("Failed to load movies");
        console.error("Fetch error:", err);
        setFilteredMovies([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMovies();
  }, []);

  useEffect(() => {
    // Filter movies by genre
    async function filterMovies() {
      let movies = await getMovies([
        "Inception",
        "The Matrix",
        "The Shawshank Redemption",
      ]);
      if (selectedGenre !== "All") {
        movies = movies.filter((movie) => movie.genre.includes(selectedGenre));
      }
      setFilteredMovies(movies || []);
      setCurrentPage(1); // Reset to first page when genre changes
    }
    filterMovies();
  }, [selectedGenre]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage) || 1;
  const startIndex = (currentPage - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  const currentMovies = filteredMovies.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8 text-center">
        <div className="animate-pulse">Loading movies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Movies</h1>
          <p className="text-muted-foreground mt-1">Browse our extensive collection of movies</p>
        </div>

        <div className="w-full md:w-auto">
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Genres</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {currentMovies.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {currentMovies.map((movie) => (
              <Link key={movie.id} href={`/movies/${movie.id}`} className="group">
                <div className="movie-card rounded-lg overflow-hidden bg-card border border-border/50 h-full">
                  <div className="aspect-[2/3] relative">
                    <img
                      src={movie.posterUrl || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                      <Button variant="secondary" size="sm">
                        View Details
                      </Button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <div className="text-sm font-medium truncate">{movie.title}</div>
                      <div className="text-xs text-gray-400">{movie.year}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredMovies.length)} of {filteredMovies.length} movies
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <div className="text-4xl mb-4">🎬</div>
          <h3 className="text-lg font-medium mb-2">No Movies Found</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            We couldn't find any movies matching your selected genre. Try selecting a different genre.
          </p>
          <Button onClick={() => setSelectedGenre("All")}>View All Movies</Button>
        </div>
      )}
    </div>
  );
}