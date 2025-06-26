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
            movie.poster_url && 
            movie.poster_url !== "N/A"
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

          // Take the first 35 movies
          const selectedMovies = shuffled.slice(0, 35)
          
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Today's Pick</h2>
            <p className="text-muted-foreground">Handpicked movies for you today</p>
          </div>
        </div>
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Today's Pick</h2>
            <p className="text-muted-foreground">Handpicked movies for you today</p>
          </div>
        </div>
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Today's Pick</h2>
          <p className="text-muted-foreground">Handpicked movies for you today</p>
        </div>
      </div>
      <MovieSlider 
        title="Today's Pick" 
        movies={movies} 
      />
    </div>
  )
} 