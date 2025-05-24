"use client";

import { useState, useEffect } from "react";
import { CollectionsGrid } from "@/components/collections-grid";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { Movie } from "@/lib/movie-data";
import { CollectionDialog } from "@/components/collection-dialog";
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

export default function PublicCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | undefined>(undefined);

  const handleSaveCollection = async (collectionData: Partial<Collection>) => {
    try {
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
      
      if (userError || !user) {
        return;
      }

    if (editingCollection) {
      // Update existing collection
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
        .eq('id', editingCollection.id);

      if (error) throw error;

      setCollections(collections.map((c) =>
        c.id === editingCollection.id
          ? {
              ...c,
              name: collectionData.name || c.name,
              description: collectionData.description || c.description,
              isPublic: collectionData.isPublic !== undefined ? collectionData.isPublic : c.isPublic,
              updatedAt: new Date(),
            }
          : c
      ))

    } else {
    // Create new collection
      const { data, error } = await supabaseClient
        .from('collections')
        .insert({
      name: collectionData.name || "New Collection",
      description: collectionData.description || "",
          is_public: collectionData.isPublic || false,
          user_id: user.id,
          cover_image: "/placeholder.svg?height=400&width=600",
          gradient_color1: collectionData.gradientColor1 || "#1e3a8a",
          gradient_color2: collectionData.gradientColor2 || "#065f46",
          gradient_angle: collectionData.gradientAngle || 180,
        })
        .select()
        .single()

      if (error) throw error

      setCollections([{ ...data, movies: [], createdAt: new Date(data.created_at), updatedAt: new Date(data.updated_at) }, ...collections])
    }

  setEditingCollection(undefined)
    setIsCollectionDialogOpen(false)
  } catch (error) {
    console.error('Error saving collection:', error)
  }
};

  useEffect(() => {
    async function loadCollections() {
      try {
        const supabase = createSupabaseServerClient();
        const { data, error } = await supabase
          .from('collections')
          .select('*, collection_movies!collection_movies_collection_id_fkey(movies_mini(*))')
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
              id: cm.movies_mini.imdb_id,
              title: cm.movies_mini.title,
              posterUrl: cm.movies_mini.poster_url,
              year: cm.movies_mini.year,
              imdbId: cm.movies_mini.imdb_id,
              genre: cm.movies_mini.genre,
            })),
            gradientColor1: item.gradient_color1,
            gradientColor2: item.gradient_color2,
            gradientAngle: item.gradient_angle,
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
        <Button onClick={() => {
          setEditingCollection(undefined);
          setIsCollectionDialogOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Create Your Collection
        </Button>
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
          <Button onClick={() => {
            setEditingCollection(undefined);
            setIsCollectionDialogOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Create Collection
          </Button>
        </div>
      )}

      {/* Add Collection Dialog */}
      <CollectionDialog
        open={isCollectionDialogOpen}
        onOpenChange={setIsCollectionDialogOpen}
        collection={editingCollection}
        onSave={handleSaveCollection}
      />
    </div>
  );
}