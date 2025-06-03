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
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragDistance, setDragDistance] = useState(0)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [startTranslateX, setStartTranslateX] = useState(0)
  const [hasMoved, setHasMoved] = useState(false)
  const dragStartTime = useRef<number>(0)

  const minSwipeDistance = 50
  const maxClickDuration = 200 // Maximum time in ms to consider it a click

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
          
          try {
            const newMovies = await onRefresh();
            
            setCurrentMovies(newMovies);
            lastRefreshRef.current = now;
            setLastRefreshTime(new Date().toLocaleTimeString());
          } catch (error) {
            
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

  const handleDragStart = (clientX: number) => {
    setTouchStart(clientX)
    setTouchEnd(clientX)
    setIsDragging(true)
    setDragStartX(clientX)
    setStartTranslateX(currentIndex * (100 / visibleItems))
    setHasMoved(false)
    dragStartTime.current = Date.now()
  }

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return
    
    setTouchEnd(clientX)
    const distance = clientX - dragStartX
    // Convert pixel distance to percentage based on container width
    const containerWidth = containerRef.current?.offsetWidth || 0
    const percentageDistance = (distance / containerWidth) * 100
    setDragDistance(percentageDistance)
    
    // If we've moved more than 5 pixels, consider it a drag
    if (Math.abs(distance) > 5) {
      setHasMoved(true)
    }
  }

  const handleDragEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const containerWidth = containerRef.current?.offsetWidth || 0
    const percentageDistance = Math.abs((distance / containerWidth) * 100)
    
    // Calculate how many items to move based on the drag distance
    const itemsToMove = Math.round(percentageDistance / (100 / visibleItems))
    
    if (distance > minSwipeDistance) {
      // Moving right (next)
      setCurrentIndex(prev => 
        Math.min(prev + itemsToMove, currentMovies?.length ? currentMovies.length - visibleItems : 0)
      )
    } else if (distance < -minSwipeDistance) {
      // Moving left (previous)
      setCurrentIndex(prev => Math.max(prev - itemsToMove, 0))
    }

    // Reset states
    setTouchStart(null)
    setTouchEnd(null)
    setIsDragging(false)
    setDragDistance(0)
    setIsMouseDown(false)
  }

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    handleDragEnd()
  }

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsMouseDown(true)
    handleDragStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMouseDown) {
      handleDragMove(e.clientX)
    }
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isMouseDown) {
      e.preventDefault()
      handleDragEnd()
    }
  }

  const handleMouseLeave = () => {
    if (isMouseDown) {
      handleDragEnd()
    }
  }

  // Prevent click events during drag
  const handleClick = (e: React.MouseEvent) => {
    const dragDuration = Date.now() - dragStartTime.current
    if (isDragging || hasMoved || dragDuration > maxClickDuration) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

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
        className="flex transition-transform duration-300 ease-out cursor-grab active:cursor-grabbing select-none"
        style={{
          transform: `translateX(calc(-${currentIndex * (100 / visibleItems)}% + ${dragDistance}%))`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {safeMovies.map((movie) => {
          const imgSrc = movie.poster_url && movie.poster_url !== "N/A" ? movie.poster_url : "/placeholder.svg";
          return (
            <div
              key={movie.imdb_id}
              className="flex-none p-2"
              style={{ width: `${100 / visibleItems}%` }}
            >
              <Link 
                href={`/members/movie/${movie.imdb_id}`}
                onClick={(e) => {
                  const dragDuration = Date.now() - dragStartTime.current
                  if (isDragging || hasMoved || dragDuration > maxClickDuration) {
                    e.preventDefault()
                  }
                }}
              >
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
