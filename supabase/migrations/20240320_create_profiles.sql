-- Drop existing triggers if they exist
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_username_change on public.profiles;

-- Drop existing functions if they exist
drop function if exists public.handle_new_user();
drop function if exists public.handle_username_change();

-- First, let's clean up any existing data
delete from auth.users where email = 'fredriklindberg1991@gmail.com';
delete from public.profiles where username = 'Freddy';

-- Drop the user_profiles table if it exists
drop table if exists public.user_profiles;

-- Drop and recreate the profiles table with proper structure
-- First, drop the foreign key constraints
alter table if exists public.comments drop constraint if exists comments_user_id_fkey;
alter table if exists public.ratings drop constraint if exists ratings_user_id_fkey;
alter table if exists public.downloads drop constraint if exists downloads_user_id_fkey;
alter table if exists public.collections drop constraint if exists collections_user_id_fkey;

-- Now we can safely drop the profiles table
drop table if exists public.profiles;

-- Recreate the profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text,
  bio text,
  country text,
  language text default 'English',
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Recreate the foreign key constraints
alter table public.comments 
  add constraint comments_user_id_fkey 
  foreign key (user_id) 
  references public.profiles(id) 
  on delete cascade;

alter table public.ratings 
  add constraint ratings_user_id_fkey 
  foreign key (user_id) 
  references public.profiles(id) 
  on delete cascade;

alter table public.downloads 
  add constraint downloads_user_id_fkey 
  foreign key (user_id) 
  references public.profiles(id) 
  on delete cascade;

alter table public.collections 
  add constraint collections_user_id_fkey 
  foreign key (user_id) 
  references public.profiles(id) 
  on delete cascade;

-- Disable Row Level Security completely for testing
alter table public.profiles disable row level security;

-- Grant full access to everyone
grant all privileges on table public.profiles to anon, authenticated, service_role;
grant all privileges on all sequences in schema public to anon, authenticated, service_role; 