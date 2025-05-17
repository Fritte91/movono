'use client';

import { useState, useEffect } from "react";
import React from "react";
import { getMovieById, type Movie } from "@/lib/movie-data";
import { RatingStars } from "@/components/rating-stars";
import { Button } from "@/components/ui/button";
import { MovieSlider } from "@/components/movie-slider";
import { Clock, Calendar, Globe, Subtitles, Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { TrailerPlayer } from "@/components/trailer-player";
import MovieCommentsClient from "@/components/MovieCommentsClient";
import { YtsDownloads } from "@/components/yts-downloads";
import { SimilarMovies } from "@/components/similar-movies";
import { createSupabaseServerClient } from "@/lib/supabase";

export interface DetailedMovie {
  id: string;
  title: string;
  posterUrl: string;
  youtubeTrailerUrl?: string | null;
  year: number;
  runtime?: number;
  language?: string[];
  country?: string[];
  genre?: string[];
  plot?: string;
  director?: string;
  writer?: string;
  cast?: string[];
  awards?: string;
  metascore?: number;
  imdbVotes?: number;
  type?: string;
  dvd?: string;
  boxOffice?: string;
  production?: string;
  website?: string;
  ratings?: {
    imdb: number;
    rottenTomatoes: string;
    metacritic: number;
  };
  userRating?: number;
  torrents?: {
    url: string;
    quality: string;
    size: string;
    seeds: number;
    peers: number;
  }[];
}

interface Comment {
  id: string;
  movie_id: string;
  user_id: string;
  username: string;
  content: string;
  created_at: string;
}

async function fetchComments(movieId: string): Promise<Comment[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('movie_id', movieId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
  return data || [];
}

export default function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const [movie, setMovie] = useState<DetailedMovie | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  const resolvedParams = React.use(params);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch movie
        const fetchedMovie = await getMovieById(resolvedParams.id);
        if (fetchedMovie) {
          setMovie(fetchedMovie);
          setUserRating(fetchedMovie.userRating || 0);
        } else {
          setError("Movie not found");
          router.push("/members");
          return;
        }

        // Fetch comments
        const fetchedComments = await fetchComments(resolvedParams.id);
        setComments(fetchedComments);
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

  const handleSubtitlesDownload = () => {
    toast({
      title: "Subtitles download started",
      description: "Your subtitle file is being prepared for download.",
    });
  };

  const handleTorrentDownload = (torrent: DetailedMovie["torrents"][0]) => {
    toast({
      title: "Download started",
      description: `Downloading ${movie?.title} in ${torrent.quality} (${torrent.size}).`,
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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10 pointer-events-none"></div>
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
              <YtsDownloads imdbId={movie.id} title={movie.title} />
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
              <h1 className="text-3xl md:text-4xl font-bold">
                <span className="bg-background/80 rounded-md px-3 py-1">{movie.title}</span>
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="bg-background/80 rounded-full px-2 py-1 text-sm">
                    {movie.year}
                  </span>
                </div>
                {movie.runtime && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span className="bg-background/80 rounded-full px-2 py-1 text-sm">
                        {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                      </span>
                    </div>
                  </>
                )}
                {movie.language && movie.language.length > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      <span className="bg-background/80 rounded-full px-2 py-1 text-sm">
                        {movie.language.join(", ")}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <span key={genre} className="px-3 py-1 bg-secondary rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>
            )}
            {movie.plot && (
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Overview</h2>
                <p className="text-muted-foreground">{movie.plot}</p>
              </div>
            )}
            {(movie.director || movie.cast) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {movie.director && (
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Director</h2>
                    <p className="text-muted-foreground">{movie.director}</p>
                  </div>
                )}
                {movie.cast && movie.cast.length > 0 && (
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Cast</h2>
                    <p className="text-muted-foreground">{movie.cast.join(", ")}</p>
                  </div>
                )}
              </div>
            )}
            {movie.ratings && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Ratings</h2>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-card border border-border rounded-lg p-4 text-center">
                    <div className="text-sm text-muted-foreground mb-1">IMDb</div>
                    <div className="text-2xl font-bold">{movie.ratings.imdb.toFixed(1)}/10</div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4 text-center">
                    <div className="text-sm text-muted-foreground mb-1">Rotten Tomatoes</div>
                    <div className="text-2xl font-bold">{movie.ratings.rottenTomatoes}</div>
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
            )}
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
        <SimilarMovies movieId={movie.id} />
        <div className="mt-16">
          <MovieCommentsClient movieId={movie.id} initialComments={comments} />
        </div>
      </div>
    </div>
  );
}