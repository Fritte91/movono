"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Edit, Share2, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { CollectionDialog } from "@/components/collection-dialog";
import { getMovies, type Movie } from "@/lib/movie-data";
import { use } from "react";

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
        // Fetch movies using the API
        const allMovies = await getMovies([
          "Inception",
          "The Matrix",
          "Fight Club",
          "The Shawshank Redemption",
          "The Godfather",
          "Dune: Part Two",
          "Oppenheimer",
          "The Dark Knight",
          "Pulp Fiction",
        ]);

        // Define collections dynamically
        const sampleCollections: Collection[] = [
          {
            id: "1",
            name: "Halloween Marathon",
            description: "My favorite horror movies for Halloween night",
            coverImage: "/placeholder.svg?height=400&width=600",
            isPublic: true,
            createdAt: new Date(2023, 9, 15),
            updatedAt: new Date(2023, 9, 15),
            userId: "user1",
            movies: allMovies.filter((_, index) => [2, 5, 8].includes(index)),
          },
          {
            id: "2",
            name: "Best of the 90s",
            description: "Classic films from the 1990s that defined a generation",
            coverImage: "/placeholder.svg?height=400&width=600",
            isPublic: true,
            createdAt: new Date(2023, 8, 10),
            updatedAt: new Date(2023, 8, 20),
            userId: "user1",
            movies: allMovies
              .filter((movie) => movie.year >= 1990 && movie.year < 2000)
              .slice(0, 5),
          },
          {
            id: "3",
            name: "Sci-Fi Favorites",
            description: "Mind-bending science fiction films that make you think",
            coverImage: "/placeholder.svg?height=400&width=600",
            isPublic: false,
            createdAt: new Date(2023, 7, 5),
            updatedAt: new Date(2023, 7, 5),
            userId: "user1",
            movies: allMovies.filter((movie) => movie.genre.includes("Sci-Fi")).slice(0, 4),
          },
        ];

        // Find the collection by ID
        const fetchedCollection = sampleCollections.find((c) => c.id === id);
        if (fetchedCollection) {
          setCollection(fetchedCollection);
        } else {
          router.push("/members/profile?tab=collections");
        }
      } catch (error) {
        console.error("Failed to load collection:", error);
        router.push("/members/profile?tab=collections");
      } finally {
        setIsLoading(false);
      }
    }
    loadCollection();
  }, [id, router]);

  const handleShare = () => {
    toast({
      title: "Link copied to clipboard",
      description: "You can now share this collection with others.",
    });
  };

  const handleSaveCollection = (collectionData: Partial<Collection>) => {
    if (!collection) return;

    setCollection({
      ...collection,
      name: collectionData.name || collection.name,
      description: collectionData.description || collection.description,
      isPublic: collectionData.isPublic !== undefined ? collectionData.isPublic : collection.isPublic,
      updatedAt: new Date(),
    });

    toast({
      title: "Collection updated",
      description: "Your collection has been updated successfully.",
    });
  };

  if (isLoading || !collection) {
    return (
      <div className="container py-20 text-center">
        <div className="animate-pulse">Loading collection...</div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link
          href="/members/profile?tab=collections"
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Collections
        </Link>
      </div>
      <div className="relative rounded-xl overflow-hidden mb-8">
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
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Movies
        </Button>
      </div>
      {collection.movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {collection.movies.map((movie) => (
            <Link key={movie.id} href={`/members/movie/${movie.id}`} className="group">
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
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <div className="text-4xl mb-4">🎬</div>
          <h3 className="text-lg font-medium mb-2">No Movies Yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Start adding movies to your collection to keep track of your favorites.
          </p>
          <Button>
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
  );
}