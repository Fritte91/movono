"use client"

import { useEffect, useState } from 'react'
import { MovieSlider } from './movie-slider'
import { fetchMoviesFromSupabaseClient } from '@/lib/supabase-movies'

export function TodayPick() {
  const [movies, setMovies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTodayPick = async () => {
      try {
        setLoading(true)
        
        // Use today's date as seed for consistent daily selection
        const today = new Date()
        const seed = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`
        
        // Fetch movies from database
        const data = await fetchMoviesFromSupabaseClient('popular', { offset: 0 })

        if (data && data.length > 0) {
          // Filter out movies without required data
          const validMovies = data.filter((movie: any) => 
            movie.imdb_id && 
            movie.posterUrl && 
            movie.posterUrl !== "N/A"
          )

          if (validMovies.length === 0) {
            throw new Error('No valid movies found after filtering')
          }

          // Use the seed to shuffle the array consistently for the day
          const shuffled = [...validMovies].sort((a, b) => {
            const hashA = parseInt(seed + a.imdb_id.replace('tt', '')) % 1000
            const hashB = parseInt(seed + b.imdb_id.replace('tt', '')) % 1000
            return hashA - hashB
          })

          // Take the first 20 movies
          const selectedMovies = shuffled.slice(0, 20)
          
          setMovies(selectedMovies)
        } else {
          throw new Error('No movies found')
        }
      } catch (error) {
        setMovies([])
      } finally {
        setLoading(false)
      }
    }

    fetchTodayPick()
  }, [])

  if (loading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (movies.length === 0) {
    return (
      <div className="container py-8">
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <div className="text-4xl mb-4">🎬</div>
          <h3 className="text-lg font-medium mb-2">No Movies Available</h3>
          <p className="text-muted-foreground">Check back later for today's movie picks!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {movies.map((movie) => (
          <a
            key={movie.imdb_id || movie.id}
            href={`/members/movie/${movie.imdb_id || movie.id}`}
            className="group block"
            title={movie.title}
          >
            <div className="aspect-[2/3] overflow-hidden rounded-lg bg-muted">
              <img
                src={movie.posterUrl || movie.posterUrl || '/placeholder.svg'}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="mt-2 text-center">
              <h3 className="font-medium text-sm line-clamp-2">{movie.title}</h3>
              <p className="text-xs text-muted-foreground">{movie.year}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
} 