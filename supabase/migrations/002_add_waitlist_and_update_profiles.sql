-- Supabase migration: add waitlist table and update profiles
-- Based on the needs identified in landing-page/app/personal/page.tsx and landing-page/app/signup/page.tsx

-- 1. Create waitlist table for the "Join Waitlist" feature
create table if not exists waitlist (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  source text default 'unknown',
  created_at timestamptz default now()
);

-- Add index for faster lookups if needed (email is already unique/indexed but good practice)
create index if not exists idx_waitlist_email on waitlist(email);

-- 2. Update profiles table to include phone number
-- This is used in landing-page/app/signup/page.tsx
alter table profiles 
add column if not exists phone text;
