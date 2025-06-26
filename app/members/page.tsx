// app/members/page.tsx

'use client'

import { useEffect, useState, lazy, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { fetchMoviesFromSupabase } from '@/lib/supabase-movies'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { genres } from '@/lib/movie-data'
import Link from 'next/link'
import { ChevronDown, Search } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { getUpcomingMovies } from '@/lib/api/tmdb'
import { Movie } from "@/lib/movie-data"
import { supabase } from '@/lib/supabase-client'
import { getMoviesByCategory, fetchMoviesWithFilters } from '@/lib/filters/movieFilters'
import { TMDB_GENRES } from '@/lib/api/tmdb'

// Lazy load heavy components
const NewsPreview = lazy(() => import('@/components/news-preview').then(mod => ({ default: mod.NewsPreview })))
const HeroSection = lazy(() => import('@/components/hero-section').then(mod => ({ default: mod.HeroSection })))
const MovieSlidersClient = lazy(() => import('@/components/movie-sliders-client').then(mod => ({ default: mod.MovieSlidersClient })))
const YtsLatestMoviesSlider = lazy(() => import('@/components/yts-latest-movies-slider').then(mod => ({ default: mod.YtsLatestMoviesSlider })))

// Optimized loading skeleton
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
      <p className="text-muted-foreground">Loading your movie experience...</p>
    </div>
  </div>
)

// Optimized movie sliders skeleton
const MovieSlidersSkeleton = () => (
  <div className="container py-8 space-y-8">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((j) => (
            <div key={j} className="space-y-2">
              <Skeleton className="aspect-[2/3] w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)

function mapTMDBMoviesToMovie(tmdbMovies: any[]): Movie[] {
  return tmdbMovies.map(movie => ({
    id: movie.id.toString(),
    title: movie.title,
    year: new Date(movie.release_date).getFullYear(),
    genre: movie.genre_ids.map((id: number) => TMDB_GENRES[id]).filter(Boolean),
    posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg',
    poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg',
    director: '',
    cast: [],
    actors: [],
    writer: '',
    plot: movie.overview || '',
    runtime: 0,
    released: movie.release_date,
    ratings: {
      imdb: movie.vote_average || 0,
      rottenTomatoes: '0',
      metacritic: 0
    },
    language: [movie.original_language || 'en'],
    country: [],
    youtubeTrailerUrl: null,
    torrents: [],
    certification: '',
    production_companies: [],
    production_countries: [],
    spoken_languages: [movie.original_language || 'en'],
    awards: '',
    metascore: 0,
    imdbVotes: 0,
    type: 'movie',
    dvd: '',
    boxOffice: '',
    website: '',
    response: true,
    production: ''
  }));
}

// Update the genres array to include only the most popular ones
const mainGenres = [
  "Action",
  "Drama",
  "Comedy",
  "Thriller",
  "Sci-Fi",
  "Horror"
];

export default function Members() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  // Hydration safety
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          throw error
        }

        if (!session) {
          router.push('/login')
          return
        }

        setUser(session.user)
      } catch (error) {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [router])

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  if (!isClient) {
    return <LoadingSkeleton />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        {/* No container or extra spacing here, header is just a border */}
      </header>
      
      {/* Hero Section with lazy loading */}
      <Suspense fallback={<div className="h-[60vh] flex items-center justify-center"><LoadingSkeleton /></div>}>
        <HeroSection />
      </Suspense>

      {/* Main Content */}
      <main>
        {/* Movie Sliders with lazy loading */}
        <Suspense fallback={<MovieSlidersSkeleton />}>
          <MovieSlidersClient />
        </Suspense>

        {/* YTS Latest Movies with lazy loading */}
        <Suspense fallback={<div className="container py-8"><Skeleton className="h-64 w-full" /></div>}>
          <YtsLatestMoviesSlider />
        </Suspense>

        {/* News Section with lazy loading */}
        <Suspense fallback={<div className="container py-8"><Skeleton className="h-96 w-full" /></div>}>
          <NewsPreview />
        </Suspense>
      </main>
    </div>
  )
}