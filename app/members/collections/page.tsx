"use client";

import { useState, useEffect } from "react";
import { CollectionsGrid } from "@/components/collections-grid";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getMovies, type Movie } from "@/lib/movie-data";

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

export default function PublicCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCollections() {
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

        // Set public collections
        setCollections(sampleCollections.filter((collection) => collection.isPublic));
      } catch (error) {
        console.error("Failed to load collections:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadCollections();
  }, []);

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Public Collections</h1>
          <p className="text-muted-foreground mt-1">Discover curated movie collections from the community</p>
        </div>
        <Link href="/members/profile?tab=collections">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Your Collection
          </Button>
        </Link>
      </div>
      {isLoading ? (
        <div className="text-center py-12">Loading collections...</div>
      ) : collections.length > 0 ? (
        <CollectionsGrid collections={collections} />
      ) : (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-lg font-medium mb-2">No Public Collections Yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Be the first to create and share a collection with the community.
          </p>
          <Link href="/members/profile?tab=collections">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Collection
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}