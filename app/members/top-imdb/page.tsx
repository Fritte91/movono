"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getMovies, genres, allMovieTitles } from "@/lib/movie-data";
import Link from "next/link";
import { RatingStars } from "@/components/rating-stars";

interface Movie {
  id: string;
  title: string;
  year: number;
  posterUrl: string;
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

export default function TopImdbPage() {
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMovies() {
      setIsLoading(true);
      setError(null);
      try {
        const movies = await getMovies(allMovieTitles);
        setAllMovies(movies || []);
      } catch (err) {
        setError("Failed to load movies");
        console.error("Fetch error:", err);
        setAllMovies([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMovies();
  }, []);

  const topMovies = useMemo(() => {
    let filtered = [...allMovies].sort((a, b) => (b.ratings?.imdb || 0) - (a.ratings?.imdb || 0));
    if (selectedGenre !== "All") {
      filtered = filtered.filter((movie) =>
        movie?.genre && Array.isArray(movie.genre) && movie.genre.includes(selectedGenre)
      );
    }
    return filtered.slice(0, 100);
  }, [allMovies, selectedGenre]);

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
          <h1 className="text-3xl font-bold">IMDb Top Movies</h1>
          <p className="text-muted-foreground mt-1">The highest-rated films according to IMDb</p>
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

      <div className="space-y-4">
        {topMovies.map((movie, index) => (
          <Link key={movie.id} href={`/members/movie/${movie.id}`}>
            <div className="bg-card border border-border hover:border-primary/50 rounded-lg p-4 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-muted-foreground w-10 text-center">#{index + 1}</div>

                <div className="h-20 w-14 shrink-0">
                  <img
                    src={movie.posterUrl || "/placeholder.svg"}
                    alt={movie.title}
                    className="h-full w-full object-cover rounded"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-medium">
                    {movie.title} <span className="text-muted-foreground">({movie.year})</span>
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-yellow-400 font-medium">{movie.ratings?.imdb || "N/A"}</span>
                    <RatingStars
                      initialRating={Math.round((movie.ratings?.imdb || 0) / 2)}
                      readOnly
                      size="sm"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {movie.genre.map((g) => (
                      <span key={g} className="px-2 py-0.5 bg-secondary rounded-full text-xs">
                        {g}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{movie.plot}</p>
                </div>

                <Button variant="ghost" size="sm" className="shrink-0">
                  View Details
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}