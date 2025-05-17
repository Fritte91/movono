"use client";

import { useState, useEffect } from "react";
import { CollectionsGrid } from "@/components/collections-grid";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { Movie } from "@/lib/movie-data";

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
        const supabase = createSupabaseServerClient();
        const { data, error } = await supabase
          .from('collections')
          .select('*, collection_movies(movies(*))')
          .eq('is_public', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading public collections:', error);
          setCollections([]);
        } else {
          const fetchedCollections: Collection[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            coverImage: item.cover_image || '/placeholder.svg',
            isPublic: item.is_public,
            createdAt: new Date(item.created_at),
            updatedAt: new Date(item.updated_at),
            userId: item.user_id,
            movies: item.collection_movies?.map((cm: any) => ({
              id: cm.movies.id,
              title: cm.movies.title,
              posterUrl: cm.movies.poster_url,
              year: cm.movies.year,
              imdbId: cm.movies.imdb_id,
              genre: cm.movies.genre,
            })),
          }));
          setCollections(fetchedCollections);
        }
      } catch (error) {
        console.error("Failed to load collections:", error);
        setCollections([]);
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