-- Create collections table if it doesn't exist
CREATE TABLE IF NOT EXISTS collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    is_public BOOLEAN DEFAULT false,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add gradient background fields to collections table if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'collections' AND column_name = 'gradient_color1') THEN
        ALTER TABLE collections ADD COLUMN gradient_color1 TEXT DEFAULT '#000000';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'collections' AND column_name = 'gradient_color2') THEN
        ALTER TABLE collections ADD COLUMN gradient_color2 TEXT DEFAULT '#000000';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'collections' AND column_name = 'gradient_angle') THEN
        ALTER TABLE collections ADD COLUMN gradient_angle INTEGER DEFAULT 45;
    END IF;
END $$;

-- Update existing collections to have default gradient values
UPDATE collections
SET gradient_color1 = '#1a1a1a',
    gradient_color2 = '#2a2a2a',
    gradient_angle = 45
WHERE gradient_color1 IS NULL;

-- Add comment to explain the gradient fields if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_description WHERE objsubid = (SELECT ordinal_position FROM information_schema.columns WHERE table_name = 'collections' AND column_name = 'gradient_color1')) THEN
        COMMENT ON COLUMN collections.gradient_color1 IS 'First color for the collection background gradient';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_description WHERE objsubid = (SELECT ordinal_position FROM information_schema.columns WHERE table_name = 'collections' AND column_name = 'gradient_color2')) THEN
        COMMENT ON COLUMN collections.gradient_color2 IS 'Second color for the collection background gradient';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_description WHERE objsubid = (SELECT ordinal_position FROM information_schema.columns WHERE table_name = 'collections' AND column_name = 'gradient_angle')) THEN
        COMMENT ON COLUMN collections.gradient_angle IS 'Angle of the gradient in degrees (0-360)';
    END IF;
END $$;

-- Create movies table if it doesn't exist
CREATE TABLE IF NOT EXISTS movies (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    poster_url TEXT,
    year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create collection_movies junction table if it doesn't exist
CREATE TABLE IF NOT EXISTS collection_movies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
    movie_id TEXT REFERENCES movies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(collection_id, movie_id)
);

-- Enable Row Level Security if not already enabled
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'collections' AND rowsecurity = true) THEN
        ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'collection_movies' AND rowsecurity = true) THEN
        ALTER TABLE collection_movies ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'movies' AND rowsecurity = true) THEN
        ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create policies if they don't exist
DO $$ 
BEGIN
    -- Collections policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'collections' AND policyname = 'Users can view public collections') THEN
        CREATE POLICY "Users can view public collections"
            ON collections FOR SELECT
            USING (is_public = true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'collections' AND policyname = 'Users can view their own collections') THEN
        CREATE POLICY "Users can view their own collections"
            ON collections FOR SELECT
            USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'collections' AND policyname = 'Users can create collections') THEN
        CREATE POLICY "Users can create collections"
            ON collections FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'collections' AND policyname = 'Users can update their own collections') THEN
        CREATE POLICY "Users can update their own collections"
            ON collections FOR UPDATE
            USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'collections' AND policyname = 'Users can delete their own collections') THEN
        CREATE POLICY "Users can delete their own collections"
            ON collections FOR DELETE
            USING (auth.uid() = user_id);
    END IF;

    -- Collection movies policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'collection_movies' AND policyname = 'Users can view movies in public collections') THEN
        CREATE POLICY "Users can view movies in public collections"
            ON collection_movies FOR SELECT
            USING (EXISTS (
                SELECT 1 FROM collections
                WHERE collections.id = collection_movies.collection_id
                AND collections.is_public = true
            ));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'collection_movies' AND policyname = 'Users can view movies in their collections') THEN
        CREATE POLICY "Users can view movies in their collections"
            ON collection_movies FOR SELECT
            USING (EXISTS (
                SELECT 1 FROM collections
                WHERE collections.id = collection_movies.collection_id
                AND collections.user_id = auth.uid()
            ));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'collection_movies' AND policyname = 'Users can add movies to their collections') THEN
        CREATE POLICY "Users can add movies to their collections"
            ON collection_movies FOR INSERT
            WITH CHECK (EXISTS (
                SELECT 1 FROM collections
                WHERE collections.id = collection_movies.collection_id
                AND collections.user_id = auth.uid()
            ));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'collection_movies' AND policyname = 'Users can remove movies from their collections') THEN
        CREATE POLICY "Users can remove movies from their collections"
            ON collection_movies FOR DELETE
            USING (EXISTS (
                SELECT 1 FROM collections
                WHERE collections.id = collection_movies.collection_id
                AND collections.user_id = auth.uid()
            ));
    END IF;

    -- Movies policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'movies' AND policyname = 'Anyone can view movies') THEN
        CREATE POLICY "Anyone can view movies"
            ON movies FOR SELECT
            USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'movies' AND policyname = 'Authenticated users can insert movies') THEN
        CREATE POLICY "Authenticated users can insert movies"
            ON movies FOR INSERT
            WITH CHECK (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'movies' AND policyname = 'Authenticated users can update movies') THEN
        CREATE POLICY "Authenticated users can update movies"
            ON movies FOR UPDATE
            USING (auth.role() = 'authenticated');
    END IF;
END $$; 