/**
 * Lightweight in-memory rate limiter for the chat API.
 * Suitable for a single-server deployment (Vercel serverless).
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const hits = new Map<string, RateLimitEntry>();

// Config
const WINDOW_MS = 60_000; // 1 minute window
const MAX_REQUESTS = 15; // max requests per window
const MAX_MESSAGE_LENGTH = 1000; // max characters per message
const MAX_HISTORY_LENGTH = 12; // max conversation messages

/**
 * Check if an IP is rate limited. Returns null if allowed, or the
 * number of seconds until the window resets if blocked.
 */
export function checkRateLimit(ip: string): number | null {
  const now = Date.now();

  // Lazy cleanup: occasionally prune stale entries
  if (hits.size > 100) {
    for (const [key, entry] of hits) {
      if (now > entry.resetAt) hits.delete(key);
    }
  }

  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    // New window
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return null;
  }

  if (entry.count >= MAX_REQUESTS) {
    const remaining = Math.ceil((entry.resetAt - now) / 1000);
    return remaining;
  }

  entry.count++;
  return null;
}

/**
 * Validate a chat message.
 */
export function validateMessage(message: string): {
  valid: boolean;
  error?: string;
} {
  if (!message || typeof message !== "string") {
    return { valid: false, error: "Message is required." };
  }

  const trimmed = message.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: "Message cannot be empty." };
  }

  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters.`,
    };
  }

  return { valid: true };
}

/**
 * Validate and truncate conversation history.
 */
export function sanitizeHistory(
  history: unknown
): { role: "user" | "assistant"; content: string }[] {
  if (!Array.isArray(history)) return [];

  return history
    .slice(-MAX_HISTORY_LENGTH)
    .filter(
      (msg): msg is { role: "user" | "assistant"; content: string } =>
        typeof msg === "object" &&
        msg !== null &&
        ((msg as Record<string, unknown>).role === "user" ||
        (msg as Record<string, unknown>).role === "assistant")
    )
    .map((msg) => ({
      role: msg.role,
      content: String(msg.content || "").slice(0, MAX_MESSAGE_LENGTH),
    }));
}

/**
 * Get client IP from request headers.
 */
export function getClientIP(
  headers: Headers
): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}

// Cleanup happens lazily in checkRateLimit to avoid
// setInterval overhead on serverless (Vercel).
// Expired entries are removed when their IP next makes a request.
