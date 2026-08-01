-- JVerse Voices of Innovation migration for Supabase
-- Run once in Supabase Dashboard → SQL Editor before deploying.

CREATE TABLE IF NOT EXISTS public.innovation_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  field TEXT NOT NULL CHECK (field IN ('Business', 'Education', 'Tech', 'Lifestyle', 'Healthcare', 'Agriculture', 'Public Service', 'Creative & Media')),
  level TEXT NOT NULL CHECK (level IN ('Easy', 'Medium', 'Hard', 'Advanced')),
  question TEXT NOT NULL,
  answer TEXT NOT NULL CHECK (char_length(answer) BETWEEN 30 AND 1500),
  votes INTEGER NOT NULL DEFAULT 0 CHECK (votes >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.innovation_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  answer_id UUID NOT NULL REFERENCES public.innovation_answers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (answer_id, user_id)
);

CREATE INDEX IF NOT EXISTS innovation_answers_leaderboard_idx
  ON public.innovation_answers (field, votes DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS innovation_votes_answer_idx ON public.innovation_votes (answer_id);

ALTER TABLE public.innovation_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.innovation_votes ENABLE ROW LEVEL SECURITY;

-- Automatic rubric scores are added separately so the migration also works if answers already exist.
ALTER TABLE public.innovation_answers
  ADD COLUMN IF NOT EXISTS ai_score INTEGER NOT NULL DEFAULT 0 CHECK (ai_score BETWEEN 0 AND 10),
  ADD COLUMN IF NOT EXISTS ai_feedback TEXT;
