// components/hero-section.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FeaturedMovie, featuredMovies } from "@/lib/featured-movies";

export function HeroSection() {
  const [selectedMovie, setSelectedMovie] = useState<FeaturedMovie | null>(null);

  useEffect(() => {
    const randomMovie = featuredMovies[Math.floor(Math.random() * featuredMovies.length)];
    setSelectedMovie(randomMovie);
  }, []);

  if (!selectedMovie) {
    return <div className="h-[50vh] flex items-center justify-center">Loading...</div>;
  }

  return (
    <section className="relative h-[50vh] flex items-center">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-90 z-10 hero-gradient"></div>
        <Image
          src={selectedMovie.backgroundImage}
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
          <p className="text-gray-300">{selectedMovie.description}</p>
          <div className="flex flex-wrap gap-3">
            {selectedMovie.genres.map((genre) => (
              <span key={genre} className="px-2 py-1 bg-secondary text-xs rounded-full">
                {genre}
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href={`/members/movie/${selectedMovie.imdbId}`}>
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
            <Link href={`/members/movie/${selectedMovie.imdbId}`}>
              <Button size="lg" variant="outline" className="w-full">View Details</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}