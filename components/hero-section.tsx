// components/hero-section.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from '@supabase/supabase-js';

interface FeaturedMovie {
  id: string;
  title: string;
  plot: string;
  genre: string[];
  backdrop_url: string;
  imdb_id: string;
}

interface StoredMovie {
  movie: FeaturedMovie;
  timestamp: number;
}

export function HeroSection() {
  const [selectedMovie, setSelectedMovie] = useState<FeaturedMovie | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchFeaturedMovie() {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      try {
        // Check if we have a stored movie that's still valid (less than 30 minutes old)
        const storedMovieData = localStorage.getItem('featuredMovie');
        if (storedMovieData) {
          const { movie, timestamp }: StoredMovie = JSON.parse(storedMovieData);
          const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
          
          if (timestamp > thirtyMinutesAgo) {
            if (isMounted) {
              setSelectedMovie(movie);
              setIsLoading(false);
            }
            return;
          }
        }

        // Get a random movie from movies_mini that has a backdrop_url
        const { data, error } = await supabase
          .from('movies_mini')
          .select('id, title, plot, genre, backdrop_url, imdb_id')
          .not('backdrop_url', 'is', null)
          .order('ratings->>imdb', { ascending: false })
          .limit(20);

        if (error) {
          console.error('Error fetching featured movie:', error);
          return;
        }

        if (data && data.length > 0 && isMounted) {
          // Select a random movie from the top 20
          const randomIndex = Math.floor(Math.random() * data.length);
          const newMovie = data[randomIndex];
          
          // Store the new movie and current timestamp
          const movieData: StoredMovie = {
            movie: newMovie,
            timestamp: Date.now()
          };
          localStorage.setItem('featuredMovie', JSON.stringify(movieData));
          
          setSelectedMovie(newMovie);
        }
      } catch (error) {
        console.error('Error in fetchFeaturedMovie:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchFeaturedMovie();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array since we're using localStorage

  if (isLoading) {
    return <div className="h-[50vh] flex items-center justify-center">Loading...</div>;
  }

  if (!selectedMovie) {
    return <div className="h-[50vh] flex items-center justify-center">No featured movie available</div>;
  }

  return (
    <section className="relative h-[80vh] flex items-center">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-90 z-10 hero-gradient"></div>
        <Image
          src={selectedMovie.backdrop_url}
          alt={`${selectedMovie.title} background`}
          fill
          style={{ objectFit: "cover" }}
          priority
          quality={85}
        />
      </div>

      <div className="container relative z-20">
        <div className="max-w-2xl space-y-4">
          <span className="inline-block px-2 py-1 bg-primary/20 text-primary text-sm font-medium rounded-md">
            Featured
          </span>
          <h1 className="text-4xl font-bold">{selectedMovie.title}</h1>
          <p className="text-gray-300">{selectedMovie.plot}</p>
          <div className="flex flex-wrap gap-3">
            {selectedMovie.genre.map((genre) => (
              <span key={genre} className="px-2 py-1 bg-secondary text-xs rounded-full">
                {genre}
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href={`/members/movie/${selectedMovie.imdb_id}`}>
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
            <Link href={`/members/movie/${selectedMovie.imdb_id}`}>
              <Button size="lg" variant="outline" className="w-full">View Details</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}