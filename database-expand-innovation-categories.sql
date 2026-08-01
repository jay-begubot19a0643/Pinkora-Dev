-- JVerse Voices of Innovation category expansion for Supabase
-- Run this once in Supabase Dashboard -> SQL Editor before using the new categories.

ALTER TABLE public.innovation_answers
  DROP CONSTRAINT IF EXISTS innovation_answers_field_check;

ALTER TABLE public.innovation_answers
  ADD CONSTRAINT innovation_answers_field_check
  CHECK (field IN (
    'Business',
    'Education',
    'Tech',
    'Lifestyle',
    'Healthcare',
    'Agriculture',
    'Public Service',
    'Creative & Media'
  ));
