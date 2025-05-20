-- First, drop all foreign key constraints
alter table if exists public.comments drop constraint if exists comments_user_id_fkey;
alter table if exists public.ratings drop constraint if exists ratings_user_id_fkey;
alter table if exists public.downloads drop constraint if exists downloads_user_id_fkey;
alter table if exists public.collections drop constraint if exists collections_user_id_fkey;

-- Drop the profiles table
drop table if exists public.profiles;

-- Create the profiles table
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    username text unique,
    display_name text,
    bio text,
    country text,
    language text,
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Recreate foreign key constraints with CASCADE
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

-- Disable RLS temporarily for testing
alter table public.profiles disable row level security;

-- Grant all privileges to all roles
grant usage on schema public to postgres, authenticated, service_role, anon;
grant all privileges on all tables in schema public to postgres, authenticated, service_role, anon;
grant all privileges on all sequences in schema public to postgres, authenticated, service_role, anon;

-- Create a trigger to automatically create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name, created_at, updated_at)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'username',
    now(),
    now()
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop the trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;

-- Create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 