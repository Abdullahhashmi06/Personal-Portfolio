import type { FeatureExtractionPipeline } from "@huggingface/transformers";

const MODEL_ID = "Xenova/all-MiniLM-L6-v2";
const DIMENSION = 384;
const MODEL_LOAD_TIMEOUT_MS = 30_000;
const INFERENCE_TIMEOUT_MS = 10_000;

let extractor: FeatureExtractionPipeline | null = null;
let loadPromise: Promise<FeatureExtractionPipeline> | null = null;

/**
 * Get or initialize the embedding pipeline.
 * The model is loaded once and reused across warm invocations.
 * On Vercel, cold starts may take 10-20 seconds as the model downloads.
 *
 * Uses a dynamic import so @huggingface/transformers (119 MB) is not
 * statically bundled into the serverless function, which would exceed
 * Vercel's function-size limits and crash at module-load time.
 */
async function getExtractor(): Promise<FeatureExtractionPipeline> {
  if (extractor) return extractor;

  // Prevent duplicate concurrent loads
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      console.log("[Embeddings] Loading embedding model (cold start)...", MODEL_ID);

      // Dynamic import — only loaded on first call, not at module init
      const { pipeline } = await import("@huggingface/transformers");

      const pipe = await Promise.race([
        pipeline("feature-extraction", MODEL_ID, {
          device: "cpu",
        }),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error(`Embedding model failed to load within ${MODEL_LOAD_TIMEOUT_MS / 1000}s. This may happen on Vercel cold starts — try again.`)),
            MODEL_LOAD_TIMEOUT_MS
          )
        ),
      ]);

      console.log("[Embeddings] Model loaded successfully.");
      extractor = pipe;
      return pipe;
    } catch (err) {
      loadPromise = null; // Allow retry on next call
      throw err;
    }
  })();

  return loadPromise;
}

/**
 * Generate an embedding vector for a single text string.
 * Returns a number array of 384 dimensions.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const pipe = await getExtractor();

  const output = await Promise.race([
    pipe(text, { pooling: "mean", normalize: true }),
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Embedding inference timed out after ${INFERENCE_TIMEOUT_MS / 1000}s`)),
        INFERENCE_TIMEOUT_MS
      )
    ),
  ]);

  const vec = Array.from(output.data.slice(0, DIMENSION));
  return vec;
}

/**
 * Generate embeddings for multiple texts in a batch.
 */
export async function generateEmbeddings(
  texts: string[]
): Promise<number[][]> {
  const results: number[][] = [];
  // Process sequentially to avoid memory issues on serverless
  for (const text of texts) {
    const embedding = await generateEmbedding(text);
    results.push(embedding);
  }
  return results;
}

export const EMBEDDING_DIMENSION = DIMENSION;
