-- Drop existing foreign key constraints
ALTER TABLE collection_movies DROP CONSTRAINT IF EXISTS collection_movies_movie_id_fkey;
ALTER TABLE ratings DROP CONSTRAINT IF EXISTS ratings_movie_id_fkey;
ALTER TABLE downloads DROP CONSTRAINT IF EXISTS downloads_movie_id_fkey;

-- Rename columns to use movie_imdb_id
ALTER TABLE collection_movies RENAME COLUMN movie_id TO movie_imdb_id;
ALTER TABLE ratings RENAME COLUMN movie_id TO movie_imdb_id;
ALTER TABLE downloads RENAME COLUMN movie_id TO movie_imdb_id;

-- Add NOT NULL constraint to movie_imdb_id columns
ALTER TABLE collection_movies ALTER COLUMN movie_imdb_id SET NOT NULL;
ALTER TABLE ratings ALTER COLUMN movie_imdb_id SET NOT NULL;
ALTER TABLE downloads ALTER COLUMN movie_imdb_id SET NOT NULL;

-- Update unique constraints
ALTER TABLE collection_movies DROP CONSTRAINT IF EXISTS collection_movies_collection_id_movie_id_key;
ALTER TABLE collection_movies ADD CONSTRAINT collection_movies_collection_id_movie_imdb_id_key UNIQUE (collection_id, movie_imdb_id);

ALTER TABLE ratings DROP CONSTRAINT IF EXISTS ratings_user_id_movie_id_key;
ALTER TABLE ratings ADD CONSTRAINT ratings_user_id_movie_imdb_id_key UNIQUE (user_id, movie_imdb_id);

-- Migrate existing data
UPDATE collection_movies cm
SET movie_imdb_id = m.imdb_id
FROM movies m
WHERE cm.movie_imdb_id = m.id;

UPDATE ratings r
SET movie_imdb_id = m.imdb_id
FROM movies m
WHERE r.movie_imdb_id = m.id;

UPDATE downloads d
SET movie_imdb_id = m.imdb_id
FROM movies m
WHERE d.movie_imdb_id = m.id; 