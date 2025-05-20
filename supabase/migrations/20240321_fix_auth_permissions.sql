-- Reset all permissions
revoke all privileges on schema auth from postgres, authenticated, service_role, anon;
revoke all privileges on all tables in schema auth from postgres, authenticated, service_role, anon;
revoke all privileges on all sequences in schema auth from postgres, authenticated, service_role, anon;

-- Grant basic auth schema permissions
grant usage on schema auth to postgres, authenticated, service_role, anon;
grant select on all tables in schema auth to postgres, authenticated, service_role, anon;
grant select on all sequences in schema auth to postgres, authenticated, service_role, anon;

-- Grant specific permissions to auth.users
grant select on auth.users to postgres, authenticated, service_role, anon;
grant update on auth.users to postgres, authenticated, service_role, anon;

-- Grant specific permissions to auth.identities
grant select on auth.identities to postgres, authenticated, service_role, anon;
grant insert on auth.identities to postgres, authenticated, service_role, anon;
grant update on auth.identities to postgres, authenticated, service_role, anon;

-- Grant specific permissions to auth.sessions
grant select on auth.sessions to postgres, authenticated, service_role, anon;
grant insert on auth.sessions to postgres, authenticated, service_role, anon;
grant update on auth.sessions to postgres, authenticated, service_role, anon;
grant delete on auth.sessions to postgres, authenticated, service_role, anon;

-- Reset public schema permissions
revoke all privileges on schema public from postgres, authenticated, service_role, anon;
revoke all privileges on all tables in schema public from postgres, authenticated, service_role, anon;
revoke all privileges on all sequences in schema public from postgres, authenticated, service_role, anon;

-- Grant public schema permissions
grant usage on schema public to postgres, authenticated, service_role, anon;
grant all privileges on all tables in schema public to postgres, authenticated, service_role, anon;
grant all privileges on all sequences in schema public to postgres, authenticated, service_role, anon;

-- Ensure the profiles table exists with correct structure
drop table if exists public.profiles cascade;
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

-- Disable RLS temporarily for testing
alter table public.profiles disable row level security;

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