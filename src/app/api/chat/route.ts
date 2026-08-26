import { NextRequest, NextResponse } from "next/server";
import { retrieveRelevantChunks, buildRAGContext } from "@/lib/rag/retrieval";
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

export async function POST(req: NextRequest) {
  try {
    /* --- Rate Limit --- */
    const ip = getClientIP(req.headers);
    const rateLimited = checkRateLimit(ip);
    if (rateLimited !== null) {
      return NextResponse.json(
        {
          error: `Too many requests. Please wait ${rateLimited} seconds.`,
        },
        { status: 429 }
      );
    }

    /* --- Parse Body --- */
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    /* --- Validate Message --- */
    const message = String(body.message || "");
    const validation = validateMessage(message);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    /* --- Validate & Sanitize History --- */
    const history = sanitizeHistory(body.history);

    /* --- RAG Retrieval --- */
    const chunks = await retrieveRelevantChunks(message, {
      topK: 6,
      threshold: 0.25,
    });

    const ragContext = buildRAGContext(chunks);

    console.log(
      `[Chat] Retrieved ${chunks.length} chunks for query: "${message.slice(0, 80)}..."`
    );

    /* --- Build Messages --- */
    const messages = buildMessages(message, ragContext, history);

    /* --- Generate Response --- */
    let response;
    try {
      response = await generateAIResponse(messages);
    } catch (err) {
      console.error("[Chat] All providers failed:", err);
      return NextResponse.json(
        { error: FALLBACK_RESPONSE },
        { status: 503 }
      );
    }

    console.log(
      `[Chat] Response generated via ${response.provider} (${response.model})`
    );

    /* --- Return Response --- */
    return NextResponse.json({
      content: response.content,
      provider: response.provider,
      sources: chunks.map((c) => ({
        title: c.documentTitle,
        source: c.documentSource,
      })),
    });
  } catch (err) {
    console.error("[Chat] Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
