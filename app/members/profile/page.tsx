"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { popularMovies } from "@/lib/movie-data"
import Link from "next/link"
import { RatingStars } from "@/components/rating-stars"
import { Plus } from "lucide-react"

// Import the new components and data
import { CollectionsGrid } from "@/components/collections-grid"
import { CollectionDialog } from "@/components/collection-dialog"
import { AchievementsDisplay } from "@/components/achievements-display"
import { getUserCollections } from "@/lib/collections-data"
import { getUserAchievements } from "@/lib/achievements-data"
import type { Collection } from "@/lib/collections-data"

export default function ProfilePage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [collections, setCollections] = useState(getUserCollections("user1"))
  const [achievements] = useState(getUserAchievements("user1"))
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false)
  const [editingCollection, setEditingCollection] = useState<Collection | undefined>(undefined)

  const handleSaveProfile = () => {
    setIsEditing(false)

    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    })
  }

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection)
    setIsCollectionDialogOpen(true)
  }

  const handleDeleteCollection = (collection: Collection) => {
    // In a real app, this would call an API
    setCollections(collections.filter((c) => c.id !== collection.id))

    toast({
      title: "Collection deleted",
      description: `"${collection.name}" has been deleted.`,
    })
  }

  const handleToggleVisibility = (collection: Collection) => {
    // In a real app, this would call an API
    setCollections(collections.map((c) => (c.id === collection.id ? { ...c, isPublic: !c.isPublic } : c)))

    toast({
      title: collection.isPublic ? "Collection is now private" : "Collection is now public",
      description: `"${collection.name}" visibility has been updated.`,
    })
  }

  const handleSaveCollection = (collectionData: Partial<Collection>) => {
    if (editingCollection) {
      // Update existing collection
      setCollections(
        collections.map((c) =>
          c.id === editingCollection.id
            ? {
                ...c,
                name: collectionData.name || c.name,
                description: collectionData.description || c.description,
                isPublic: collectionData.isPublic !== undefined ? collectionData.isPublic : c.isPublic,
                updatedAt: new Date(),
              }
            : c,
        ),
      )

      toast({
        title: "Collection updated",
        description: `"${collectionData.name}" has been updated.`,
      })
    } else {
      // Create new collection
      const newCollection: Collection = {
        id: `new-${Date.now()}`,
        name: collectionData.name || "New Collection",
        description: collectionData.description || "",
        isPublic: collectionData.isPublic || false,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user1",
        movies: [],
        coverImage: "/placeholder.svg?height=400&width=600",
      }

      setCollections([newCollection, ...collections])

      toast({
        title: "Collection created",
        description: `"${newCollection.name}" has been created.`,
      })
    }

    setEditingCollection(undefined)
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-20 w-20 border-2 border-primary">
            <AvatarImage src="/placeholder.svg?height=80&width=80" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-3xl font-bold">John Doe</h1>
            <p className="text-muted-foreground">Member since May 2023</p>
          </div>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="collections">My Collections</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="ratings">My Ratings</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Manage your account details</CardDescription>
                  </div>

                  {!isEditing && (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue="johndoe" disabled={!isEditing} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" disabled={!isEditing} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input id="bio" defaultValue="Film enthusiast and collector" disabled={!isEditing} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" defaultValue="United States" disabled={!isEditing} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    <Input id="language" defaultValue="English" disabled={!isEditing} />
                  </div>
                </div>
              </CardContent>

              {isEditing && (
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="collections">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">My Collections</h2>
                <p className="text-muted-foreground">Create and manage your movie collections</p>
              </div>

              <Button
                onClick={() => {
                  setEditingCollection(undefined)
                  setIsCollectionDialogOpen(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Collection
              </Button>
            </div>

            {collections.length > 0 ? (
              <CollectionsGrid
                collections={collections}
                isOwner={true}
                onEdit={handleEditCollection}
                onDelete={handleDeleteCollection}
                onToggleVisibility={handleToggleVisibility}
              />
            ) : (
              <Card className="p-8 text-center">
                <div className="mb-4 text-4xl">📚</div>
                <h3 className="text-lg font-medium mb-2">No Collections Yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Create your first collection to organize your favorite movies by theme, genre, or any way you like.
                </p>
                <Button
                  onClick={() => {
                    setEditingCollection(undefined)
                    setIsCollectionDialogOpen(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Collection
                </Button>
              </Card>
            )}

            <CollectionDialog
              open={isCollectionDialogOpen}
              onOpenChange={setIsCollectionDialogOpen}
              collection={editingCollection}
              onSave={handleSaveCollection}
            />
          </TabsContent>

          <TabsContent value="achievements">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Achievements</h2>
              <p className="text-muted-foreground">Track your progress and earn badges</p>
            </div>

            <AchievementsDisplay achievements={achievements} />
          </TabsContent>

          <TabsContent value="ratings">
            <Card>
              <CardHeader>
                <CardTitle>My Ratings</CardTitle>
                <CardDescription>Movies you've rated</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {popularMovies.slice(0, 5).map((movie) => (
                    <div
                      key={movie.id}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-card/60 transition-colors"
                    >
                      <Link href={`/members/movie/${movie.id}`} className="shrink-0">
                        <img
                          src={movie.posterUrl || "/placeholder.svg"}
                          alt={movie.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/members/movie/${movie.id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {movie.title}
                        </Link>
                        <div className="text-sm text-muted-foreground">{movie.year}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <RatingStars initialRating={Math.floor(Math.random() * 5) + 1} readOnly />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Ratings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="downloads">
            <Card>
              <CardHeader>
                <CardTitle>Download History</CardTitle>
                <CardDescription>Your recent downloads</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {popularMovies.slice(0, 3).map((movie) => (
                    <div
                      key={movie.id}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-card/60 transition-colors"
                    >
                      <Link href={`/members/movie/${movie.id}`} className="shrink-0">
                        <img
                          src={movie.posterUrl || "/placeholder.svg"}
                          alt={movie.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/members/movie/${movie.id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {movie.title}
                        </Link>
                        <div className="text-sm text-muted-foreground">
                          Downloaded on {new Date().toLocaleDateString()}
                        </div>
                      </div>

                      <Button variant="outline" size="sm">
                        Download Again
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Downloads
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
