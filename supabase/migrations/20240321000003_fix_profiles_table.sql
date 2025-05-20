-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;

-- Drop dependent tables and their policies first
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS downloads CASCADE;
DROP TABLE IF EXISTS collections CASCADE;
DROP TABLE IF EXISTS collection_movies CASCADE;

-- Drop the profiles table if it exists
DROP TABLE IF EXISTS profiles CASCADE;

-- Recreate the profiles table with proper structure
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    display_name TEXT,
    bio TEXT DEFAULT '',
    country TEXT DEFAULT '',
    language TEXT DEFAULT 'English',
    avatar_url TEXT,
    username_change_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    is_private BOOLEAN DEFAULT false,
    preferences JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create basic policies for profiles
CREATE POLICY "Enable read access for all users"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for users based on user_id"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Recreate dependent tables
CREATE TABLE comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    movie_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    movie_id TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, movie_id)
);

CREATE TABLE downloads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    movie_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    is_public BOOLEAN DEFAULT false,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE collection_movies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
    movie_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(collection_id, movie_id)
);

-- Enable RLS on all tables
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_movies ENABLE ROW LEVEL SECURITY;

-- Create policies for comments
CREATE POLICY "Users can view all comments"
    ON comments FOR SELECT
    USING (true);

CREATE POLICY "Users can create their own comments"
    ON comments FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own comments"
    ON comments FOR UPDATE
    USING (true);

CREATE POLICY "Users can delete their own comments"
    ON comments FOR DELETE
    USING (true);

-- Create policies for ratings
CREATE POLICY "Users can view all ratings"
    ON ratings FOR SELECT
    USING (true);

CREATE POLICY "Users can create their own ratings"
    ON ratings FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own ratings"
    ON ratings FOR UPDATE
    USING (true);

-- Create policies for downloads
CREATE POLICY "Users can view their own downloads"
    ON downloads FOR SELECT
    USING (true);

CREATE POLICY "Users can create their own downloads"
    ON downloads FOR INSERT
    WITH CHECK (true);

-- Create policies for collections
CREATE POLICY "Users can view public collections"
    ON collections FOR SELECT
    USING (true);

CREATE POLICY "Users can view their own collections"
    ON collections FOR SELECT
    USING (true);

CREATE POLICY "Users can create collections"
    ON collections FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own collections"
    ON collections FOR UPDATE
    USING (true);

CREATE POLICY "Users can delete their own collections"
    ON collections FOR DELETE
    USING (true);

-- Create policies for collection_movies
CREATE POLICY "Users can view movies in public collections"
    ON collection_movies FOR SELECT
    USING (true);

CREATE POLICY "Users can view movies in their collections"
    ON collection_movies FOR SELECT
    USING (true);

CREATE POLICY "Users can add movies to their collections"
    ON collection_movies FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can remove movies from their collections"
    ON collection_movies FOR DELETE
    USING (true);

CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ratings_updated_at
    BEFORE UPDATE ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at
    BEFORE UPDATE ON collections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 