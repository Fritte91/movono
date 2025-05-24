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
import { supabaseClient } from "@/lib/supabase"
import { useRouter, useSearchParams } from "next/navigation"

// Import the new components and data
import { CollectionsGrid } from "@/components/collections-grid"
import { CollectionDialog } from "@/components/collection-dialog"
import { AchievementsDisplay } from "@/components/achievements-display"
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
        const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
        
        if (userError || !user) {
          router.push("/login")
          return
        }

        setUserId(user.id)

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
              console.error('Error creating profile:', createError.message)
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
            setSelectedAvatarUrl(newProfile.avatar_url || "/placeholder.svg")
          } else {
            console.error('Error loading profile:', profileError.message)
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
          setSelectedAvatarUrl(profile.avatar_url || "/placeholder.svg")
        }

        // Load collections with movies count
        const { data: userCollections, error: collectionsError } = await supabaseClient
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
          const collectionsWithMovies = userCollections?.map(collection => ({
            ...collection,
            id: collection.id,
            name: collection.name,
            description: collection.description,
            coverImage: collection.cover_image,
            isPublic: collection.is_public,
            createdAt: new Date(collection.created_at),
            updatedAt: new Date(collection.updated_at),
            userId: collection.user_id,
            movies: collection.collection_movies || [],
            gradientColor1: collection.gradient_color1,
            gradientColor2: collection.gradient_color2,
            gradientAngle: collection.gradient_angle,
          })) || []
          setCollections(collectionsWithMovies)
        }

        // Load rated movies with error handling
        try {
          const { data: ratings, error: ratingsError } = await supabaseClient
            .from('ratings')
            .select(`
              id,
              rating,
              created_at,
              movie_imdb_id,
              movies_mini:movies_mini!inner(imdb_id, title, poster_url, year)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5)

          if (ratingsError) {
            if (ratingsError.code === '42P01') { // Table doesn't exist
              console.log('Ratings table not found, skipping...')
              setRatedMovies([])
            } else {
              console.error('Error loading ratings:', ratingsError.message)
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
              movie_imdb_id,
              movies_mini(imdb_id, title, poster_url, year)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(3)

          if (downloadsError) {
            if (downloadsError.code === '42P01') { // Table doesn't exist
              console.log('Downloads table not found, skipping...')
              setDownloadedMovies([])
            } else {
              console.error('Error loading downloads:', downloadsError.message)
              setDownloadedMovies([])
            }
          } else {
            setDownloadedMovies(downloads || [])
            console.log('Downloaded movies:', downloads);
          }
        } catch (error) {
          console.error('Error in downloads query:', error)
          setDownloadedMovies([])
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
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
      
      if (userError || !user) {
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
      const { error } = await supabaseClient
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
      const { error } = await supabaseClient
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
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
      
      if (userError || !user) {
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
              editingCollection={editingCollection}
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
      </Tabs>
    </div>
  )
}
