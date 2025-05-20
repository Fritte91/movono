-- First, let's see what users exist
select id, email, deleted_at from auth.users;

-- Delete any soft-deleted users
delete from auth.users where deleted_at is not null;

-- Delete any users that might be causing issues
delete from auth.users where email like '%testing.com';

-- Reset the auth schema
alter schema auth owner to postgres;

-- Drop all existing policies
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;

-- Drop the trigger and function
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Drop and recreate the profiles table
drop table if exists public.profiles cascade;

create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Grant basic permissions
grant usage on schema public to postgres, authenticated, service_role, anon;
grant all privileges on all tables in schema public to postgres, authenticated, service_role, anon;
grant all privileges on all sequences in schema public to postgres, authenticated, service_role, anon;

-- Grant auth schema permissions
grant usage on schema auth to postgres, authenticated, service_role, anon;
grant all privileges on all tables in schema auth to postgres, authenticated, service_role, anon;
grant all privileges on all sequences in schema auth to postgres, authenticated, service_role, anon;

-- Disable RLS temporarily for testing
alter table public.profiles disable row level security;

-- Create a simple trigger function
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, created_at, updated_at)
    values (new.id, now(), now());
    return new;
end;
$$ language plpgsql security definer;

-- Create the trigger
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user(); 