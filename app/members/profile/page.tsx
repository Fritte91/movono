"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { RatingStars } from "@/components/rating-stars"
import { Plus } from "lucide-react"
import { supabase } from '@/lib/supabase-client'
import { useRouter, useSearchParams } from "next/navigation"

// Import the new components and data
import { CollectionsGrid } from "@/components/collections-grid"
import { CollectionDialog } from "@/components/collection-dialog"
import { AchievementsDisplay } from "@/components/achievements-display"
import { MovieSyncStatus } from "@/components/movie-sync-status"
import { getUserCollections } from "@/lib/collections-data"
import { getUserAchievements } from "@/lib/achievements-data"
import type { Collection } from "@/lib/collections-data"

export default function ProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile'; // Get tab from query or default to 'profile'
  const [isEditing, setIsEditing] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([])
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false)
  const [editingCollection, setEditingCollection] = useState<Collection | undefined>(undefined)
  const [userData, setUserData] = useState<{
    username: string;
    email: string;
    bio: string;
    country: string;
    language: string;
    avatar_url?: string;
    id?: string;
  } | null>(null)
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [ratedMovies, setRatedMovies] = useState<any[]>([])
  const [downloadedMovies, setDownloadedMovies] = useState<any[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    async function loadUserData() {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          router.push("/login")
          return
        }

        setUserId(user.id)

        // Get user profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) {
          // If profile doesn't exist, create one
          if (profileError.code === 'PGRST116') {
            const { data: newProfile, error: createError } = await supabase
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
              console.error('Error creating profile:', createError.message)
              return
            }

            if (newProfile && typeof newProfile === 'object' && 'username' in newProfile) {
              const np: any = newProfile;
              setUserData({
                username: np.username,
                email: user.email || '',
                bio: np.bio || '',
                country: np.country || '',
                language: np.language || 'English',
                avatar_url: np.avatar_url,
              })
              setSelectedAvatarUrl(np.avatar_url || "/placeholder.svg")
            }
          } else {
            console.error('Error loading profile:', profileError.message)
            return
          }
        } else {
          const p: any = profile;
          setUserData({
            username: p.username,
            email: user.email || '',
            bio: p.bio || '',
            country: p.country || '',
            language: p.language || 'English',
            avatar_url: p.avatar_url,
          })
          setSelectedAvatarUrl(p.avatar_url || "/placeholder.svg")
        }

        // Load collections with movies count
        const { data: userCollections, error: collectionsError } = await supabase
          .from('collections')
          .select(`
            *,
            collection_movies!collection_movies_collection_id_fkey (
              movie_imdb_id,
              movies_mini (
                imdb_id,
                title,
                poster_url,
                year
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (collectionsError) {
          console.error('Error loading collections:', collectionsError.message)
        } else {
          // Transform the data to include movies array and proper date objects
          const collectionsWithMovies = userCollections?.map(col => {
            const collection: any = col;
            const base: any = (collection && typeof collection === 'object' && !Array.isArray(collection)) ? collection : {};
            return {
              id: base.id,
              name: base.name,
              description: base.description,
              coverImage: base.cover_image,
              isPublic: base.is_public,
              createdAt: base.created_at ? new Date(base.created_at) : new Date(),
              updatedAt: base.updated_at ? new Date(base.updated_at) : new Date(),
              userId: base.user_id,
              movies: base.collection_movies || [],
              gradientColor1: base.gradient_color1,
              gradientColor2: base.gradient_color2,
              gradientAngle: base.gradient_angle,
            };
          }) || []
          setCollections(collectionsWithMovies)
        }

        // Try to get user ratings
        try {
          const { data: ratings, error: ratingsError } = await supabase
            .from('ratings')
            .select('*')
            .eq('user_id', user.id);

          if (ratingsError) {
            // Ratings table might not exist yet
          } else {
            setRatedMovies(ratings || []);
          }
        } catch (error) {
          // Ratings table not found, skipping...
        }

        // Try to get user downloads
        try {
          const { data: downloads, error: downloadsError } = await supabase
            .from('downloads')
            .select('*')
            .eq('user_id', user.id);

          if (downloadsError) {
            // Downloads table might not exist yet
          } else {
            setDownloadedMovies(downloads || []);
          }
        } catch (error) {
          // Downloads table not found, skipping...
        }

      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [router])

  const handleSaveProfile = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        return
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: userData?.username,
          bio: userData?.bio,
          country: userData?.country,
          language: userData?.language,
          avatar_url: selectedAvatarUrl,
          updated_at: new Date().toISOString(),
        })

      if (updateError) {
        throw updateError
      }

      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection)
    setIsCollectionDialogOpen(true)
  }

  const handleDeleteCollection = async (collection: Collection) => {
    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', collection.id)

      if (error) throw error

    setCollections(collections.filter((c) => c.id !== collection.id))
    } catch (error) {
      console.error('Error deleting collection:', error)
    }
  }

  const handleToggleVisibility = async (collection: Collection) => {
    try {
      const { error } = await supabase
        .from('collections')
        .update({ is_public: !collection.isPublic })
        .eq('id', collection.id)

      if (error) throw error

      setCollections(collections.map((c) => 
        c.id === collection.id ? { ...c, isPublic: !c.isPublic } : c
      ))

    } catch (error) {
      console.error('Error updating collection visibility:', error)
    }
  }

  const handleSaveCollection = async (collectionData: Partial<Collection>) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        return
      }

    if (editingCollection) {
      // Update existing collection
        const { error } = await supabase
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

      } else {
        // Create new collection
        const { data, error } = await supabase
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

        if (data && typeof data === 'object') {
          const d: any = data;
          setCollections([
            {
              id: d.id,
              name: d.name,
              description: d.description,
              coverImage: d.cover_image,
              isPublic: d.is_public,
              createdAt: d.created_at ? new Date(d.created_at) : new Date(),
              updatedAt: d.updated_at ? new Date(d.updated_at) : new Date(),
              userId: d.user_id,
              movies: [],
              gradientColor1: d.gradient_color1,
              gradientColor2: d.gradient_color2,
              gradientAngle: d.gradient_angle,
            },
            ...((Array.isArray(collections) ? collections : []))
          ]);
        }
      }

    setEditingCollection(undefined)
      setIsCollectionDialogOpen(false)
    } catch (error) {
      console.error('Error saving collection:', error)
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
                <Link href={`/members/movie/${rating.movie_imdb_id}`} className="shrink-0">
                  <img
                    src={rating.movies_mini?.poster_url || "/placeholder.svg"}
                    alt={rating.movies_mini?.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/members/movie/${rating.movie_imdb_id}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {rating.movies_mini?.title}
                  </Link>
                  <div className="text-sm text-muted-foreground">{rating.movies_mini?.year}</div>
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
                <Link href={`/members/movie/${download.movie_imdb_id}`} className="shrink-0">
                  <img
                    src={download.movies_mini?.poster_url || "/placeholder.svg"}
                    alt={download.movies_mini?.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/members/movie/${download.movie_imdb_id}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {download.movies_mini?.title}
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
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl font-bold">Profile</h1>
      
      <Tabs defaultValue="achievements" className="space-y-4">
        <TabsList>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="sync">Movie Sync</TabsTrigger>
        </TabsList>
        
        <TabsContent value="achievements" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Your Achievements</h2>
            {userId && <AchievementsDisplay userId={userId} />}
          </Card>
        </TabsContent>
        
        <TabsContent value="profile">
          <Card className="p-6 max-w-xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            {userData && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  // Save profile logic (reuse your previous save handler)
                  // ...
                }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={selectedAvatarUrl || userData.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>{userData.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor="avatar">Avatar URL</Label>
                    <Input
                      id="avatar"
                      type="url"
                      value={selectedAvatarUrl || ""}
                      onChange={e => setSelectedAvatarUrl(e.target.value)}
                      placeholder="Paste image URL..."
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={userData.username}
                    onChange={e => setUserData({ ...userData, username: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    value={userData.bio}
                    onChange={e => setUserData({ ...userData, bio: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={userData.country}
                    onChange={e => setUserData({ ...userData, country: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    value={userData.language}
                    onChange={e => setUserData({ ...userData, language: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <div className="bg-muted px-3 py-2 rounded text-muted-foreground">{userData.email}</div>
                </div>
                <Button type="submit" className="w-full">Save Profile</Button>
              </form>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="collections">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">My Collections</h2>
              <Button onClick={() => setIsCollectionDialogOpen(true)}>
                + New Collection
              </Button>
            </div>
            <CollectionsGrid
              collections={collections}
              onEdit={handleEditCollection}
              onDelete={handleDeleteCollection}
              onToggleVisibility={handleToggleVisibility}
            />
            <CollectionDialog
              open={isCollectionDialogOpen}
              onOpenChange={setIsCollectionDialogOpen}
              onSave={handleSaveCollection}
              collection={editingCollection}
            />
          </Card>
        </TabsContent>
        
        <TabsContent value="downloads">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Download History</h2>
              <div className="space-y-4">
                {downloadedMovies.length > 0 ? (
                  downloadedMovies.map((download) => (
                    <div
                      key={download.id}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-card/60 transition-colors"
                    >
                      <Link href={`/members/movie/${download.movie_imdb_id}`} className="shrink-0">
                        <img
                          src={download.movies_mini?.poster_url || "/placeholder.svg"}
                          alt={download.movies_mini?.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/members/movie/${download.movie_imdb_id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {download.movies_mini?.title}
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
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="ratings">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">My Ratings</h2>
              <div className="space-y-4">
                {ratedMovies.length > 0 ? (
                  ratedMovies.map((rating) => (
                    <div
                      key={rating.id}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-card/60 transition-colors"
                    >
                      <Link href={`/members/movie/${rating.movie_imdb_id}`} className="shrink-0">
                        <img
                          src={rating.movies_mini?.poster_url || "/placeholder.svg"}
                          alt={rating.movies_mini?.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/members/movie/${rating.movie_imdb_id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {rating.movies_mini?.title}
                        </Link>
                        <div className="text-sm text-muted-foreground">{rating.movies_mini?.year}</div>
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
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          {/* Restore your activity UI here */}
        </TabsContent>
        
        <TabsContent value="settings">
          {/* Restore your settings UI here */}
        </TabsContent>
        
        <TabsContent value="sync">
          <div className="flex justify-center">
            <MovieSyncStatus />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
