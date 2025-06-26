"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { genres } from "@/lib/movie-data"
import { Search, Filter, X } from "lucide-react"
import Link from "next/link"
import { getMoviesFromSupabase } from "@/lib/api/getMoviesFromSupabase"
import { supabase } from '@/lib/supabase-client'

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 60 }, (_, i) => currentYear - i); // Last 60 years

const languages = [
  "en", "fr", "es", "de", "it", "sv", "no", "da", "fi", "ru", "zh", "ja", "ko", "ar", "pt", "tr"
];

const languageMap: Record<string, string> = {
  en: "English",
  fr: "French",
  es: "Spanish",
  de: "German",
  it: "Italian",
  sv: "Swedish",
  no: "Norwegian",
  da: "Danish",
  fi: "Finnish",
  ru: "Russian",
  zh: "Chinese",
  ja: "Japanese",
  ko: "Korean",
  ar: "Arabic",
  pt: "Portuguese",
  tr: "Turkish",
  // Add more as needed
};

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [year, setYear] = useState<string>("")
  const [genre, setGenre] = useState<string>("")
  const [language, setLanguage] = useState<string>("")
  const [results, setResults] = useState<any[]>([])
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Add this useEffect to handle URL query parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      handleSearchWithQuery(q)
    }
  }, [])

  const handleSearchWithQuery = async (searchQuery: string) => {
    setIsLoading(true)
    setError(null)
    let filters: any = {
      sortBy: "ratings->>imdb",
      limit: 100,
    }
    if (searchQuery) filters.title = searchQuery
    if (year && year !== "any") filters.year = Number(year)
    if (genre && genre !== "any") filters.genre = genre
    if (language && language !== "any") filters.language = language

    // Build Supabase query
    const supabaseFilters: any = {
      sortBy: "ratings->>imdb",
      limit: 100,
    }
    let customFilter = (q: any) => q
    if (filters.title) {
      customFilter = (q: any) => q.ilike("title", `%${filters.title}%`)
    }
    if (filters.year) {
      customFilter = ((prev) => (q: any) => prev(q).eq("year", filters.year))(customFilter)
    }
    if (filters.genre) {
      customFilter = ((prev) => (q: any) => prev(q).contains("genre", [filters.genre]))(customFilter)
    }
    if (filters.language) {
      customFilter = ((prev) => (q: any) => prev(q).contains("language", [filters.language]))(customFilter)
    }

    // Use a custom version of getMoviesFromSupabase that allows customFilter
    const { createClient } = await import("@supabase/supabase-js")
    const supabaseUrl = 'https://witpoqobiuvhokyjopod.supabase.co'
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpdHBvcW9iaXV2aG9reWpvcG9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2Mjg1NDYsImV4cCI6MjA2MzIwNDU0Nn0.-a_2H_9eJP3lPMOcaK19kWVGrVhzGnhzqmggY9my9RQ'
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    try {
      // Search in both tables
      const [miniResults, moviesResults] = await Promise.all([
        // Query movies_mini table
        (async () => {
          let queryBuilder = supabase.from("movies_mini").select("*")
          queryBuilder = customFilter(queryBuilder)
          queryBuilder = queryBuilder.order("ratings->>imdb", { ascending: false }).limit(100)
          const { data, error } = await queryBuilder
          if (error) {
            console.error("Error fetching from movies_mini:", error)
            return []
          }
          return (data || []).map((movie: any) => ({
            ...movie,
            id_type: 'imdb',
            unique_id: movie.imdb_id
          }))
        })(),
        // Query movies table
        (async () => {
          let queryBuilder = supabase.from("movies").select("*")
          queryBuilder = customFilter(queryBuilder)
          queryBuilder = queryBuilder.order("ratings->>imdb", { ascending: false }).limit(100)
          const { data, error } = await queryBuilder
          if (error) {
            console.error("Error fetching from movies:", error)
            return []
          }
          return (data || []).map((movie: any) => ({
            ...movie,
            id_type: 'imdb',
            unique_id: movie.id, // Use id as imdb_id
            imdb_id: movie.id, // Map id to imdb_id for compatibility
            poster_url: movie.poster_url || movie.backdrop_url // Use backdrop_url as fallback
          }))
        })()
      ])

      // Process and combine results
      const allResults = [...miniResults, ...moviesResults]
        .filter((movie: any) => !!movie.unique_id && !!movie.poster_url)

      const mapped = allResults.map((movie: any) => ({
        ...movie,
        imdb_id: movie.unique_id, // Use unique_id for both tables
        poster_url: movie.poster_url,
      }))

      // Deduplicate based on unique_id
      const uniqueResults = Array.from(
        new Map(mapped.map(movie => [movie.unique_id, movie])).values()
      )

      // Sort by IMDB rating
      const sortedResults = uniqueResults.sort((a, b) => 
        (b.ratings?.imdb || 0) - (a.ratings?.imdb || 0)
      )

      setResults(sortedResults)
      setHasSearched(true)
    } catch (error) {
      console.error("Search error:", error)
      setError("Failed to search movies. Please try again.")
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    await handleSearchWithQuery(query)
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

            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>

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
                    
                    <SelectContent className="max-h-64 overflow-y-auto">
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
                    <SelectContent className="max-h-64 overflow-y-auto">
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
                    <SelectContent className="max-h-64 overflow-y-auto">
                      <SelectItem value="any">Any language</SelectItem>
                      {languages.map((l) => (
                        <SelectItem key={l} value={l}>
                          {languageMap[l] || l}
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
                  {results.map((movie) => {
                    return (
                      <Link key={movie.imdb_id} href={`/members/movie/${movie.imdb_id}`} className="group">
                        <div className="movie-card rounded-lg overflow-hidden bg-card border border-border/50 h-full">
                          <div className="aspect-[2/3] relative">
                            <img
                              src={movie.poster_url || "/placeholder.svg"}
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
                    )
                  })}
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
