-- First, ensure we're the owner of the auth schema
alter schema auth owner to postgres;

-- Reset all permissions on auth schema
revoke all privileges on schema auth from postgres, authenticated, service_role, anon;
revoke all privileges on all tables in schema auth from postgres, authenticated, service_role, anon;
revoke all privileges on all sequences in schema auth from postgres, authenticated, service_role, anon;

-- Grant basic schema permissions
grant usage on schema auth to postgres, authenticated, service_role, anon;

-- Grant permissions on auth.users
grant all privileges on auth.users to postgres;
grant select on auth.users to authenticated, service_role, anon;
grant update on auth.users to authenticated, service_role, anon;

-- Grant permissions on auth.identities
grant all privileges on auth.identities to postgres;
grant select, insert, update on auth.identities to authenticated, service_role, anon;

-- Grant permissions on auth.sessions
grant all privileges on auth.sessions to postgres;
grant select, insert, update, delete on auth.sessions to authenticated, service_role, anon;

-- Grant permissions on auth.instances
grant all privileges on auth.instances to postgres;
grant select on auth.instances to authenticated, service_role, anon;

-- Grant permissions on auth.refresh_tokens
grant all privileges on auth.refresh_tokens to postgres;
grant select, insert, update, delete on auth.refresh_tokens to authenticated, service_role, anon;

-- Grant permissions on auth.mfa_factors
grant all privileges on auth.mfa_factors to postgres;
grant select, insert, update, delete on auth.mfa_factors to authenticated, service_role, anon;

-- Grant permissions on auth.mfa_challenges
grant all privileges on auth.mfa_challenges to postgres;
grant select, insert, update, delete on auth.mfa_challenges to authenticated, service_role, anon;

-- Grant permissions on auth.flow_state
grant all privileges on auth.flow_state to postgres;
grant select, insert, update, delete on auth.flow_state to authenticated, service_role, anon;

-- Grant permissions on auth.sso_providers
grant all privileges on auth.sso_providers to postgres;
grant select on auth.sso_providers to authenticated, service_role, anon;

-- Grant permissions on auth.sso_domains
grant all privileges on auth.sso_domains to postgres;
grant select on auth.sso_domains to authenticated, service_role, anon;

-- Grant permissions on auth.saml_providers
grant all privileges on auth.saml_providers to postgres;
grant select on auth.saml_providers to authenticated, service_role, anon;

-- Grant permissions on auth.saml_relay_states
grant all privileges on auth.saml_relay_states to postgres;
grant select, insert, update, delete on auth.saml_relay_states to authenticated, service_role, anon;

-- Grant permissions on auth.audit_log_entries
grant all privileges on auth.audit_log_entries to postgres;
grant select on auth.audit_log_entries to authenticated, service_role, anon;

-- Grant permissions on auth.schema_migrations
grant all privileges on auth.schema_migrations to postgres;
grant select on auth.schema_migrations to authenticated, service_role, anon;

-- Grant permissions on auth.identities_id_seq
grant all privileges on auth.identities_id_seq to postgres;
grant usage on auth.identities_id_seq to authenticated, service_role, anon;

-- Grant permissions on auth.instances_id_seq
grant all privileges on auth.instances_id_seq to postgres;
grant usage on auth.instances_id_seq to authenticated, service_role, anon;

-- Grant permissions on auth.mfa_factors_id_seq
grant all privileges on auth.mfa_factors_id_seq to postgres;
grant usage on auth.mfa_factors_id_seq to authenticated, service_role, anon;

-- Grant permissions on auth.mfa_challenges_id_seq
grant all privileges on auth.mfa_challenges_id_seq to postgres;
grant usage on auth.mfa_challenges_id_seq to authenticated, service_role, anon;

-- Grant permissions on auth.flow_state_id_seq
grant all privileges on auth.flow_state_id_seq to postgres;
grant usage on auth.flow_state_id_seq to authenticated, service_role, anon;

-- Grant permissions on auth.sso_providers_id_seq
grant all privileges on auth.sso_providers_id_seq to postgres;
grant usage on auth.sso_providers_id_seq to authenticated, service_role, anon;

-- Grant permissions on auth.sso_domains_id_seq
grant all privileges on auth.sso_domains_id_seq to postgres;
grant usage on auth.sso_domains_id_seq to authenticated, service_role, anon;

-- Grant permissions on auth.saml_providers_id_seq
grant all privileges on auth.saml_providers_id_seq to postgres;
grant usage on auth.saml_providers_id_seq to authenticated, service_role, anon;

-- Grant permissions on auth.saml_relay_states_id_seq
grant all privileges on auth.saml_relay_states_id_seq to postgres;
grant usage on auth.saml_relay_states_id_seq to authenticated, service_role, anon;

-- Grant permissions on auth.audit_log_entries_id_seq
grant all privileges on auth.audit_log_entries_id_seq to postgres;
grant usage on auth.audit_log_entries_id_seq to authenticated, service_role, anon;

-- Grant permissions on auth.schema_migrations_version_seq
grant all privileges on auth.schema_migrations_version_seq to postgres;
grant usage on auth.schema_migrations_version_seq to authenticated, service_role, anon;

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