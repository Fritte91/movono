// app/members/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { fetchMoviesFromSupabase } from '@/lib/supabase-movies'
import { NewsPreview } from '@/components/news-preview'
import { HeroSection } from '@/components/hero-section'
import { genres } from '@/lib/movie-data'
import Link from 'next/link'
import { ChevronDown, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { getUpcomingMovies } from '@/lib/api/tmdb'
import { MovieSlidersClient } from '@/components/movie-sliders-client'
import { Suspense } from "react"
import { Movie } from "@/lib/movie-data"
import { supabase } from '@/lib/supabase-client'
import { getMoviesByCategory, fetchMoviesWithFilters } from '@/lib/filters/movieFilters'
import { TMDB_GENRES } from '@/lib/api/tmdb'
import { YtsLatestMoviesSlider } from '@/components/yts-latest-movies-slider'

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
  const [movies, setMovies] = useState<{
    popular: Movie[];
    topRated: Movie[];
    newReleases: Movie[];
    comingSoon: Movie[];
    genreMovies: Record<string, Movie[]>;
  }>({
    popular: [],
    topRated: [],
    newReleases: [],
    comingSoon: [],
    genreMovies: {}
  })
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log('Members page: Starting session check...')
        
        // First check if we have any cookies
        console.log('Members page: Checking cookies...')
        const cookies = document.cookie
        console.log('Current cookies:', cookies)
        
        const { data: { session }, error } = await supabase.auth.getSession()
        
        console.log('Members page: Session check result:', { session, error })
        
        if (error) {
          console.error('Members page: Session check error:', error)
          throw error
        }

        if (!session) {
          console.log('Members page: No session found, redirecting to login')
          router.push('/login')
          return
        }

        console.log('Members page: Session found, user:', session.user)
        setUser(session.user)
      } catch (error) {
        console.error('Members page: Error checking auth:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [router])

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [popular, topRated, newReleases, comingSoon] = await Promise.all([
          getMoviesByCategory('popular'),
          getMoviesByCategory('top_rated'),
          getMoviesByCategory('new_releases'),
          getMoviesByCategory('coming_soon')
        ]);

        // Create an array of possible sort options with correct types
        const sortOptions = [
          { sortBy: 'popularity' as const, sortOrder: 'desc' as const },
          { sortBy: 'ratings->>imdb' as const, sortOrder: 'desc' as const },
          { sortBy: 'year' as const, sortOrder: 'desc' as const },
          { sortBy: 'vote_count' as const, sortOrder: 'desc' as const }
        ];

        const genreMoviesPromises = mainGenres.map(genre => {
          // Get a random sort option
          const randomSort = sortOptions[Math.floor(Math.random() * sortOptions.length)];
          
          // Generate a random offset between 0 and 200 for more variety
          const randomOffset = Math.floor(Math.random() * 200);
          
          // Randomly adjust the year range to get more variety
          const currentYear = new Date().getFullYear();
          const randomYearRange = Math.floor(Math.random() * 3); // 0, 1, or 2
          const minYear = currentYear - (20 + randomYearRange * 10); // 20, 30, or 40 years back
          
          return fetchMoviesWithFilters({ 
            genre,
            minYear,
            maxYear: currentYear,
            minImdb: 5.0,
            minVoteCount: 50,
            minPopularity: 5,
            ...randomSort,
            limit: 20,
            offset: randomOffset
          });
        });
        
        const genreMoviesResults = await Promise.all(genreMoviesPromises);
        const genreMovies = Object.fromEntries(
          mainGenres.map((genre, index) => [genre, genreMoviesResults[index].movies])
        );

        setMovies({
          popular,
          topRated,
          newReleases,
          comingSoon,
          genreMovies
        });
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

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
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Welcome, {user?.user_metadata?.username}</h1>
      </div>

      <HeroSection />

      <Suspense fallback={<div>Loading movies...</div>}>
        <MovieSlidersClient
          initialMovies={{
            popular: movies.popular,
            topRated: movies.topRated,
            newReleases: movies.newReleases,
            comingSoon: movies.comingSoon,
            genreMovies: movies.genreMovies
          }}
        />
      </Suspense>

      <div className="container mx-auto px-4">
        <Suspense fallback={<div>Loading latest Download movies...</div>}>
          <YtsLatestMoviesSlider /> 
        </Suspense>
        <NewsPreview />
      </div>
    </div>
  )
}