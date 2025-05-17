// app/members/page.tsx

import { fetchMoviesFromSupabase } from '@/lib/supabase-movies';
import { MovieSlider as MovieSliderBase } from '@/components/movie-slider';
import { NewsPreview } from '@/components/news-preview';
import { HeroSection } from '@/components/hero-section';
import { genres } from '@/lib/movie-data';
import Link from 'next/link';
import { ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getUpcomingMovies } from '@/lib/api/tmdb';
import { GenreSlidersLazy } from '@/components/genre-sliders-lazy';

function mapMovies(movies: any[] = [], label = '') {
  const mapped = movies.map((movie) => ({
    ...movie,
    posterUrl: movie.poster_url || movie.posterUrl || '/placeholder.svg',
  }));
  console.log(`Slider [${label}] received ${mapped.length} movies`);
  return mapped;
}

const genreList = [
  "Action", "Adventure", "Sci-Fi", "Drama", "Crime", "Thriller",
  "Comedy", "Horror", "Animation", "Family", "Romance", "Mystery", "Fantasy", "Documentary", "Biography"
];

export default async function MembersPage() {
  // Updated filters for New Releases and Top Rated
  const [popularMoviesRaw, topRatedRaw, newReleasesRaw, ...genreSlidersRaw] = await Promise.all([
    fetchMoviesFromSupabase({ sortBy: 'ratings->>imdb', minYear: 1990, maxYear: 2025, minImdb: 6, limit: 20 }),
    fetchMoviesFromSupabase({ sortBy: 'ratings->>imdb', minYear: 2000, maxYear: 2025, minImdb: 8, limit: 20 }),
    fetchMoviesFromSupabase({ sortBy: 'year', minYear: 2025, maxYear: 2025, minImdb: 6, limit: 20 }),
    ...genreList.map((genre) =>
      fetchMoviesFromSupabase({ genre, minYear: 1990, maxYear: 2025, minImdb: 6, sortBy: 'year', limit: 20 })
    ),
  ]);

  const popularMovies = mapMovies(popularMoviesRaw, 'Popular');
  const topRated = mapMovies(topRatedRaw, 'Top Rated');
  const newReleases = mapMovies(newReleasesRaw, 'New Releases');
  const genreSliders = genreSlidersRaw.map((arr, idx) => mapMovies(arr, genreList[idx]));

  // Coming Soon slider: fetch from TMDB
  const upcoming = mapMovies(await getUpcomingMovies(), 'Coming Soon');

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
          <div className="space-y-12">
            <MovieSliderBase title="Popular Movies" movies={popularMovies} />
            <MovieSliderBase title="Coming Soon" movies={upcoming} />
            <MovieSliderBase title="New Releases" movies={newReleases} />
            <NewsPreview />
            <MovieSliderBase title="Top Rated" movies={topRated} />
            <GenreSlidersLazy genreList={genreList} genreSliders={genreSliders} />
          </div>
        </section>
      </div>
    </div>
  );
}