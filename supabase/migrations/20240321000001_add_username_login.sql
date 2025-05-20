-- Create a function to get user by username or email
CREATE OR REPLACE FUNCTION get_user_by_username_or_email(login TEXT)
RETURNS TABLE (
    id UUID,
    email TEXT,
    username TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        au.id,
        au.email,
        p.username
    FROM auth.users au
    JOIN profiles p ON p.id = au.id
    WHERE 
        p.username = login OR 
        au.email = login;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to sign in with username or email
CREATE OR REPLACE FUNCTION sign_in_with_username_or_email(
    login TEXT,
    password TEXT
)
RETURNS TABLE (
    id UUID,
    email TEXT,
    username TEXT,
    access_token TEXT,
    refresh_token TEXT
) AS $$
DECLARE
    user_data RECORD;
    auth_data RECORD;
BEGIN
    -- Get user by username or email
    SELECT * INTO user_data
    FROM get_user_by_username_or_email(login);

    IF user_data IS NULL THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    -- Sign in with email
    SELECT * INTO auth_data
    FROM auth.sign_in_with_password(
        email := user_data.email,
        password := password
    );

    RETURN QUERY
    SELECT 
        user_data.id,
        user_data.email,
        user_data.username,
        auth_data.access_token,
        auth_data.refresh_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 