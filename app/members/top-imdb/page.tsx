"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { allMovies, genres } from "@/lib/movie-data"
import Link from "next/link"
import { RatingStars } from "@/components/rating-stars"

export default function TopImdbPage() {
  const [selectedGenre, setSelectedGenre] = useState<string>("All")
  const [topMovies, setTopMovies] = useState(allMovies)

  useEffect(() => {
    // Sort by IMDB rating
    let filtered = [...allMovies].sort((a, b) => b.ratings.imdb - a.ratings.imdb)

    // Filter by genre if not "All"
    if (selectedGenre !== "All") {
      filtered = filtered.filter((movie) => movie.genre.includes(selectedGenre))
    }

    // Limit to top 100
    setTopMovies(filtered.slice(0, 100))
  }, [selectedGenre])

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
                    <span className="text-yellow-400 font-medium">{movie.ratings.imdb}</span>
                    <RatingStars initialRating={Math.round(movie.ratings.imdb / 2)} readOnly size="sm" />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {movie.genre.map((g) => (
                      <span key={g} className="px-2 py-0.5 bg-secondary rounded-full text-xs">
                        {g}
                      </span>
                    ))}
                  </div>
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
  )
}
