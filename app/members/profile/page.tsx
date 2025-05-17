"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { RatingStars } from "@/components/rating-stars"
import { Plus } from "lucide-react"
import { supabaseClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

// Import the new components and data
import { CollectionsGrid } from "@/components/collections-grid"
import { CollectionDialog } from "@/components/collection-dialog"
import { AchievementsDisplay } from "@/components/achievements-display"
import { getUserCollections } from "@/lib/collections-data"
import { getUserAchievements } from "@/lib/achievements-data"
import type { Collection } from "@/lib/collections-data"

export default function ProfilePage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([])
  const [achievements] = useState(getUserAchievements("user1"))
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false)
  const [editingCollection, setEditingCollection] = useState<Collection | undefined>(undefined)
  const [userData, setUserData] = useState<{
    username: string;
    email: string;
    bio: string;
    country: string;
    language: string;
    avatar_url?: string;
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [ratedMovies, setRatedMovies] = useState<any[]>([])
  const [downloadedMovies, setDownloadedMovies] = useState<any[]>([])

  useEffect(() => {
    async function loadUserData() {
      try {
        const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
        
        if (userError || !user) {
          toast({
            title: "Error",
            description: "Please log in to view your profile",
            variant: "destructive",
          })
          router.push("/login")
          return
        }

        // Get user profile data
        const { data: profile, error: profileError } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) {
          // If profile doesn't exist, create one
          if (profileError.code === 'PGRST116') {
            const { data: newProfile, error: createError } = await supabaseClient
              .from('profiles')
              .insert({
                id: user.id,
                username: user.user_metadata.username || user.email?.split('@')[0] || 'Anonymous',
                bio: '',
                country: '',
                language: 'English',
                avatar_url: user.user_metadata.avatar_url,
              })
              .select()
              .single()

            if (createError) {
              console.error('Error creating profile:', createError)
              return
            }

            setUserData({
              username: newProfile.username,
              email: user.email || '',
              bio: newProfile.bio || '',
              country: newProfile.country || '',
              language: newProfile.language || 'English',
              avatar_url: newProfile.avatar_url,
            })
          } else {
            console.error('Error loading profile:', profileError)
            return
          }
        } else {
          setUserData({
            username: profile.username,
            email: user.email || '',
            bio: profile.bio || '',
            country: profile.country || '',
            language: profile.language || 'English',
            avatar_url: profile.avatar_url,
          })
        }

        // Load collections
        const { data: userCollections, error: collectionsError } = await supabaseClient
          .from('collections')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (collectionsError) {
          console.error('Error loading collections:', collectionsError)
        } else {
          setCollections(userCollections || [])
        }

        // Load rated movies with error handling
        try {
          const { data: ratings, error: ratingsError } = await supabaseClient
            .from('ratings')
            .select(`
              id,
              rating,
              created_at,
              movies:movie_id (
                id,
                title,
                poster_url,
                year
              )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5)

          if (ratingsError) {
            // If the table doesn't exist yet, just set empty array
            if (ratingsError.code === '42P01') { // Table doesn't exist
              setRatedMovies([])
            } else {
              console.error('Error loading ratings:', ratingsError)
              setRatedMovies([])
            }
          } else {
            setRatedMovies(ratings || [])
          }
        } catch (error) {
          console.error('Error in ratings query:', error)
          setRatedMovies([])
        }

        // Load downloaded movies with error handling
        try {
          const { data: downloads, error: downloadsError } = await supabaseClient
            .from('downloads')
            .select(`
              id,
              created_at,
              movies:movie_id (
                id,
                title,
                poster_url,
                year
              )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(3)

          if (downloadsError) {
            // If the table doesn't exist yet, just set empty array
            if (downloadsError.code === '42P01') { // Table doesn't exist
              setDownloadedMovies([])
            } else {
              console.error('Error loading downloads:', downloadsError)
              setDownloadedMovies([])
            }
          } else {
            setDownloadedMovies(downloads || [])
          }
        } catch (error) {
          console.error('Error in downloads query:', error)
          setDownloadedMovies([])
        }

      } catch (error) {
        console.error('Error:', error)
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [toast, router])

  const handleSaveProfile = async () => {
    try {
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
      
      if (userError || !user) {
        toast({
          title: "Error",
          description: "You must be logged in to update your profile",
          variant: "destructive",
        })
        return
      }

      const { error: updateError } = await supabaseClient
        .from('profiles')
        .upsert({
          id: user.id,
          username: userData?.username,
          bio: userData?.bio,
          country: userData?.country,
          language: userData?.language,
          updated_at: new Date().toISOString(),
        })

      if (updateError) {
        throw updateError
      }

      setIsEditing(false)
      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    }
  }

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection)
    setIsCollectionDialogOpen(true)
  }

  const handleDeleteCollection = async (collection: Collection) => {
    try {
      const { error } = await supabaseClient
        .from('collections')
        .delete()
        .eq('id', collection.id)

      if (error) throw error

    setCollections(collections.filter((c) => c.id !== collection.id))
    toast({
        title: "Success",
      description: `"${collection.name}" has been deleted.`,
    })
    } catch (error) {
      console.error('Error deleting collection:', error)
      toast({
        title: "Error",
        description: "Failed to delete collection",
        variant: "destructive",
      })
    }
  }

  const handleToggleVisibility = async (collection: Collection) => {
    try {
      const { error } = await supabaseClient
        .from('collections')
        .update({ is_public: !collection.isPublic })
        .eq('id', collection.id)

      if (error) throw error

      setCollections(collections.map((c) => 
        c.id === collection.id ? { ...c, isPublic: !c.isPublic } : c
      ))

    toast({
        title: "Success",
      description: `"${collection.name}" visibility has been updated.`,
    })
    } catch (error) {
      console.error('Error updating collection visibility:', error)
      toast({
        title: "Error",
        description: "Failed to update collection visibility",
        variant: "destructive",
      })
    }
  }

  const handleSaveCollection = async (collectionData: Partial<Collection>) => {
    try {
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
      
      if (userError || !user) {
        toast({
          title: "Error",
          description: "You must be logged in to manage collections",
          variant: "destructive",
        })
        return
      }

    if (editingCollection) {
      // Update existing collection
        const { error } = await supabaseClient
          .from('collections')
          .update({
            name: collectionData.name,
            description: collectionData.description,
            is_public: collectionData.isPublic,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingCollection.id)

        if (error) throw error

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

      toast({
          title: "Success",
        description: `"${collectionData.name}" has been updated.`,
      })
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
          })
          .select()
          .single()

        if (error) throw error

        setCollections([data, ...collections])
      toast({
          title: "Success",
          description: `"${data.name}" has been created.`,
      })
    }

    setEditingCollection(undefined)
      setIsCollectionDialogOpen(false)
    } catch (error) {
      console.error('Error saving collection:', error)
      toast({
        title: "Error",
        description: "Failed to save collection",
        variant: "destructive",
      })
    }
  }

  const renderRatingsTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>My Ratings</CardTitle>
        <CardDescription>Movies you've rated</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {ratedMovies.length > 0 ? (
            ratedMovies.map((rating) => (
              <div
                key={rating.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-card/60 transition-colors"
              >
                <Link href={`/members/movie/${rating.movies.id}`} className="shrink-0">
                  <img
                    src={rating.movies.poster_url || "/placeholder.svg"}
                    alt={rating.movies.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/members/movie/${rating.movies.id}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {rating.movies.title}
                  </Link>
                  <div className="text-sm text-muted-foreground">{rating.movies.year}</div>
                </div>

                <div className="flex items-center gap-2">
                  <RatingStars initialRating={rating.rating} readOnly />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No ratings yet
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Ratings
        </Button>
      </CardFooter>
    </Card>
  )

  const renderDownloadsTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Download History</CardTitle>
        <CardDescription>Your recent downloads</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {downloadedMovies.length > 0 ? (
            downloadedMovies.map((download) => (
              <div
                key={download.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-card/60 transition-colors"
              >
                <Link href={`/members/movie/${download.movies.id}`} className="shrink-0">
                  <img
                    src={download.movies.poster_url || "/placeholder.svg"}
                    alt={download.movies.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/members/movie/${download.movies.id}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {download.movies.title}
                  </Link>
                  <div className="text-sm text-muted-foreground">
                    Downloaded on {new Date(download.created_at).toLocaleDateString()}
                  </div>
                </div>

                <Button variant="outline" size="sm">
                  Download Again
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No downloads yet
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Downloads
        </Button>
      </CardFooter>
    </Card>
  )

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-pulse">Loading profile...</div>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-500">Failed to load profile data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-20 w-20 border-2 border-primary">
            <AvatarImage src={userData.avatar_url || "/placeholder.svg?height=80&width=80"} alt={userData.username} />
            <AvatarFallback>{userData.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-3xl font-bold">{userData.username}</h1>
            <p className="text-muted-foreground">Member since {new Date().toLocaleDateString()}</p>
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
                    <Input 
                      id="username" 
                      value={userData.username}
                      onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                      disabled={!isEditing} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={userData.email}
                      disabled={true} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input 
                    id="bio" 
                    value={userData.bio}
                    onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                    disabled={!isEditing} 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input 
                      id="country" 
                      value={userData.country}
                      onChange={(e) => setUserData({ ...userData, country: e.target.value })}
                      disabled={!isEditing} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    <Input 
                      id="language" 
                      value={userData.language}
                      onChange={(e) => setUserData({ ...userData, language: e.target.value })}
                      disabled={!isEditing} 
                    />
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
            {renderRatingsTab()}
          </TabsContent>

          <TabsContent value="downloads">
            {renderDownloadsTab()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
