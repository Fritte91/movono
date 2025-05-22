"use client";
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Movie } from "@/lib/movie-data"

interface MovieSliderProps {
  title: string  // "Popular", "Top Rated", etc.
  movies: Movie[] | undefined // Explicitly handling undefined case
  onRefresh?: () => Promise<Movie[]> // Update return type to Promise<Movie[]>
}

export function MovieSlider({ title, movies, onRefresh }: MovieSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleItems, setVisibleItems] = useState(5)
  const containerRef = useRef<HTMLDivElement>(null)
  const isSmallScreen = useMediaQuery("(max-width: 640px)")
  const isMediumScreen = useMediaQuery("(max-width: 1024px)")
  const lastRefreshRef = useRef<number>(Date.now())
  const [currentMovies, setCurrentMovies] = useState<Movie[] | undefined>(movies)
  const [lastRefreshTime, setLastRefreshTime] = useState<string>('')

  useEffect(() => {
    setCurrentMovies(movies)
  }, [movies])

  useEffect(() => {
    if (isSmallScreen) {
      setVisibleItems(2)
    } else if (isMediumScreen) {
      setVisibleItems(3)
    } else {
      setVisibleItems(5)
    }
  }, [isSmallScreen, isMediumScreen])

  useEffect(() => {
    // Set up periodic refresh - using 30 seconds for testing
    const REFRESH_INTERVAL = 30 * 1000; // 30 seconds in milliseconds

    const checkAndRefresh = async () => {
      const now = Date.now();
      if (now - lastRefreshRef.current >= REFRESH_INTERVAL) {
        if (onRefresh) {
          console.log(`[${title}] Starting refresh...`);
          try {
            const newMovies = await onRefresh();
            console.log(`[${title}] Received ${newMovies.length} new movies`);
            setCurrentMovies(newMovies);
            lastRefreshRef.current = now;
            setLastRefreshTime(new Date().toLocaleTimeString());
          } catch (error) {
            console.error(`[${title}] Error refreshing movies:`, error);
          }
        }
      }
    };

    const intervalId = setInterval(checkAndRefresh, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId);
  }, [onRefresh, title]);

  useEffect(() => {
    // Ensuring movies is never undefined when passed into the component
    if (!movies) {
      console.log("Movies data not yet loaded!");
      return;
    }
  }, [movies]);

  const nextSlide = () => {
    if (!currentMovies || currentMovies.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex + visibleItems >= currentMovies.length ? 0 : prevIndex + 1
    )
  }

  const prevSlide = () => {
    if (!currentMovies || currentMovies.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(0, currentMovies.length - visibleItems) : prevIndex - 1
    )
  }

  const displayMovies = currentMovies || movies;

  // Log the final src URL being used by the img tag for the first movie
  if (displayMovies && displayMovies.length > 0) {
    const firstMovie = displayMovies[0];
    const imgSrc = firstMovie.poster_url && firstMovie.poster_url !== "N/A" ? firstMovie.poster_url : "/placeholder.svg";
    console.log(`[${title}] First movie title:`, firstMovie.title);
    console.log(`[${title}] First movie poster_url:`, firstMovie.poster_url);
    console.log(`[${title}] Final image src for first movie:`, imgSrc);
  }

  // Filter out movies without imdb_id and log them
  const safeMovies = (currentMovies || []).filter(m => {
    if (!m.imdb_id) {
      console.error('MISSING imdb_id:', m);
      return false;
    }
    return true;
  });

  if (!currentMovies || currentMovies.length === 0) {
    return <div>Loading movies...</div>;
  }

  // Calculate the current page and total pages
  const currentPage = Math.floor(currentIndex / visibleItems) + 1;
  const totalPages = Math.ceil(currentMovies.length / visibleItems);

  return (
    <div className="slider-container">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">{title} Movies</h2>
          <p className="text-sm text-gray-500">
            Showing {currentIndex + 1}-{Math.min(currentIndex + visibleItems, currentMovies.length)} of {currentMovies.length} movies
          </p>
          {lastRefreshTime && (
            <p className="text-sm text-gray-500">Last refreshed: {lastRefreshTime}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prevSlide} 
              className="rounded-full"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextSlide} 
              className="rounded-full"
              disabled={currentIndex + visibleItems >= currentMovies.length}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex transition-transform duration-500 ease-out"
        style={{
          transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
        }}
      >
        {safeMovies.map((movie) => {
          console.log('Slider movie:', movie);
          const imgSrc = movie.poster_url && movie.poster_url !== "N/A" ? movie.poster_url : "/placeholder.svg";
          return (
            <div
              key={movie.imdb_id}
              className="flex-none p-2"
              style={{ width: `${100 / visibleItems}%` }}
            >
              <Link href={`/members/movie/${movie.imdb_id}`}>
                <div className="movie-card rounded-lg overflow-hidden bg-card border border-border/50 h-full">
                  <div className="aspect-[2/3] relative">
                    <img
                      src={imgSrc}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <div className="text-sm font-medium truncate">{movie.title}</div>
                      <div className="text-xs text-gray-400">{movie.year}</div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  )
}
