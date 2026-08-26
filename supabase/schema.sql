-- ============================================================
-- Portfolio RAG Knowledge Base — Supabase pgvector Schema
-- Run this in your Supabase SQL Editor to set up the database.
--
-- After running, verify the function exists:
--   SELECT routine_name FROM information_schema.routines
--   WHERE routine_name = 'similarity_search';
-- ============================================================

-- 1. Enable the pgvector extension
create extension if not exists vector with schema extensions;

-- 2. Documents table — stores source documents
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source text not null,           -- e.g. 'cv', 'portfolio', 'case-study'
  content text not null,          -- full text of the document
  metadata jsonb default '{}',   -- arbitrary metadata
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Document chunks table — stores text chunks with embeddings
create table if not exists document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade,
  content text not null,
  chunk_index integer not null,
  embedding vector(384),          -- all-MiniLM-L6-v2 produces 384-dim vectors
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- 4. Indexes
create index if not exists idx_documents_source on documents(source);
create index if not exists idx_chunks_document_id on document_chunks(document_id);

-- HNSW index (better than IVFFlat for small datasets, no VACUUM ANALYZE needed)
create index if not exists idx_chunks_embedding
  on document_chunks using hnsw (embedding vector_cosine_ops)
  with (m = 16, ef_construction = 64);

-- 5. Drop old function if it exists (handles migration from previous schema)
drop function if exists match_document_chunks(vector(384), int, float);

-- 6. Similarity search function
--    Called by: src/lib/rag/retrieval.ts via supabase.rpc("similarity_search", ...)
--    Parameters: query_embedding (vector 384), match_count (int), match_threshold (float)
--    Returns: id, content, metadata, document_title, document_source, similarity
create or replace function similarity_search(
  query_embedding vector(384),
  match_count int default 6,
  match_threshold float default 0.3
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  document_title text,
  document_source text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    dc.id,
    dc.content,
    dc.metadata,
    d.title as document_title,
    d.source as document_source,
    1 - (dc.embedding <=> query_embedding) as similarity
  from document_chunks dc
  join documents d on d.id = dc.document_id
  where 1 - (dc.embedding <=> query_embedding) > match_threshold
  order by dc.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Grant EXECUTE on the function to service_role (Supabase service key)
grant execute on function similarity_search(vector(384), int, float) to service_role;

-- 7. Row Level Security (RLS) — enabled but with permissive policies
--    The service_role key bypasses RLS, but these policies ensure
--    the anon/authenticated roles can read if needed in the future.
alter table documents enable row level security;
alter table document_chunks enable row level security;

-- Allow service_role full access (redundant but explicit)
create policy "Service role full access on documents"
  on documents for all
  using (true)
  with check (true);

create policy "Service role full access on document_chunks"
  on document_chunks for all
  using (true)
  with check (true);

-- 8. Auto-update updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Drop trigger if it exists (create trigger doesn't support IF NOT EXISTS)
drop trigger if exists documents_updated_at on documents;
create trigger documents_updated_at
  before update on documents
  for each row execute function update_updated_at();
