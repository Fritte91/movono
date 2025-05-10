"use client"

import { useState, useEffect } from "react"
import { getMovieById, getSimilarMovies, type Movie } from "@/lib/movie-data"
import { RatingStars } from "@/components/rating-stars"
import { Button } from "@/components/ui/button"
import { MovieSlider } from "@/components/movie-slider"
import { Clock, Calendar, Globe, Download, Share2, Subtitles } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

// Import the TrailerPlayer and MovieComments components
import { TrailerPlayer } from "@/components/trailer-player"
import { MovieComments } from "@/components/movie-comments"
import { AchievementToast } from "@/components/achievement-toast"
import type { Achievement } from "@/lib/achievements-data"

export default function MoviePage({ params }: { params: { id: string } }) {
  const [movie, setMovie] = useState<Movie | null>(null)
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([])
  const [userRating, setUserRating] = useState<number>(0)
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null)
  const [downloadCount, setDownloadCount] = useState<number>(7) // Simulated download count
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchedMovie = getMovieById(params.id)
    if (fetchedMovie) {
      setMovie(fetchedMovie)
      setUserRating(fetchedMovie.userRating || 0)
      setSimilarMovies(getSimilarMovies(params.id))
    } else {
      router.push("/members")
    }
  }, [params.id, router])

  const handleRatingChange = (rating: number) => {
    setUserRating(rating)

    toast({
      title: "Rating saved",
      description: `You rated ${movie?.title} ${rating} stars.`,
    })

    // Update local movie data with user rating
    if (movie) {
      setMovie({
        ...movie,
        userRating: rating,
      })
    }
  }

  const handleDownload = () => {
    // Increment download count
    const newCount = downloadCount + 1
    setDownloadCount(newCount)

    toast({
      title: "Download started",
      description: "Your torrent file is being prepared for download.",
    })

    // Check for achievements
    if (newCount === 1) {
      setUnlockedAchievement({
        id: "download-1",
        name: "First Download",
        description: "Downloaded your first movie",
        icon: "download",
        unlockedAt: new Date(),
      })
    } else if (newCount === 10) {
      setUnlockedAchievement({
        id: "download-10",
        name: "Movie Enthusiast",
        description: "Downloaded 10 movies",
        icon: "film",
        unlockedAt: new Date(),
      })
    }
  }

  const handleSubtitlesDownload = () => {
    toast({
      title: "Subtitles download started",
      description: "Your subtitle file is being prepared for download.",
    })
  }

  if (!movie) {
    return (
      <div className="container py-20 text-center">
        <div className="animate-pulse">Loading movie details...</div>
      </div>
    )
  }

  return (
    <div className="pb-20">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10"></div>
        <div className="h-[50vh] w-full overflow-hidden">
          <TrailerPlayer
            trailerUrl={movie.trailerUrl}
            title={movie.title}
            thumbnailUrl="/placeholder.svg?height=1080&width=1920"
            className="w-full h-full"
          />
        </div>
      </div>

      <div className="container relative z-20 -mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="rounded-lg overflow-hidden border border-border shadow-lg animate-float">
              <img src={movie.posterUrl || "/placeholder.svg"} alt={movie.title} className="w-full h-auto" />
            </div>

            <div className="mt-6 space-y-4">
              <Button className="w-full gap-2" size="lg" onClick={handleDownload}>
                <Download className="h-4 w-4" />
                Download Torrent
              </Button>

              <Button variant="outline" className="w-full gap-2" onClick={handleSubtitlesDownload}>
                <Subtitles className="h-4 w-4" />
                Download Subtitles
              </Button>

              <Button variant="outline" className="w-full gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{movie.title}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{movie.year}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span>{movie.language}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {movie.genre.map((genre) => (
                <span key={genre} className="px-3 py-1 bg-secondary rounded-full text-sm">
                  {genre}
                </span>
              ))}
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Overview</h2>
              <p className="text-muted-foreground">{movie.plot}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Director</h2>
                <p className="text-muted-foreground">{movie.director}</p>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Cast</h2>
                <p className="text-muted-foreground">{movie.cast.join(", ")}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Ratings</h2>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <div className="text-sm text-muted-foreground mb-1">IMDb</div>
                  <div className="text-2xl font-bold">{movie.ratings.imdb}/10</div>
                </div>

                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Rotten Tomatoes</div>
                  <div className="text-2xl font-bold">{movie.ratings.rottenTomatoes}%</div>
                </div>

                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Metacritic</div>
                  <div className="text-2xl font-bold">{movie.ratings.metacritic}/100</div>
                </div>

                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Movono Members</div>
                  <div className="text-2xl font-bold">{(Math.random() * 2 + 3).toFixed(1)}/5</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Rating</h2>
              <div className="flex items-center gap-4">
                <RatingStars initialRating={userRating} size="lg" onRatingChange={handleRatingChange} />
                <span className="text-muted-foreground">{userRating > 0 ? `${userRating}/5` : "Rate this movie"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar Movies</h2>
          {similarMovies.length > 0 ? (
            <MovieSlider title="" movies={similarMovies} />
          ) : (
            <p className="text-muted-foreground">No similar movies found.</p>
          )}
        </div>

        <div className="mt-16">
          <MovieComments
            movieId={movie.id}
            initialComments={[
              {
                id: "1",
                user: {
                  name: "Jane Smith",
                  avatar: "/placeholder.svg?height=40&width=40",
                },
                text: "This movie was absolutely amazing! The visual effects were stunning and the storyline kept me engaged throughout.",
                date: new Date(Date.now() - 86400000 * 3),
              },
              {
                id: "2",
                user: {
                  name: "Mike Johnson",
                  avatar: "/placeholder.svg?height=40&width=40",
                },
                text: "I thought the acting was superb, especially the lead character. Would definitely recommend!",
                date: new Date(Date.now() - 86400000 * 7),
              },
            ]}
          />
        </div>
      </div>

      {unlockedAchievement && (
        <AchievementToast achievement={unlockedAchievement} onComplete={() => setUnlockedAchievement(null)} />
      )}
    </div>
  )
}
