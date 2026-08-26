/**
 * Text chunking utilities for RAG ingestion.
 * Splits documents into meaningful chunks that preserve context.
 */

export interface Chunk {
  content: string;
  index: number;
  metadata: Record<string, unknown>;
}

/**
 * Split text into chunks by paragraph boundaries first, then by sentence
 * boundaries if a paragraph is too large.
 */
export function chunkText(
  text: string,
  options: {
    maxChunkSize?: number;
    overlap?: number;
    metadata?: Record<string, unknown>;
  } = {}
): Chunk[] {
  const { maxChunkSize = 800, metadata = {} } = options;
  const chunks: Chunk[] = [];

  // Split by double newlines (paragraphs)
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  let currentChunk = "";
  let chunkIndex = 0;

  for (const paragraph of paragraphs) {
    if (paragraph.length <= maxChunkSize) {
      // Small enough — try to combine with current chunk
      const combined = currentChunk
        ? currentChunk + "\n\n" + paragraph
        : paragraph;

      if (combined.length <= maxChunkSize) {
        currentChunk = combined;
        continue;
      }

      // Flush current chunk before adding new one
      if (currentChunk) {
        chunks.push({
          content: currentChunk,
          index: chunkIndex++,
          metadata,
        });
      }
      currentChunk = paragraph;
    } else {
      // Paragraph too large — flush current and split the paragraph
      if (currentChunk) {
        chunks.push({
          content: currentChunk,
          index: chunkIndex++,
          metadata,
        });
        currentChunk = "";
      }

      // Split large paragraph by sentences
      const sentences = paragraph
        .split(/(?<=[.!?])\s+/)
        .filter((s) => s.length > 0);

      for (const sentence of sentences) {
        if (sentence.length > maxChunkSize) {
          // Individual sentence too long — force split
          const words = sentence.split(/\s+/);
          let part = "";
          for (const word of words) {
            if (part.length + word.length + 1 > maxChunkSize) {
              if (part) {
                chunks.push({
                  content: part,
                  index: chunkIndex++,
                  metadata,
                });
              }
              part = word;
            } else {
              part = part ? part + " " + word : word;
            }
          }
          if (part) {
            currentChunk = part;
          }
        } else {
          const combined = currentChunk
            ? currentChunk + " " + sentence
            : sentence;

          if (combined.length <= maxChunkSize) {
            currentChunk = combined;
          } else {
            if (currentChunk) {
              chunks.push({
                content: currentChunk,
                index: chunkIndex++,
                metadata,
              });
            }
            currentChunk = sentence;
          }
        }
      }
    }
  }

  // Flush remaining
  if (currentChunk) {
    chunks.push({
      content: currentChunk,
      index: chunkIndex,
      metadata,
    });
  }

  return chunks;
}

/**
 * Create overlapping windows of text chunks for better context continuity.
 */
export function addOverlap(chunks: Chunk[], overlapSize: number): Chunk[] {
  if (overlapSize <= 0 || chunks.length <= 1) return chunks;

  return chunks.map((chunk, i) => {
    if (i === 0) return chunk;

    const prevWords = chunks[i - 1].content.split(/\s+/);
    const overlapWords = prevWords.slice(-overlapSize);

    return {
      ...chunk,
      content: overlapWords.join(" ") + " " + chunk.content,
    };
  });
}
