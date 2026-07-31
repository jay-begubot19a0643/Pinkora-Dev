-- JVerse feedback ratings migration for Supabase
-- Run once in Supabase Dashboard → SQL Editor.

ALTER TABLE public.feedback
  ADD COLUMN IF NOT EXISTS rating INTEGER NOT NULL DEFAULT 5
  CHECK (rating BETWEEN 1 AND 5);
