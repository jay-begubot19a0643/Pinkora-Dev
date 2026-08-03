-- JVerse security hardening migration for Supabase.
-- Run once in Supabase Dashboard -> SQL Editor using a project owner account.
-- The JVerse backend uses a server-only Supabase secret key, which bypasses RLS.
-- Browser clients must not have direct access to these application tables.

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.innovation_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.innovation_votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations on users" ON public.users;
DROP POLICY IF EXISTS "Allow all operations on contacts" ON public.contacts;
DROP POLICY IF EXISTS "Allow all operations on feedback" ON public.feedback;
DROP POLICY IF EXISTS "Allow all operations on recommendations" ON public.recommendations;

-- Remove any other legacy browser-access policies on these server-managed tables.
DO $$
DECLARE
  policy_record RECORD;
BEGIN
  FOR policy_record IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('users', 'contacts', 'feedback', 'recommendations', 'innovation_answers', 'innovation_votes')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', policy_record.policyname, policy_record.tablename);
  END LOOP;
END $$;

REVOKE ALL ON TABLE public.users FROM anon, authenticated;
REVOKE ALL ON TABLE public.contacts FROM anon, authenticated;
REVOKE ALL ON TABLE public.feedback FROM anon, authenticated;
REVOKE ALL ON TABLE public.recommendations FROM anon, authenticated;
REVOKE ALL ON TABLE public.innovation_answers FROM anon, authenticated;
REVOKE ALL ON TABLE public.innovation_votes FROM anon, authenticated;

GRANT ALL ON TABLE public.users TO service_role;
GRANT ALL ON TABLE public.contacts TO service_role;
GRANT ALL ON TABLE public.feedback TO service_role;
GRANT ALL ON TABLE public.recommendations TO service_role;
GRANT ALL ON TABLE public.innovation_answers TO service_role;
GRANT ALL ON TABLE public.innovation_votes TO service_role;

-- Existing members were created before email verification was introduced.
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS email_verification_token_hash TEXT,
  ADD COLUMN IF NOT EXISTS password_reset_token_hash TEXT,
  ADD COLUMN IF NOT EXISTS password_reset_expires_at TIMESTAMPTZ;

UPDATE public.users
SET email_verified_at = COALESCE(email_verified_at, NOW())
WHERE email_verified_at IS NULL;

CREATE INDEX IF NOT EXISTS users_email_verification_token_hash_idx
  ON public.users (email_verification_token_hash)
  WHERE email_verification_token_hash IS NOT NULL;

CREATE INDEX IF NOT EXISTS users_password_reset_token_hash_idx
  ON public.users (password_reset_token_hash)
  WHERE password_reset_token_hash IS NOT NULL;
