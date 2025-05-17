// app/members/page.tsx

import { fetchMoviesFromSupabase } from '@/lib/supabase-movies';
import { NewsPreview } from '@/components/news-preview';
import { HeroSection } from '@/components/hero-section';
import { genres } from '@/lib/movie-data';
import Link from 'next/link';
import { ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getUpcomingMovies } from '@/lib/api/tmdb';
import { MovieSlidersClient } from '@/components/movie-sliders-client';
import { Suspense } from "react";
import { Movie } from "@/lib/movie-data";

function mapTMDBMoviesToMovie(tmdbMovies: any[]): Movie[] {
  return tmdbMovies.map(movie => ({
    id: movie.id.toString(),
    title: movie.title,
    year: parseInt(movie.release_date?.split('-')[0] || '2025'),
    genre: movie.genre_ids?.map((id: number) => {
      // Map TMDB genre IDs to our genre names
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

export default async function MembersPage() {
  // Fetch initial data for all sliders
  const [popularMovies, topRatedMovies, newReleases, comingSoonTMDB] = await Promise.all([
    fetchMoviesFromSupabase({ 
      sortBy: 'ratings->>imdb', 
      minYear: 1990, 
      maxYear: 2025, 
      minImdb: 6, 
      limit: 20 
    }),
    fetchMoviesFromSupabase({ 
      sortBy: 'ratings->>imdb', 
      minYear: 2000, 
      maxYear: 2025, 
      minImdb: 8, 
      limit: 20 
    }),
    fetchMoviesFromSupabase({ 
      sortBy: 'year', 
      minYear: 2025, 
      maxYear: 2025, 
      minImdb: 6, 
      limit: 20 
    }),
    getUpcomingMovies()
  ]);

  const comingSoon = mapTMDBMoviesToMovie(comingSoonTMDB);

  // Fetch initial data for genre sliders
  const genreMoviesPromises = genres.map(genre =>
    fetchMoviesFromSupabase({ 
      genre, 
      minYear: 1990, 
      maxYear: 2025, 
      minImdb: 6, 
      sortBy: 'year', 
      limit: 20 
    })
  );
  const genreMoviesResults = await Promise.all(genreMoviesPromises);
  const genreMovies = Object.fromEntries(
    genres.map((genre, index) => [genre, genreMoviesResults[index]])
  );

  return (
    <div className="pb-20">
      <HeroSection />
      <div className="container">
        <section className="py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Welcome to Movono</h2>
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 w-full sm:w-auto">
                    Browse Genres
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px] max-h-[400px] overflow-y-auto">
                  {genres.map((genre) => (
                    <DropdownMenuItem key={genre} asChild>
                      <Link href={`/members/movies?genre=${genre}`} className="cursor-pointer">
                        {genre}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Link href="/members/search">
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <Search className="h-4 w-4" />
                  Advanced Search
                </Button>
              </Link>
            </div>
          </div>
          <Suspense fallback={<div>Loading movie sliders...</div>}>
            <MovieSlidersClient
              initialMovies={{
                popular: popularMovies,
                topRated: topRatedMovies,
                newReleases: newReleases,
                comingSoon: comingSoon,
                genreMovies: genreMovies
              }}
            />
          </Suspense>
          <NewsPreview />
        </section>
      </div>
    </div>
  );
}