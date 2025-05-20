-- Drop existing tables and constraints
drop table if exists public.comments cascade;
drop table if exists public.ratings cascade;
drop table if exists public.downloads cascade;
drop table if exists public.collections cascade;
drop table if exists public.profiles cascade;

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

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
on public.profiles for select
to public
using (true);

create policy "Users can insert their own profile"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id);

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

-- Create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 