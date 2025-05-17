-- Create movies table first (if it doesn't exist)
CREATE TABLE IF NOT EXISTS movies (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    poster_url TEXT,
    year INTEGER,
    imdb_id TEXT,
    genre TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    is_public BOOLEAN DEFAULT false,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create collection_movies junction table
CREATE TABLE IF NOT EXISTS collection_movies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
    movie_id TEXT REFERENCES movies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(collection_id, movie_id)
);

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    movie_id TEXT REFERENCES movies(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, movie_id)
);

-- Create downloads table
CREATE TABLE IF NOT EXISTS downloads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    movie_id TEXT REFERENCES movies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view movies" ON movies;
DROP POLICY IF EXISTS "Only authenticated users can insert movies" ON movies;
DROP POLICY IF EXISTS "Users can view public collections" ON collections;
DROP POLICY IF EXISTS "Users can view their own collections" ON collections;
DROP POLICY IF EXISTS "Users can create collections" ON collections;
DROP POLICY IF EXISTS "Users can update their own collections" ON collections;
DROP POLICY IF EXISTS "Users can delete their own collections" ON collections;
DROP POLICY IF EXISTS "Users can view movies in public collections" ON collection_movies;
DROP POLICY IF EXISTS "Users can view movies in their collections" ON collection_movies;
DROP POLICY IF EXISTS "Users can add movies to their collections" ON collection_movies;
DROP POLICY IF EXISTS "Users can remove movies from their collections" ON collection_movies;
DROP POLICY IF EXISTS "Users can view all ratings" ON ratings;
DROP POLICY IF EXISTS "Users can create their own ratings" ON ratings;
DROP POLICY IF EXISTS "Users can update their own ratings" ON ratings;
DROP POLICY IF EXISTS "Users can view their own downloads" ON downloads;
DROP POLICY IF EXISTS "Users can create their own downloads" ON downloads;

-- Create new policies
CREATE POLICY "Anyone can view movies"
    ON movies FOR SELECT
    USING (true);

CREATE POLICY "Only authenticated users can insert movies"
    ON movies FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view public collections"
    ON collections FOR SELECT
    USING (is_public = true);

CREATE POLICY "Users can view their own collections"
    ON collections FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create collections"
    ON collections FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections"
    ON collections FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections"
    ON collections FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view movies in public collections"
    ON collection_movies FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM collections
        WHERE collections.id = collection_movies.collection_id
        AND collections.is_public = true
    ));

CREATE POLICY "Users can view movies in their collections"
    ON collection_movies FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM collections
        WHERE collections.id = collection_movies.collection_id
        AND collections.user_id = auth.uid()
    ));

CREATE POLICY "Users can add movies to their collections"
    ON collection_movies FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM collections
        WHERE collections.id = collection_movies.collection_id
        AND collections.user_id = auth.uid()
    ));

CREATE POLICY "Users can remove movies from their collections"
    ON collection_movies FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM collections
        WHERE collections.id = collection_movies.collection_id
        AND collections.user_id = auth.uid()
    ));

CREATE POLICY "Users can view all ratings"
    ON ratings FOR SELECT
    USING (true);

CREATE POLICY "Users can create their own ratings"
    ON ratings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
    ON ratings FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own downloads"
    ON downloads FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own downloads"
    ON downloads FOR INSERT
    WITH CHECK (auth.uid() = user_id); 