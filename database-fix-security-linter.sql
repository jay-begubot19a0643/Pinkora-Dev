-- Fix Supabase linter warning 0029 for accidental public SECURITY DEFINER RPC access.
-- Run once in Supabase Dashboard -> SQL Editor.
-- These functions remain available to the database owner/server only; they are no
-- longer callable through the public PostgREST API by anon/authenticated users.

REVOKE EXECUTE ON FUNCTION public.join_support_circle(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.join_support_circle(text) FROM anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.record_aura_streak() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.record_aura_streak() FROM anon, authenticated;

-- Prevent future functions created by the main database owner from becoming
-- executable by API roles automatically.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE EXECUTE ON FUNCTIONS FROM anon, authenticated;
