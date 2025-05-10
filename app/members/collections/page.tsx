"use client"

import { useState } from "react"
import { getPublicCollections } from "@/lib/collections-data"
import { CollectionsGrid } from "@/components/collections-grid"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function PublicCollectionsPage() {
  const [collections] = useState(getPublicCollections())

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

      {collections.length > 0 ? (
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
  )
}
