'use client';
import { useState, useEffect } from "react";
import React from "react";
import { getMovieById, type Movie } from "@/lib/movie-data";
import { RatingStars } from "@/components/rating-stars";
import { Button } from "@/components/ui/button";
import { MovieSlider } from "@/components/movie-slider";
import { Clock, Calendar, Globe, Subtitles, Share2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { TrailerPlayer } from "@/components/trailer-player";
import MovieCommentsClient from "@/components/MovieCommentsClient";
import { YtsDownloads } from "@/components/yts-downloads";
import { SimilarMovies } from "@/components/similar-movies";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getLatestYtsMovies, getYtsMovieById, getYtsMovieByImdbId, type YtsMovie } from '@/lib/yts-api';
import { getMovieFromTmdbById } from '@/lib/api/tmdb';
import toast from "react-hot-toast";
import { supabase } from '@/lib/supabase-client';

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
    hash: string;
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

interface OMDbRating {
  Source: string;
  Value: string;
}

interface OMDbMovie {
  Ratings: OMDbRating[];
  Response: "True" | "False";
  Error?: string;
}

async function fetchComments(movieId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      id,
      movie_id,
      user_id,
      content,
      created_at,
      profiles ( username )
    `)
    .eq('movie_id', movieId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
  // Map the joined profile data to the Comment interface
  return (data || []).map((row: any) => ({
    id: row.id,
    movie_id: row.movie_id,
    user_id: row.user_id,
    username: row.profiles?.username || 'Unknown',
    content: row.content,
    created_at: row.created_at,
  }));
}

export default function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const [movie, setMovie] = useState<DetailedMovie | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [collections, setCollections] = useState<{ id: string; name: string }[]>([]);
  const router = useRouter();
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const [omdbRatings, setOmdbRatings] = useState<OMDbRating[]>([]);
  const [omdbImdbRating, setOmdbImdbRating] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);

  const { id } = React.use(params);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        // Handle TMDB IDs (from coming soon slider)
        if (id.startsWith('tmdb-')) {
          const tmdbId = parseInt(id.replace('tmdb-', ''));
          const tmdbMovie = await getMovieFromTmdbById(tmdbId);
          if (tmdbMovie) {
            setMovie(tmdbMovie);
            setUserRating(0);
            setComments([]);
            setCollections([]);
            setIsLoading(false);
            return;
          } else {
            setError('TMDB Movie not found');
            setIsLoading(false);
            return;
          }
        }

        // If the ID is an IMDb ID (tt...), try DB first, then YTS
        if (/^tt\d+$/.test(id)) {
          // Try to fetch from your DB
          const fetchedMovie = await getMovieById(id);
          if (fetchedMovie) {
            setMovie(fetchedMovie);
            setUserRating(fetchedMovie.userRating || 0);
            // Fetch comments, collections, OMDb, etc. as before
            const fetchedComments = await fetchComments(id);
            setComments(fetchedComments);
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              const { data: userCollections } = await supabase
                .from('collections')
                .select('id, name')
                .eq('user_id', user.id)
                .order('name');
              setCollections(userCollections || []);
            }
            // Fetch OMDb ratings if movie data is available and has an IMDb ID (part of the movie.id)
            if (fetchedMovie && fetchedMovie.id) {
              // Extract IMDb ID (assuming it's part of the movie.id or can be derived)
              // You might need to adjust this logic based on how your movie.id is structured
              const imdbIdMatch = fetchedMovie.id.match(/tt\d+/);
              if (imdbIdMatch && imdbIdMatch[0]) {
                const imdbId = imdbIdMatch[0];
                try {
                  const omdbApiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;
                  const omdbResponse = await fetch(`https://www.omdbapi.com/?i=${imdbId}&apikey=${omdbApiKey}`);
                  const omdbData: OMDbMovie = await omdbResponse.json();
                  if (omdbData.Response === "True" && omdbData.Ratings) {
                    setOmdbRatings(omdbData.Ratings);
                    // Extract IMDb rating from OMDb Ratings
                    const imdbRatingObj = omdbData.Ratings.find(r => r.Source === "Internet Movie Database");
                    if (imdbRatingObj && imdbRatingObj.Value) {
                      setOmdbImdbRating(imdbRatingObj.Value);
                    } else {
                      setOmdbImdbRating(null);
                    }
                  } else if (omdbData.Response === "False") {
                    console.error("Error fetching OMDb data:", omdbData.Error);
                    setOmdbImdbRating(null);
                  }
                } catch (omdbError) {
                  console.error("Failed to fetch OMDb data:", omdbError);
                  setOmdbImdbRating(null);
                }
              }
              // Fetch average rating for this movie
              fetchAverageRating(fetchedMovie.id);
            }
            setIsLoading(false);
            return;
          }
          // If not found, try YTS by IMDb ID
          const ytsMovie = await getYtsMovieByImdbId(id);
          if (ytsMovie) {
            const mapped: DetailedMovie = {
              id: ytsMovie.imdb_code,
              title: ytsMovie.title_english,
              posterUrl: ytsMovie.large_cover_image,
              youtubeTrailerUrl: ytsMovie.yt_trailer_code ? `https://www.youtube.com/watch?v=${ytsMovie.yt_trailer_code}` : undefined,
              year: ytsMovie.year,
              runtime: ytsMovie.runtime,
              language: [ytsMovie.language],
              country: [],
              genre: ytsMovie.genres,
              plot: ytsMovie.description_full || ytsMovie.summary,
              director: '',
              writer: '',
              cast: [],
              awards: '',
              metascore: 0,
              imdbVotes: 0,
              type: 'movie',
              dvd: '',
              boxOffice: '',
              production: '',
              website: '',
              ratings: {
                imdb: ytsMovie.rating,
                rottenTomatoes: 'N/A',
                metacritic: 0
              },
              userRating: 0,
              torrents: ytsMovie.torrents.map(t => ({
                url: t.url,
                hash: t.hash,
                quality: t.quality,
                size: t.size,
                seeds: t.seeds,
                peers: t.peers
              }))
            };
            setMovie(mapped);
            setUserRating(0);
            setComments([]);
            setCollections([]);
            setIsLoading(false);
            return;
          } else {
            setError('Movie not found');
            setIsLoading(false);
            return;
          }
        }
        // If the ID is a YTS numeric ID, fetch from YTS by ID
        if (/^\d+$/.test(id)) {
          const ytsMovie = await getYtsMovieById(Number(id));
          if (ytsMovie) {
            const mapped: DetailedMovie = {
              id: ytsMovie.imdb_code,
              title: ytsMovie.title_english,
              posterUrl: ytsMovie.large_cover_image,
              youtubeTrailerUrl: ytsMovie.yt_trailer_code ? `https://www.youtube.com/watch?v=${ytsMovie.yt_trailer_code}` : undefined,
              year: ytsMovie.year,
              runtime: ytsMovie.runtime,
              language: [ytsMovie.language],
              country: [],
              genre: ytsMovie.genres,
              plot: ytsMovie.description_full || ytsMovie.summary,
              director: '',
              writer: '',
              cast: [],
              awards: '',
              metascore: 0,
              imdbVotes: 0,
              type: 'movie',
              dvd: '',
              boxOffice: '',
              production: '',
              website: '',
              ratings: {
                imdb: ytsMovie.rating,
                rottenTomatoes: 'N/A',
                metacritic: 0
              },
              userRating: 0,
              torrents: ytsMovie.torrents.map(t => ({
                url: t.url,
                hash: t.hash,
                quality: t.quality,
                size: t.size,
                seeds: t.seeds,
                peers: t.peers
              }))
            };
            setMovie(mapped);
            setUserRating(0);
            setComments([]);
            setCollections([]);
            setIsLoading(false);
            return;
          } else {
            setError('YTS Movie not found');
            setIsLoading(false);
            return;
          }
        }
        // If we reach here, the movie wasn't found in any source
        setError("Movie not found");
        setIsLoading(false);
        return;
      } catch (err) {
        setError("Failed to load movie details");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id, router]);

  async function fetchAverageRating(movieId: string) {
    const { data, error } = await supabase
      .from('ratings')
      .select('rating')
      .eq('movie_imdb_id', movieId);
    if (error) {
      console.error('Error fetching average rating:', error);
      setAverageRating(null);
      return;
    }
    if (data && data.length > 0) {
      const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
      setAverageRating(avg);
    } else {
      setAverageRating(null);
    }
  }

  const handleRatingChange = async (rating: number) => {
    setUserRating(rating);
    toast.success(`You rated ${movie?.title} ${rating} stars.`);

    if (movie) {
      setMovie({ ...movie, userRating: rating });
      // Upsert rating to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('ratings')
          .upsert({
            user_id: user.id,
            movie_imdb_id: movie.id,
            rating,
          });
        if (error) {
          toast.error("Failed to save your rating.");
        } else {
          fetchAverageRating(movie.id);
        }
      }
    }
  };

  const handleSubtitlesDownload = () => {
    if (!movie) return;

    // Extract IMDb ID from movie.id (it might be in format 'tmdb-123' or 'tt123456')
    const imdbId = movie.id.startsWith('tmdb-') 
      ? movie.id.replace('tmdb-', 'tt') 
      : movie.id.startsWith('tt') 
        ? movie.id 
        : `tt${movie.id}`;

    // Open SubDL in a new tab
    window.open(`https://subdl.com/search/${imdbId}`, '_blank');
  };

  const handleTorrentDownload = async (torrent: { url: string; hash: string; quality: string; size: string; seeds: number; peers: number; }) => {
    if (!movie) return;
    // Use the correct imdb_id for downloads
    const imdbId = (movie as any).imdb_id || movie.id;
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (user) {
      const { error, data } = await supabase
        .from('downloads')
        .insert({
          user_id: user.id,
          movie_imdb_id: imdbId,
        });
      if (error) {
        toast.error("Failed to log download event.");
      }
    }
  };

  const handleAddToCollection = async (collectionId: string) => {
    if (!movie) return;

    try {
      // First, ensure the movie exists in the movies table
      const { data: existingMovie, error: movieError } = await supabase
        .from('movies')
        .select('id, imdb_id')
        .eq('imdb_id', movie.id)
        .single();

      if (movieError && movieError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw movieError;
      }

      // If the movie doesn't exist in the movies table, insert it
      if (!existingMovie) {
        const { error: insertError } = await supabase
          .from('movies')
          .insert({
            id: movie.id,
            title: movie.title,
            poster_url: movie.posterUrl,
            year: movie.year,
            imdb_id: movie.id,
            genre: movie.genre?.join(', ')
          });

        if (insertError) throw insertError;
      }

      // Add the movie to the collection
      const { error } = await supabase
        .from('collection_movies')
        .insert({
          collection_id: collectionId,
          movie_imdb_id: movie.id,
        });

      if (error) throw error;

      toast.success("Movie added to collection successfully");
    } catch (error) {
      console.error('Error adding movie to collection:', error);
      toast.error("Failed to add movie to collection");
    }
  };

  const handleTrailerPlay = () => {
    setIsTrailerPlaying(true);
  };

  const handleStream = () => {
    if (movie && movie.torrents && movie.torrents.length > 0) {
      // TODO: Implement WebTorrent streaming logic here.
      toast.success('Streaming feature coming soon!');
    } else {
      toast.error('No torrents available for streaming');
    }
  };

  const handleDownload = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && movie) {
      const imdbId = movie.id;
      
      const { error, data } = await supabase
        .from('downloads')
        .insert({
          user_id: user.id,
          movie_id: imdbId,
          downloaded_at: new Date().toISOString()
        });

      if (error) {
        toast.error('Failed to record download');
      } else {
        toast.success('Download recorded!');
      }
    }
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
        {!isTrailerPlaying && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10 pointer-events-none"></div>
        )}
        <div className="h-[50vh] w-full overflow-hidden">
          <TrailerPlayer
            youtubeTrailerUrl={movie.youtubeTrailerUrl}
            title={movie.title}
            thumbnailUrl={movie.posterUrl || "/placeholder.svg?height=1080&width=1920"}
            className="w-full h-full"
            onPlay={handleTrailerPlay}
          />
        </div>
      </div>

      <div className={`container relative z-20 ${isTrailerPlaying ? 'mt-10' : '-mt-20'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="rounded-lg overflow-hidden border border-border shadow-lg animate-float">
              <img src={movie.posterUrl} alt={movie.title} className="w-full h-auto" />
            </div>
            <div className="mt-6 space-y-4">
              <YtsDownloads imdbId={movie.id} title={movie.title} handleTorrentDownload={handleTorrentDownload} />
              <Button variant="outline" className="w-full gap-2" onClick={handleSubtitlesDownload}>
                <Subtitles className="h-4 w-4" />
                Download Subtitles
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    Add to Collection
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 max-h-[300px] overflow-y-auto">
                  {collections && collections.length > 0 ? (
                    collections.map((collection) => (
                      <DropdownMenuItem
                        key={collection.id}
                        onClick={() => handleAddToCollection(collection.id)}
                      >
                        {collection.name}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>
                      No collections found
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => router.push('/members/profile?tab=collections')}
                    className="text-primary"
                  >
                    Create New Collection
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Add Stream Button */}
              <Button variant="default" className="w-full gap-2" onClick={handleStream}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Stream Movie
              </Button>
              <Button variant="outline" className="w-full gap-2" onClick={handleDownload}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download
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
                    <div className="text-2xl font-bold">
                      {omdbImdbRating
                        ? omdbImdbRating
                        : `${(movie.ratings?.imdb ?? 0).toFixed(1)}/10`}
                    </div>
                  </div>
                  {omdbRatings
                    .filter(rating => rating.Source === "Rotten Tomatoes" || rating.Source === "Metacritic")
                    .map(rating => (
                    <div key={rating.Source} className="bg-card border border-border rounded-lg p-4 text-center">
                      <div className="text-sm text-muted-foreground mb-1">{rating.Source}</div>
                      <div className="text-2xl font-bold">{rating.Value}</div>
                    </div>
                  ))}
                  <div className="bg-card border border-border rounded-lg p-4 text-center">
                    <div className="text-sm text-muted-foreground mb-1">Movono Members</div>
                    <div className="text-2xl font-bold">
                      {averageRating ? averageRating.toFixed(1) : "N/A"}/5
                    </div>
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