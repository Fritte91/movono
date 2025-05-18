"use client"

import type { Collection } from "@/lib/collections-data"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface CollectionsGridProps {
  collections: Collection[]
  isOwner?: boolean
  onEdit?: (collection: Collection) => void
  onDelete?: (collection: Collection) => void
  onToggleVisibility?: (collection: Collection) => void
}

export function CollectionsGrid({
  collections,
  isOwner = false,
  onEdit,
  onDelete,
  onToggleVisibility,
}: CollectionsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections.map((collection) => (
        <Card key={collection.id} className="overflow-hidden group">
          <Link href={`/members/collections/${collection.id}`}>
            <div className="aspect-video relative overflow-hidden">
              {collection.gradientColor1 ? (
                <div
                  className="w-full h-full"
                  style={{
                    background: `linear-gradient(${collection.gradientAngle || 180}deg, ${collection.gradientColor1}, ${collection.gradientColor2 || '#065f46'})`,
                  }}
                ></div>
              ) : (
                <img
                  src={collection.coverImage || "/placeholder.svg?height=400&width=600"}
                  alt={collection.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-bold text-white">{collection.name}</h3>
                <p className="text-sm text-gray-300 line-clamp-1">{collection.description}</p>
              </div>
              {!isOwner && (
                <div className="absolute top-2 right-2">
                  {collection.isPublic ? (
                    <div className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      Public
                    </div>
                  ) : (
                    <div className="bg-secondary/40 text-secondary-foreground text-xs px-2 py-1 rounded-full flex items-center">
                      <EyeOff className="h-3 w-3 mr-1" />
                      Private
                    </div>
                  )}
                </div>
              )}
            </div>
          </Link>

          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {collection.movies.length} {collection.movies.length === 1 ? "movie" : "movies"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Updated{" "}
                  {collection.updatedAt.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit?.(collection)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleVisibility?.(collection)}>
                      {collection.isPublic ? "Make Private" : "Make Public"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete?.(collection)}
                      className="text-destructive focus:text-destructive"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0">
            <Link href={`/members/collections/${collection.id}`} className="w-full">
              <Button variant="outline" className="w-full">
                View Collection
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
