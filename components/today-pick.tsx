"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Movie } from "@/lib/movie-data"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

interface MovieWithRating extends Movie {
  imdb_rating: number
}

export function TodayPick() {
  const [movies, setMovies] = useState<MovieWithRating[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchTodayPick = async () => {
      try {
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0]
        
        // Use the date as a seed for consistent daily selection
        const seed = today.split('-').join('')
        
        console.log('Fetching movies with seed:', seed)
        
        // Fetch movies with specific columns
        const { data, error: supabaseError } = await supabase
          .from('movies_mini')
          .select('imdb_id, title, year, poster_url, popularity, vote_count, genre, runtime, director, plot, cast, production_countries, spoken_languages')
          .not('popularity', 'is', null)
          .gte('popularity', 10) // Only get popular movies
          .gte('vote_count', 100) // Only get movies with significant votes
          .order('popularity', { ascending: false })
          .limit(100)

        if (supabaseError) {
          console.error('Supabase query error:', supabaseError)
          throw new Error(`Query error: ${supabaseError.message}`)
        }

        console.log('Fetched movies count:', data?.length)

        if (data && data.length > 0) {
          // Filter out movies without required data
          const validMovies = data.filter((movie: any) => 
            movie.imdb_id && 
            movie.poster_url && 
            movie.poster_url !== "N/A"
          )

          console.log('Valid movies count:', validMovies.length)

          if (validMovies.length === 0) {
            throw new Error('No valid movies found after filtering')
          }

          // Use the seed to shuffle the array consistently for the day
          const shuffled = [...validMovies].sort((a, b) => {
            const hashA = parseInt(seed + a.imdb_id.replace('tt', '')) % 1000
            const hashB = parseInt(seed + b.imdb_id.replace('tt', '')) % 1000
            return hashA - hashB
          })

          // Take the first 35 movies
          const selectedMovies = shuffled.slice(0, 35)
          console.log('Selected movies count:', selectedMovies.length)
          
          // Map the movies to include all required Movie properties
          const mappedMovies: MovieWithRating[] = selectedMovies.map(movie => ({
            id: movie.imdb_id,
            title: movie.title,
            year: movie.year,
            poster_url: movie.poster_url,
            genre: movie.genre || [],
            runtime: movie.runtime || 0,
            released: '',
            director: movie.director || '',
            writer: '',
            actors: movie.cast || [],
            plot: movie.plot || '',
            language: movie.spoken_languages || [],
            country: movie.production_countries || [],
            awards: '',
            metascore: 0,
            imdbVotes: 0,
            type: 'movie',
            dvd: '',
            boxOffice: '',
            production: '',
            website: '',
            imdb_id: movie.imdb_id,
            imdb_rating: 0, // Default rating since we don't have it
            ratings: {
              imdb: 0,
              rottenTomatoes: '0',
              metacritic: 0
            }
          }))
          
          setMovies(mappedMovies)
        } else {
          throw new Error('No movies found in the database')
        }
      } catch (error) {
        console.error('Error fetching today\'s pick:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch movies')
      } finally {
        setLoading(false)
      }
    }

    fetchTodayPick()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="aspect-[2/3]">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {movies.map((movie) => (
        <Link
          key={movie.imdb_id}
          href={`/members/movie/${movie.imdb_id}`}
          className="group"
        >
          <div className="movie-card rounded-lg overflow-hidden bg-card border border-border/50 h-full transition-transform duration-300 group-hover:scale-105">
            <div className="aspect-[2/3] relative">
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <div className="text-sm font-medium truncate">{movie.title}</div>
                <div className="text-xs text-gray-400 flex items-center gap-2">
                  <span>{movie.year}</span>
                  {movie.genre && movie.genre.length > 0 && (
                    <>
                      <span>•</span>
                      <span>{movie.genre[0]}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
} 