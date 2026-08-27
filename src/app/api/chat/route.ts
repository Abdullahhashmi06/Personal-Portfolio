import { NextRequest } from "next/server";
import { retrieveRelevantChunks, buildRAGContext, type RetrievedChunk } from "@/lib/rag/retrieval";
import { buildMessages, FALLBACK_RESPONSE } from "@/lib/ai/prompts";
import { generateAIResponse } from "@/lib/ai/provider";
import {
  checkRateLimit,
  validateMessage,
  sanitizeHistory,
  getClientIP,
} from "@/lib/ai/rate-limit";

/** Allow up to 30s on Vercel Pro for embedding model cold starts. */
export const maxDuration = 30;

/**
 * Always return a JSON response.
 * This wrapper ensures that even if NextResponse.json() somehow fails,
 * we still return a valid JSON string.
 */
function jsonResponse(body: Record<string, unknown>, init?: { status?: number }): Response {
  const status = init?.status ?? 200;
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

export async function POST(req: NextRequest) {
  console.log("[Chat] Request received");

  /* --- Rate Limit --- */
  try {
    const ip = getClientIP(req.headers);
    const rateLimited = checkRateLimit(ip);
    if (rateLimited !== null) {
      console.warn("[Chat] Rate limited:", ip);
      return jsonResponse(
        { error: `Too many requests. Please wait ${rateLimited} seconds.` },
        { status: 429 }
      );
    }

    /* --- Parse Body --- */
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: "Invalid request body." }, { status: 400 });
    }

    /* --- Validate Message --- */
    const message = String(body.message || "");
    const validation = validateMessage(message);
    if (!validation.valid) {
      return jsonResponse({ error: validation.error }, { status: 400 });
    }

    console.log(`[Chat] Message length: ${message.length}`);

    /* --- Validate & Sanitize History --- */
    const history = sanitizeHistory(body.history);
    console.log(`[Chat] History length: ${history.length}`);

    /* --- RAG Retrieval --- */
    let chunks: RetrievedChunk[] = [];
    try {
      chunks = await retrieveRelevantChunks(message, {
        topK: 6,
        threshold: 0.25,
      });
    } catch (ragErr) {
      console.error("[Chat] RAG retrieval error:", ragErr);
    }

    const ragContext = buildRAGContext(chunks);
    console.log(`[Chat] Retrieved ${chunks.length} chunks`);

    /* --- Build Messages --- */
    const messages = buildMessages(message, ragContext, history);

    /* --- Generate Response --- */
    let response;
    try {
      response = await generateAIResponse(messages);
    } catch (err) {
      console.error("[Chat] All providers failed:", err);
      return jsonResponse(
        { error: FALLBACK_RESPONSE },
        { status: 503 }
      );
    }

    console.log(
      `[Chat] Response generated via ${response.provider} (${response.model}), length: ${response.content.length}`
    );

    /* --- Return Response --- */
    return jsonResponse({
      content: response.content,
      provider: response.provider,
      sources: chunks.map((c) => ({
        title: c.documentTitle,
        source: c.documentSource,
      })),
    });
  } catch (err) {
    console.error("[Chat] Unexpected error:", err);
    return jsonResponse(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
