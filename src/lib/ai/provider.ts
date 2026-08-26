/**
 * LLM Provider Abstraction
 *
 * Provides a unified interface for generating AI responses.
 * Uses Groq as the primary provider with OpenRouter as fallback.
 *
 * The RAG system is completely independent of this module.
 */

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMResponse {
  content: string;
  provider: string;
  model: string;
}

export interface LLMProvider {
  name: string;
  generate(messages: ChatMessage[]): Promise<LLMResponse>;
}

/* ── Groq Provider ────────────────────────────────────── */

class GroqProvider implements LLMProvider {
  name = "groq";

  async generate(messages: ChatMessage[]): Promise<LLMResponse> {
    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

    if (!apiKey) {
      throw new Error("GROQ_API_KEY not configured");
    }

    const res = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.3,
          max_tokens: 1024,
          top_p: 0.9,
        }),
        signal: AbortSignal.timeout(15000),
      }
    );

    if (!res.ok) {
      const status = res.status;
      // Throw retryable errors so fallback can trigger
      if (status === 429 || status >= 500) {
        throw new ProviderError(
          this.name,
          `HTTP ${status}`,
          status === 429 ? "rate_limited" : "server_error"
        );
      }
      const body = await res.text().catch(() => "");
      throw new ProviderError(
        this.name,
        `HTTP ${status}: ${body.slice(0, 200)}`,
        "client_error"
      );
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new ProviderError(this.name, "Empty response", "empty_response");
    }

    return { content, provider: this.name, model };
  }
}

/* ── OpenRouter Provider ──────────────────────────────── */

class OpenRouterProvider implements LLMProvider {
  name = "openrouter";

  async generate(messages: ChatMessage[]): Promise<LLMResponse> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model =
      process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free";

    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY not configured");
    }

    const res = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://abdullahhashmi.dev",
          "X-Title": "Abdullah Hashmi Portfolio Assistant",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.3,
          max_tokens: 1024,
          top_p: 0.9,
        }),
        signal: AbortSignal.timeout(20000),
      }
    );

    if (!res.ok) {
      const status = res.status;
      const body = await res.text().catch(() => "");
      throw new ProviderError(
        this.name,
        `HTTP ${status}: ${body.slice(0, 200)}`,
        status === 429 ? "rate_limited" : "server_error"
      );
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new ProviderError(this.name, "Empty response", "empty_response");
    }

    return { content, provider: this.name, model };
  }
}

/* ── Error Handling ───────────────────────────────────── */

export type ErrorType =
  | "rate_limited"
  | "server_error"
  | "client_error"
  | "empty_response"
  | "timeout"
  | "unknown";

export class ProviderError extends Error {
  provider: string;
  errorType: ErrorType;

  constructor(provider: string, message: string, errorType: ErrorType) {
    super(message);
    this.name = "ProviderError";
    this.provider = provider;
    this.errorType = errorType;
  }

  /** Whether this error should trigger fallback to another provider */
  get shouldFallback(): boolean {
    return (
      this.errorType === "rate_limited" ||
      this.errorType === "server_error" ||
      this.errorType === "timeout"
    );
  }
}

/* ── Provider Manager ─────────────────────────────────── */

const providers: LLMProvider[] = [new GroqProvider(), new OpenRouterProvider()];

/**
 * Generate an AI response using the primary provider with automatic fallback.
 */
export async function generateAIResponse(
  messages: ChatMessage[]
): Promise<LLMResponse> {
  let lastError: Error | null = null;
  const forceFail = shouldForceGroqFailure();

  for (const provider of providers) {
    // In dev-only force-fail mode, skip the primary provider (Groq)
    if (forceFail && provider.name === "groq") {
      console.log("[LLM] GROQ_FORCE_FAIL — skipping Groq, testing fallback");
      continue;
    }

    try {
      const response = await provider.generate(messages);
      console.log(`[LLM] ${provider.name} responded successfully`);
      return response;
    } catch (err) {
      const providerErr =
        err instanceof ProviderError
          ? err
          : new ProviderError(
              provider.name,
              String(err),
              "unknown"
            );

      console.warn(
        `[LLM] ${provider.name} failed: ${providerErr.errorType} — ${providerErr.message}`
      );
      lastError = providerErr;

      // Only fallback if the error is retryable
      if (providerErr instanceof ProviderError && !providerErr.shouldFallback) {
        throw providerErr;
      }
    }
  }

  // All providers failed
  throw lastError || new Error("All LLM providers failed");
}

/**
 * Force a specific provider to fail in development.
 * Set GROQ_FORCE_FAIL=true to test OpenRouter fallback.
 */
export function shouldForceGroqFailure(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.GROQ_FORCE_FAIL === "true"
  );
}
