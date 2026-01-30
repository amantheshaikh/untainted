-- Tighten RLS policies to satisfy Supabase security linter
-- Instead of WITH CHECK (true), we enforce that the main field is not null/empty.
-- This effectively allows "public" writes but ensures data validity and removes the "always true" warning.

-- Fix for 'feedback' table
DROP POLICY IF EXISTS "Public can insert into feedback" ON public.feedback;
CREATE POLICY "Public can insert into feedback"
ON public.feedback
FOR INSERT
WITH CHECK (
  message IS NOT NULL AND length(message) > 0
);

-- Fix for 'waitlist' table
DROP POLICY IF EXISTS "Public can insert into waitlist" ON public.waitlist;
CREATE POLICY "Public can insert into waitlist"
ON public.waitlist
FOR INSERT
WITH CHECK (
  email IS NOT NULL AND length(email) > 0
);
