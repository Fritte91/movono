// app/members/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MovieSlider } from "@/components/movie-slider";
import { NewsPreview } from "@/components/news-preview";
import { HeroSection } from "@/components/hero-section"; // New import
import { genres } from "@/lib/movie-data";
import { upcomingMovies } from "@/lib/upcoming-movies-data";
import { getMoviesByTitle } from "@/lib/api/getMoviesByTitle";
import {
  popularTitles,
  topRatedTitles,
  newReleasesTitles,
  allMovieTitles,
  upcomingTitles,
} from "@/lib/movie-data";

export default function MembersPage() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [newReleases, setNewReleases] = useState<Movie[]>([]);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("upcomingTitles: ", upcomingTitles);
        const [popular, top, newR, all, upcoming] = await Promise.all([
          getMoviesByTitle(popularTitles),
          getMoviesByTitle(topRatedTitles),
          getMoviesByTitle(newReleasesTitles),
          getMoviesByTitle(allMovieTitles),
          getMoviesByTitle(upcomingTitles),
        ]);

        setPopularMovies(popular);
        setTopRated(top);
        setNewReleases(newR);
        setAllMovies(all);
        setUpcoming(upcoming);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="pb-20">
      {/* Hero section replaced with HeroSection component */}
      <HeroSection />

      {/* Sliders and menus */}
      <div className="container">
        <section className="py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Welcome to Movono</h2>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
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
                <Button variant="outline" className="gap-2">
                  <Search className="h-4 w-4" />
                  Advanced Search
                </Button>
              </Link>
            </div>
          </div>

          {/* Movie sliders */}
          <div className="space-y-12">
            <MovieSlider title="Popular Movies" movies={popularMovies} />
            <MovieSlider title="Coming Soon" movies={upcoming} />
            <MovieSlider title="New Releases" movies={newReleases} />
            <NewsPreview />
            <MovieSlider title="Top Rated" movies={topRated} />

            {/* Genre-based filtering */}
            {["Action", "Adventure", "Sci-Fi", "Drama", "Crime", "Thriller"].map((genre) => (
              <MovieSlider
                key={genre}
                title={genre}
                movies={allMovies.filter((movie) => movie?.Genre?.includes(genre)).slice(0, 10)}
              />
            ))}

            <MovieSlider title="Your Favorites" movies={popularMovies.slice(0, 5)} />
          </div>
        </section>
      </div>
    </div>
  );
}