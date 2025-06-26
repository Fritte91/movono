-- Add YTS-specific fields to movies_mini table
ALTER TABLE movies_mini 
ADD COLUMN IF NOT EXISTS yts_id INTEGER,
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS torrents JSONB,
ADD COLUMN IF NOT EXISTS yt_trailer_code TEXT,
ADD COLUMN IF NOT EXISTS mpa_rating TEXT,
ADD COLUMN IF NOT EXISTS background_image TEXT,
ADD COLUMN IF NOT EXISTS date_uploaded TEXT,
ADD COLUMN IF NOT EXISTS date_uploaded_unix BIGINT;

-- Add index for better performance on YTS lookups
CREATE INDEX IF NOT EXISTS idx_movies_mini_yts_id ON movies_mini(yts_id);
CREATE INDEX IF NOT EXISTS idx_movies_mini_source ON movies_mini(source);
CREATE INDEX IF NOT EXISTS idx_movies_mini_date_uploaded ON movies_mini(date_uploaded_unix);

-- Add comment to document the new fields
COMMENT ON COLUMN movies_mini.yts_id IS 'YTS movie ID for direct linking';
COMMENT ON COLUMN movies_mini.source IS 'Source of the movie data: manual, tmdb, yts';
COMMENT ON COLUMN movies_mini.torrents IS 'JSON array of torrent information from YTS';
COMMENT ON COLUMN movies_mini.yt_trailer_code IS 'YouTube trailer code from YTS';
COMMENT ON COLUMN movies_mini.mpa_rating IS 'MPA rating from YTS';
COMMENT ON COLUMN movies_mini.background_image IS 'Background image URL from YTS';
COMMENT ON COLUMN movies_mini.date_uploaded IS 'Date uploaded to YTS';
COMMENT ON COLUMN movies_mini.date_uploaded_unix IS 'Unix timestamp of upload date'; 