// app/members/movie/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import React from "react";
import { getMovieById, getSimilarMovies } from "@/lib/movie-data"; // Use modie-data if Option B
import { RatingStars } from "@/components/rating-stars";
import { Button } from "@/components/ui/button";
import { MovieSlider } from "@/components/movie-slider";
import { Clock, Calendar, Globe, Download, Share2, Subtitles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { TrailerPlayer } from "@/components/trailer-player";
import { MovieComments } from "@/components/movie-comments";
import { AchievementToast } from "@/components/achievement-toast";
import type { Achievement } from "@/lib/achievements-data";

interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  youtubeTrailerUrl: string | null;
  year: number;
  runtime: number;
  language: string;
  genre: string[];
  plot: string;
  director: string;
  cast: string[];
  ratings: {
    imdb: number;
    rottenTomatoes: number;
    metacritic: number;
  };
  userRating?: number;
  torrents?: any[];
  rating?: string;
}

export default function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [userRating, setUserRating] = useState<number>(0);
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);
  const [downloadCount, setDownloadCount] = useState<number>(7);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const resolvedParams = React.use(params);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        const fetchedMovie = await getMovieById(resolvedParams.id);
        if (fetchedMovie) {
          setMovie(fetchedMovie);
          setUserRating(fetchedMovie.userRating || 0);
          const similar = await getSimilarMovies(resolvedParams.id);
          setSimilarMovies(similar || []);
        } else {
          setError("Movie not found");
          router.push("/members");
        }
      } catch (err) {
        setError("Failed to load movie details");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [resolvedParams.id, router]);

  const handleRatingChange = (rating: number) => {
    setUserRating(rating);
    toast({
      title: "Rating saved",
      description: `You rated ${movie?.title} ${rating} stars.`,
    });

    if (movie) {
      setMovie({ ...movie, userRating: rating });
    }
  };

  const handleDownload = () => {
    const newCount = downloadCount + 1;
    setDownloadCount(newCount);

    toast({
      title: "Download started",
      description: "Your torrent file is being prepared for download.",
    });

    if (newCount === 1) {
      setUnlockedAchievement({
        id: "download-1",
        name: "First Download",
        description: "Downloaded your first movie",
        icon: "download",
        unlockedAt: new Date(),
      });
    } else if (newCount === 10) {
      setUnlockedAchievement({
        id: "download-10",
        name: "Movie Enthusiast",
        description: "Downloaded 10 movies",
        icon: "film",
        unlockedAt: new Date(),
      });
    }
  };

  const handleSubtitlesDownload = () => {
    toast({
      title: "Subtitles download started",
      description: "Your subtitle file is being prepared for download.",
    });
  };

  if (isLoading) {
    return (
      <div className="container py-20 text-center">
        <div className="animate-pulse">Loading movie details...</div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container py-20 text-center">
        <p className="text-red-500">{error || "Failed to load movie details"}</p>
      </div>
    );
  }

  const genres = Array.isArray(movie.genre) ? movie.genre : [];

  return (
    <div className="pb-20">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10"></div>
        <div className="h-[50vh] w-full overflow-hidden">
          <TrailerPlayer
            youtubeTrailerUrl={movie.youtubeTrailerUrl}
            title={movie.title}
            thumbnailUrl={movie.posterUrl || "/placeholder.svg?height=1080&width=1920"}
            className="w-full h-full"
          />
        </div>
      </div>

      <div className="container relative z-20 -mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="rounded-lg overflow-hidden border border-border shadow-lg animate-float">
              <img src={movie.posterUrl} alt={movie.title} className="w-full h-auto" />
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
              {genres.map((genre) => (
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
                  <div className="text-2xl font-bold">{movie.ratings.imdb.toFixed(1)}/10</div>
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
                <RatingStars
                  initialRating={userRating}
                  size="lg"
                  onRatingChange={handleRatingChange}
                />
                <span className="text-muted-foreground">
                  {userRating > 0 ? `${userRating}/5` : "Rate this movie"}
                </span>
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
                user: { name: "Jane Smith", avatar: "/placeholder.svg?height=40&width=40" },
                text: "This movie was absolutely amazing! The visual effects were stunning and the storyline kept me engaged throughout.",
                date: new Date(Date.now() - 86400000 * 3),
              },
              {
                id: "2",
                user: { name: "Mike Johnson", avatar: "/placeholder.svg?height=40&width=40" },
                text: "I thought the acting was superb, especially the lead character. Would definitely recommend!",
                date: new Date(Date.now() - 86400000 * 7),
              },
            ]}
          />
        </div>
      </div>
      {unlockedAchievement && (
        <AchievementToast
          achievement={unlockedAchievement}
          onComplete={() => setUnlockedAchievement(null)}
        />
      )}
    </div>
  );
}