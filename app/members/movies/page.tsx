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
import { genres } from "@/lib/movie-data";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getMoviesFromSupabase } from "@/lib/api/getMoviesFromSupabase";

interface Movie {
  id: string;
  title: string;
  year: number;
  poster_url: string;
  posterUrl?: string;
  imdb_id: string;
  genre: string[];
  ratings: {
    imdb: number;
    rottenTomatoes: string;
    metacritic: number;
  };
  runtime: number;
  released: string;
  director: string;
  writer: string;
  actors: string[];
  plot: string;
  language: string[];
  country: string[];
  awards: string;
  metascore: number;
  imdbVotes: number;
  type: string;
  dvd: string;
  boxOffice: string;
  production: string;
  website: string;
}

interface StoredMovieState {
  genre: string;
  page: number;
  timestamp: number;
}

interface MovieFilterOptions {
  genre?: string;
  sortBy?: string;
  limit?: number;
}

export default function MoviesPage() {
  const searchParams = useSearchParams();
  const genreParam = searchParams.get("genre");

  const [selectedGenre, setSelectedGenre] = useState<string>(() => {
    // Check localStorage first
    const storedState = localStorage.getItem('movieListState');
    if (storedState) {
      const { genre, timestamp }: StoredMovieState = JSON.parse(storedState);
      // Check if the stored state is less than 10 minutes old
      if (Date.now() - timestamp < 10 * 60 * 1000) {
        return genre;
      }
    }
    // Fall back to URL param or default
    return genreParam || "All";
  });

  const [currentPage, setCurrentPage] = useState(() => {
    // Check localStorage first
    const storedState = localStorage.getItem('movieListState');
    if (storedState) {
      const { page, timestamp }: StoredMovieState = JSON.parse(storedState);
      // Check if the stored state is less than 10 minutes old
      if (Date.now() - timestamp < 10 * 60 * 1000) {
        return page;
      }
    }
    return 1;
  });

  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const moviesPerPage = 50;

  // Function to store state in localStorage
  const storeMovieState = (genre: string, page: number) => {
    const state: StoredMovieState = {
      genre,
      page,
      timestamp: Date.now()
    };
    localStorage.setItem('movieListState', JSON.stringify(state));
  };

  // Update stored state when genre or page changes
  useEffect(() => {
    storeMovieState(selectedGenre, currentPage);
  }, [selectedGenre, currentPage]);

  useEffect(() => {
    async function fetchMovies() {
      setIsLoading(true);
      setError(null);
      try {
        const filterOptions: MovieFilterOptions = {
          sortBy: "ratings->>imdb",
          limit: 500,
        };
        
        if (selectedGenre !== "All") {
          filterOptions.genre = selectedGenre;
        }

        const movies = await getMoviesFromSupabase(filterOptions);
        
        // Map the movies to match our interface
        const mapped: Movie[] = (movies as any[] || [])
          .filter(movie => !!movie.imdb_id && !!movie.poster_url)
          .map((movie: any) => ({
            id: movie.imdb_id,
            title: movie.title,
            year: movie.year,
            poster_url: movie.poster_url,
            posterUrl: movie.poster_url,
            imdb_id: movie.imdb_id,
            genre: movie.genre || [],
            ratings: movie.ratings || { imdb: 0, rottenTomatoes: 'N/A', metacritic: 0 },
            runtime: 0,
            released: '',
            director: '',
            writer: '',
            actors: [],
            plot: '',
            language: [],
            country: [],
            awards: '',
            metascore: 0,
            imdbVotes: 0,
            type: 'movie',
            dvd: '',
            boxOffice: '',
            production: '',
            website: ''
          }));
        setAllMovies(mapped);
      } catch (err) {
        setError("Failed to load movies");
        setAllMovies([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMovies();
  }, [selectedGenre]);

  // Pagination
  const totalPages = Math.ceil(allMovies.length / moviesPerPage) || 1;
  const startIndex = (currentPage - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  const currentMovies = allMovies.slice(startIndex, endIndex);

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
            {currentMovies.map((movie) => {
              return (
                <Link key={movie.imdb_id} href={`/members/movie/${movie.imdb_id}`} className="group">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                  <div className="mt-2 space-y-1">
                    <h3 className="font-medium text-sm line-clamp-2">{movie.title}</h3>
                    <p className="text-xs text-muted-foreground">{movie.year}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, allMovies.length)} of {allMovies.length} movies
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