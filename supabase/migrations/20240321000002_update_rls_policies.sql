-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;

-- Create new policies
CREATE POLICY "Users can view all profiles"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Allow profile creation during signup
CREATE POLICY "Enable insert for authenticated users only"
    ON profiles FOR INSERT
    WITH CHECK (true);  -- Temporarily allow all inserts for testing

-- Create a function to check if a username is taken
CREATE OR REPLACE FUNCTION is_username_taken(username_to_check TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE username = username_to_check
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 