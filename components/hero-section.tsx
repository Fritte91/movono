"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabase-client';
import { Skeleton } from "@/components/ui/skeleton";

interface FeaturedMovie {
  id: string;
  title: string;
  plot: string;
  genre: string[];
  backdrop_url: string;
  imdb_id: string;
}

const FALLBACK_MOVIE: FeaturedMovie = {
  id: 'fallback',
  title: 'Welcome to Movono!',
  plot: 'Discover and track your favorite movies. Enjoy a fast, beautiful experience.',
  genre: ['Featured'],
  backdrop_url: '/cinema1.jpg',
  imdb_id: 'fallback',
};

function isFeaturedMovie(movie: any): movie is FeaturedMovie {
  return (
    movie &&
    typeof movie === 'object' &&
    typeof movie.id === 'string' &&
    typeof movie.title === 'string' &&
    typeof movie.plot === 'string' &&
    Array.isArray(movie.genre) &&
    typeof movie.backdrop_url === 'string' &&
    typeof movie.imdb_id === 'string'
  );
}

export function HeroSection() {
  const [selectedMovie, setSelectedMovie] = useState<FeaturedMovie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchFeaturedMovie() {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('movies_mini')
          .select(`id, title, imdb_id, plot, genre, backdrop_url, poster_url, year, ratings, director, cast, popularity, vote_count, runtime, original_language, certification, youtube_trailer_url`)
          .not('backdrop_url', 'is', null)
          .not('backdrop_url', 'eq', '')
          .limit(20);
        if (error) throw error;
        console.log('HeroSection Supabase data:', data);
        const safeData = data as unknown;
        if (
          Array.isArray(safeData) &&
          safeData.length > 0 &&
          safeData.every(movie => typeof movie === 'object' && movie !== null && typeof movie.backdrop_url === 'string' && movie.backdrop_url.trim() !== '')
        ) {
          const validMovies = safeData.filter(m => m.backdrop_url && m.backdrop_url.trim() !== '');
          if (validMovies.length > 0) {
            const movie = validMovies[Math.floor(Math.random() * validMovies.length)];
            setSelectedMovie({
              id: movie.id,
              title: movie.title,
              plot: movie.plot,
              genre: Array.isArray(movie.genre) ? movie.genre : (typeof movie.genre === 'string' ? [movie.genre] : []),
              backdrop_url: movie.backdrop_url,
              imdb_id: movie.imdb_id,
            });
          } else {
            console.warn('No movies with a valid backdrop_url found in Supabase.');
            setSelectedMovie(null);
            setError('No featured movie with a backdrop image found.');
          }
        } else {
          console.warn('No valid movies found in Supabase.');
          setSelectedMovie(null);
          setError('No featured movie with a backdrop image found.');
        }
      } catch (err: any) {
        console.error('Hero fetch error:', err);
        setError('Could not load featured movie.');
        setSelectedMovie(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchFeaturedMovie();
    return () => { isMounted = false; };
  }, []);

  if (isLoading) {
    return <section className="relative h-[60vh] flex items-center pt-0 mt-0"><div className="container relative z-20"><Skeleton className="h-64 w-full" /></div></section>;
  }

  if (!selectedMovie) {
    return <section className="relative h-[60vh] flex items-center pt-0 mt-0"><div className="container relative z-20"><div className="text-white text-xl">No featured movie available.</div></div></section>;
  }

  return (
    <section className="relative h-[60vh] flex items-center pt-0 mt-0">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-90 z-10 hero-gradient"></div>
        <Image
          src={selectedMovie.backdrop_url}
          alt={`${selectedMovie.title} background`}
          fill
          style={{ objectFit: "cover" }}
          priority
          quality={75}
          sizes="100vw"
          placeholder="blur"
          blurDataURL="/cinema1.jpg"
        />
      </div>
      <div className="container relative z-20">
        <div className="max-w-2xl space-y-4">
          <span className="inline-block px-2 py-1 bg-primary/20 text-primary text-sm font-medium rounded-md">
            Featured
          </span>
          <h1 className="text-4xl font-bold">{selectedMovie.title}</h1>
          <p className="text-gray-300 line-clamp-3">{selectedMovie.plot}</p>
          <div className="flex flex-wrap gap-3">
            {selectedMovie.genre.slice(0, 3).map((genre) => (
              <span key={genre} className="px-2 py-1 bg-secondary text-xs rounded-full">
                {genre}
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href={selectedMovie.imdb_id !== 'fallback' ? `/members/movie/${selectedMovie.imdb_id}` : "#"}>
              <Button size="lg" className="group w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5 transition-transform group-hover:scale-125"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                </svg>
                Watch Trailer
              </Button>
            </Link>
            <Link href={selectedMovie.imdb_id !== 'fallback' ? `/members/movie/${selectedMovie.imdb_id}` : "#"}>
              <Button size="lg" variant="outline" className="w-full">View Details</Button>
            </Link>
          </div>
          {error && <div className="text-red-400 text-sm pt-2">{error}</div>}
        </div>
      </div>
    </section>
  );
} 