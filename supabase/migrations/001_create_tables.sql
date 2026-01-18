-- Supabase migration: create core tables for Untainted

create table if not exists profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  name text,
  profile_json jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists preferences (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  profile_id uuid references profiles(id),
  preferences jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  profile_id uuid references profiles(id),
  barcode text,
  product_name text,
  request_payload jsonb,
  analysis_result jsonb,
  processing_time_ms int,
  created_at timestamptz default now()
);

create table if not exists feedback (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  context jsonb,
  message text not null,
  status text default 'new',
  created_at timestamptz default now()
);

create table if not exists api_keys (
  id uuid default gen_random_uuid() primary key,
  customer_name text,
  key_hash text not null,
  plan text,
  quota_remaining int,
  quota_reset_at timestamptz,
  created_at timestamptz default now()
);

-- Add indexes
create index if not exists idx_history_user_id on history(user_id);
create index if not exists idx_preferences_user_id on preferences(user_id);
