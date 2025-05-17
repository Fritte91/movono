-- First, let's ensure all movies from collection_movies exist in the movies table
INSERT INTO movies (id, title, poster_url, year)
SELECT DISTINCT 
    cm.movie_id,
    cm.movie_id as title, -- Temporary title, will be updated when movie is loaded
    NULL as poster_url,
    NULL::integer as year
FROM collection_movies cm
LEFT JOIN movies m ON cm.movie_id = m.id
WHERE m.id IS NULL;

-- Update the collection_movies table to ensure proper references
UPDATE collection_movies cm
SET movie_id = m.id
FROM movies m
WHERE cm.movie_id = m.id;

-- Add any missing foreign key constraints
DO $$ 
BEGIN
    -- Add foreign key constraint to collection_movies if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'collection_movies_movie_id_fkey'
    ) THEN
        ALTER TABLE collection_movies
        ADD CONSTRAINT collection_movies_movie_id_fkey
        FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE;
    END IF;

    -- Add foreign key constraint to ratings if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'ratings_movie_id_fkey'
    ) THEN
        ALTER TABLE ratings
        ADD CONSTRAINT ratings_movie_id_fkey
        FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE;
    END IF;

    -- Add foreign key constraint to downloads if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'downloads_movie_id_fkey'
    ) THEN
        ALTER TABLE downloads
        ADD CONSTRAINT downloads_movie_id_fkey
        FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE;
    END IF;
END $$; 