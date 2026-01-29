-- Final Consolidated Schema for Untainted
-- Run this script in the Supabase SQL Editor to ensure all tables are correctly set up.
-- This script is idempotent (uses IF NOT EXISTS) so it's safe to run multiple times.

-- 1. PROFILES
-- Stores user profile data including dietary preferences and new phone number field
create table if not exists profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  name text,
  phone text, -- Added for personal account signup
  profile_json jsonb, -- Stores preferences, allergies, etc.
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Ensure phone column exists if table was already created without it
do $$ 
begin
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'phone') then
    alter table profiles add column phone text;
  end if;
end $$;

-- 2. WAITLIST
-- Stores emails from the "Join Waitlist" feature on the personal page
create table if not exists waitlist (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  source text default 'unknown',
  created_at timestamptz default now()
);
create index if not exists idx_waitlist_email on waitlist(email);

-- 3. FEEDBACK
-- Stores contact form submissions
create table if not exists feedback (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id), -- Optional, as some contact forms are public
  context jsonb,
  message text not null,
  status text default 'new',
  created_at timestamptz default now()
);

-- 4. HISTORY
-- Stores product scan history
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
create index if not exists idx_history_user_id on history(user_id);

-- 5. API_KEYS
-- Stores API keys for business users
create table if not exists api_keys (
  id uuid default gen_random_uuid() primary key,
  customer_name text,
  key_hash text not null,
  plan text,
  quota_remaining int,
  quota_reset_at timestamptz,
  created_at timestamptz default now()
);

-- RLS POLICIES (Optional but recommended defaults)
-- Enable RLS on all tables
alter table profiles enable row level security;
alter table waitlist enable row level security;
alter table feedback enable row level security;
alter table history enable row level security;
alter table api_keys enable row level security;

-- Create policy: Users can only see their own profile
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = user_id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = user_id);

create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = user_id);

-- Create policy: Public can insert into waitlist (for landing page)
create policy "Public can insert into waitlist" on waitlist
  for insert with check (true);

-- Create policy: Public can insert into feedback (contact form)
create policy "Public can insert into feedback" on feedback
  for insert with check (true);

-- Create policy: Users can see their own history
create policy "Users can view own history" on history
  for select using (auth.uid() = user_id);

create policy "Users can insert own history" on history
  for insert with check (auth.uid() = user_id);
