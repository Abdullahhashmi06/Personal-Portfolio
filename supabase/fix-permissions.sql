-- ============================================================
-- Fix RLS Permissions for Service Role
-- Run this in Supabase SQL Editor if you get "permission denied"
-- when running the ingestion script.
-- ============================================================

-- Grant full table access to service_role
GRANT ALL ON documents TO service_role;
GRANT ALL ON document_chunks TO service_role;

-- Ensure RLS is enabled with permissive policies
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist (safe to re-run)
DROP POLICY IF EXISTS "Service role full access on documents" ON documents;
DROP POLICY IF EXISTS "Service role full access on document_chunks" ON document_chunks;

-- Create permissive RLS policies for service_role
CREATE POLICY "Service role full access on documents"
  ON documents FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on document_chunks"
  ON document_chunks FOR ALL
  USING (true)
  WITH CHECK (true);

-- Grant EXECUTE on the similarity_search function
GRANT EXECUTE ON FUNCTION similarity_search(vector(384), int, float) TO service_role;

-- Verify it worked:
-- SELECT routine_name FROM information_schema.routines WHERE routine_name = 'similarity_search';
