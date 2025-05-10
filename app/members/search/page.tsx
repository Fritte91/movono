"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { searchMovies, genres, languages, years, type Movie } from "@/lib/movie-data"
import { Search, Filter, X } from "lucide-react"
import Link from "next/link"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [year, setYear] = useState<string>("")
  const [genre, setGenre] = useState<string>("")
  const [language, setLanguage] = useState<string>("")
  const [results, setResults] = useState<Movie[]>([])
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = () => {
    const filters: {
      year?: number
      genre?: string
      language?: string
    } = {}

    if (year) filters.year = Number.parseInt(year)
    if (genre) filters.genre = genre
    if (language) filters.language = language

    const searchResults = searchMovies(query, filters)
    setResults(searchResults)
    setHasSearched(true)
  }

  const clearFilters = () => {
    setYear("")
    setGenre("")
    setLanguage("")
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Advanced Search</h1>

        <div className="space-y-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="search"
                placeholder="Search for movies, directors, actors..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pr-10 search-input"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            <Button onClick={handleSearch}>Search</Button>

            <Button variant="outline" onClick={() => setIsFiltersVisible(!isFiltersVisible)} className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {isFiltersVisible && (
            <div className="bg-card border border-border rounded-lg p-4 animate-in fade-in-50 slide-in-from-top-5 duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium">Filter Results</h2>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 gap-1 text-xs">
                  <X className="h-3 w-3" />
                  Clear filters
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Year</label>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any year</SelectItem>
                      {years.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Genre</label>
                  <Select value={genre} onValueChange={setGenre}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any genre</SelectItem>
                      {genres.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Language</label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any language</SelectItem>
                      {languages.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {hasSearched && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">
                {results.length > 0
                  ? `Found ${results.length} result${results.length === 1 ? "" : "s"}`
                  : "No results found"}
              </h2>

              {results.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {results.map((movie) => (
                    <Link key={movie.id} href={`/members/movie/${movie.id}`} className="group">
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
              ) : (
                <div className="text-center py-12 bg-card border border-border rounded-lg">
                  <div className="text-4xl mb-4">🎬</div>
                  <h3 className="text-lg font-medium mb-2">No movies found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
