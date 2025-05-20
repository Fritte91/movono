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

function mapTMDBMoviesToMovie(tmdbMovies: any[]): Movie[] {
  return tmdbMovies.map(movie => ({
    id: movie.id.toString(),
    title: movie.title,
    year: parseInt(movie.release_date?.split('-')[0] || '2025'),
    genre: movie.genre_ids?.map((id: number) => {
      const genreMap: Record<number, string> = {
        28: "Action",
        12: "Adventure",
        16: "Animation",
        35: "Comedy",
        80: "Crime",
        99: "Documentary",
        18: "Drama",
        10751: "Family",
        14: "Fantasy",
        36: "History",
        27: "Horror",
        10402: "Music",
        9648: "Mystery",
        10749: "Romance",
        878: "Sci-Fi",
        53: "Thriller",
        10752: "War",
        37: "Western"
      };
      return genreMap[id] || "Drama";
    }) || ["Drama"],
    posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg'
  }));
}

export default function Members() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [movies, setMovies] = useState<any>({
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
        const [popular, topRated, newReleases, comingSoonTMDB] = await Promise.all([
          fetchMoviesFromSupabase({ 
            sortBy: 'popularity', 
            minYear: 1990, 
            maxYear: 2025, 
            minImdb: 5.5,
            minVoteCount: 100,
            minPopularity: 10,
            limit: 20 
          }),
          fetchMoviesFromSupabase({ 
            sortBy: 'vote_average', 
            minYear: 2000, 
            maxYear: 2025, 
            minImdb: 7,
            minVoteCount: 500,
            minPopularity: 20,
            limit: 20 
          }),
          fetchMoviesFromSupabase({ 
            sortBy: 'popularity', 
            minYear: 2024, 
            maxYear: 2024, 
            minImdb: 5,
            minVoteCount: 50,
            limit: 20 
          }),
          getUpcomingMovies()
        ]);

        const comingSoon = mapTMDBMoviesToMovie(comingSoonTMDB);

        const genreMoviesPromises = genres.map(genre =>
          fetchMoviesFromSupabase({ 
            genre, 
            minYear: 1990, 
            maxYear: 2025, 
            minImdb: 5.5,
            minVoteCount: 100,
            minPopularity: 5,
            sortBy: 'popularity', 
            limit: 20 
          })
        );
        const genreMoviesResults = await Promise.all(genreMoviesPromises);
        const genreMovies = Object.fromEntries(
          genres.map((genre, index) => [genre, genreMoviesResults[index]])
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
    </div>
  )
}