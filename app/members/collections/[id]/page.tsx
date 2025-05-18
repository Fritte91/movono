"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Edit, Share2, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { CollectionDialog } from "@/components/collection-dialog";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { Movie } from "@/lib/movie-data";
import { use } from "react";
import { supabaseClient } from "@/lib/supabase";

export interface Collection {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  movies: Movie[];
  gradientColor1?: string;
  gradientColor2?: string;
  gradientAngle?: number;
}

export default function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // Unwrap params using React.use
  const { id } = use(params);

  useEffect(() => {
    async function loadCollection() {
      try {
        const supabase = createSupabaseServerClient();
        const { data, error } = await supabase
          .from('collections')
          .select(`
            *,
            collection_movies (
              movie_id,
              movies (
                id,
                title,
                poster_url,
                year
              )
            )
          `)
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error loading collection:', error.message);
          toast({
            title: "Error",
            description: "Failed to load collection. Please try again.",
            variant: "destructive",
          });
          router.push("/members/profile?tab=collections");
          return;
        }

        if (!data) {
          toast({
            title: "Not Found",
            description: "Collection not found.",
            variant: "destructive",
          });
          router.push("/members/profile?tab=collections");
          return;
        }

        // Map the fetched data to the expected Collection type
        const fetchedCollection: Collection = {
          id: data.id,
          name: data.name,
          description: data.description,
          coverImage: data.cover_image || '/placeholder.svg',
          isPublic: data.is_public,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
          userId: data.user_id,
          // Extract movie data from the nested collection_movies relationship
          movies: data.collection_movies?.map((cm: any) => ({
            id: cm.movie_id,
            title: cm.movies.title,
            posterUrl: cm.movies.poster_url,
            year: cm.movies.year
          })) || [],
          gradientColor1: data.gradient_color1,
          gradientColor2: data.gradient_color2,
          gradientAngle: data.gradient_angle,
        };
        setCollection(fetchedCollection);
      } catch (error) {
        console.error("Failed to load collection:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
        router.push("/members/profile?tab=collections");
      } finally {
        setIsLoading(false);
      }
    }
    loadCollection();
  }, [id, router, toast]);

  const handleRemoveMovie = async (movieId: string) => {
    if (!collection) return;

    try {
      const { error } = await supabaseClient
        .from('collection_movies')
        .delete()
        .eq('collection_id', collection.id)
        .eq('movie_id', movieId);

      if (error) throw error;

      // Update local state
      setCollection({
        ...collection,
        movies: collection.movies.filter(m => m.id !== movieId)
      });

      toast({
        title: "Success",
        description: "Movie removed from collection",
      });
    } catch (error) {
      console.error('Error removing movie:', error);
      toast({
        title: "Error",
        description: "Failed to remove movie from collection",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    toast({
      title: "Link copied to clipboard",
      description: "You can now share this collection with others.",
    });
  };

  const handleSaveCollection = async (collectionData: Partial<Collection>) => {
    if (!collection) return;

    try {
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
      
      if (userError || !user) {
        toast({
          title: "Error",
          description: "You must be logged in to manage collections",
          variant: "destructive",
        });
        return;
      }

      // Update existing collection in the database
      const { error } = await supabaseClient
        .from('collections')
        .update({
          name: collectionData.name,
          description: collectionData.description,
          is_public: collectionData.isPublic,
          gradient_color1: collectionData.gradientColor1,
          gradient_color2: collectionData.gradientColor2,
          gradient_angle: collectionData.gradientAngle,
          updated_at: new Date().toISOString(),
        })
        .eq('id', collection.id);

      if (error) throw error;

      // Update local state with the new data and a fresh updatedAt timestamp
      setCollection({
        ...collection,
        name: collectionData.name || collection.name,
        description: collectionData.description || collection.description,
        isPublic: collectionData.isPublic !== undefined ? collectionData.isPublic : collection.isPublic,
        updatedAt: new Date(), // Update local state timestamp
        gradientColor1: collectionData.gradientColor1 || collection.gradientColor1,
        gradientColor2: collectionData.gradientColor2 || collection.gradientColor2,
        gradientAngle: collectionData.gradientAngle || collection.gradientAngle,
      });

      toast({
        title: "Collection updated",
        description: "Your collection has been updated successfully.",
      });

    } catch (error) {
      console.error('Error saving collection:', error);
      toast({
        title: "Error",
        description: "Failed to save collection",
        variant: "destructive",
      });
    }
  };

  if (isLoading || !collection) {
    return (
      <div className="container py-20 text-center">
        <div className="animate-pulse">Loading collection...</div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="container py-8">
        <Link href="/members/collections" className="flex items-center text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Collections
        </Link>
        <div className="relative rounded-xl overflow-hidden mb-8">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(${collection.gradientAngle || 180}deg, ${collection.gradientColor1 || '#1e3a8a'}, ${collection.gradientColor2 || '#065f46'})`,
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
          <img
            src={collection.coverImage || "/placeholder.svg?height=400&width=1200"}
            alt={collection.name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">{collection.name}</h1>
                <p className="text-gray-300 max-w-2xl">{collection.description}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
            <div className="flex items-center mt-4">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="text-sm text-gray-300">
                Created by <span className="font-medium text-white">John Doe</span> • {collection.movies.length} movies
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Movies in this Collection</h2>
          <Button onClick={() => router.push('/members')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Movies
          </Button>
        </div>
        {collection.movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {collection.movies.map((movie) => (
              <div key={movie.id} className="group relative">
                <Link href={`/members/movie/${movie.id}`} className="block">
                  <div className="movie-card rounded-lg overflow-hidden bg-card border border-border/50 h-full">
                    <div className="aspect-[2/3] relative">
                      <img
                        src={movie.posterUrl || "/placeholder.svg"}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                        <Button variant="secondary" size="sm">
                          View Details
                        </Button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <div className="text-sm font-medium truncate">{movie.title}</div>
                        <div className="text-xs text-gray-400">{movie.year}</div>
                      </div>
                    </div>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveMovie(movie.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <div className="text-4xl mb-4">🎬</div>
            <h3 className="text-lg font-medium mb-2">No Movies Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Start adding movies to your collection to keep track of your favorites.
            </p>
            <Button onClick={() => router.push('/members')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Movie
            </Button>
          </div>
        )}
        <CollectionDialog
          open={isEditing}
          onOpenChange={setIsEditing}
          collection={collection}
          onSave={handleSaveCollection}
        />
      </div>
    </div>
  );
}