"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useMediaQuery } from "@/hooks/use-media-query"

interface Movie {
  id: string
  title: string
  posterUrl: string
  year: number
}

interface MovieSliderProps {
  title: string
  movies: Movie[]
}

export function MovieSlider({ title, movies }: MovieSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleItems, setVisibleItems] = useState(5)
  const containerRef = useRef<HTMLDivElement>(null)
  const isSmallScreen = useMediaQuery("(max-width: 640px)")
  const isMediumScreen = useMediaQuery("(max-width: 1024px)")

  useEffect(() => {
    if (isSmallScreen) {
      setVisibleItems(2)
    } else if (isMediumScreen) {
      setVisibleItems(3)
    } else {
      setVisibleItems(5)
    }
  }, [isSmallScreen, isMediumScreen])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + visibleItems >= movies.length ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? Math.max(0, movies.length - visibleItems) : prevIndex - 1))
  }

  return (
    <div className="slider-container">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prevSlide} className="rounded-full">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button variant="outline" size="icon" onClick={nextSlide} className="rounded-full">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          ref={containerRef}
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
          }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-none w-1/2 sm:w-1/3 lg:w-1/5 p-2"
              style={{ width: `${100 / visibleItems}%` }}
            >
              <Link href={`/members/movie/${movie.id}`}>
                <div className="movie-card rounded-lg overflow-hidden bg-card border border-border/50 h-full">
                  <div className="aspect-[2/3] relative">
                    <img
                      src={movie.posterUrl || "/placeholder.svg"}
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
          ))}
        </div>
      </div>
    </div>
  )
}
