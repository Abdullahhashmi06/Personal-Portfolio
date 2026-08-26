import { getSupabaseServer } from "@/lib/supabase/server";
import { generateEmbedding, EMBEDDING_DIMENSION } from "./embeddings";

export interface RetrievedChunk {
  id: string;
  content: string;
  metadata: Record<string, unknown>;
  documentTitle: string;
  documentSource: string;
  similarity: number;
}

/**
 * Embed a user query and retrieve the most relevant chunks from Supabase.
 */
export async function retrieveRelevantChunks(
  query: string,
  options: {
    topK?: number;
    threshold?: number;
  } = {}
): Promise<RetrievedChunk[]> {
  const topK = options.topK ?? (Number(process.env.RAG_TOP_K) || 6);
  const threshold = options.threshold ?? (Number(process.env.RAG_SIMILARITY_THRESHOLD) || 0.25);

  const supabase = getSupabaseServer();
  const queryEmbedding = await generateEmbedding(query);

  // Call the pgvector similarity search function
  const { data, error } = await supabase.rpc("similarity_search", {
    query_embedding: queryEmbedding,
    match_count: topK,
    match_threshold: threshold,
  });

  if (error) {
    console.error("Vector search error:", error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  return data.map(
    (row: {
      id: string;
      content: string;
      metadata: Record<string, unknown>;
      document_title: string;
      document_source: string;
      similarity: number;
    }) => ({
      id: row.id,
      content: row.content,
      metadata: row.metadata,
      documentTitle: row.document_title,
      documentSource: row.document_source,
      similarity: row.similarity,
    })
  );
}

/**
 * Build a context string from retrieved chunks for the LLM prompt.
 */
export function buildRAGContext(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) return "";

  return chunks
    .map(
      (chunk, i) =>
        `[Source: ${chunk.documentTitle} (${chunk.documentSource})]\n${chunk.content}`
    )
    .join("\n\n---\n\n");
}
