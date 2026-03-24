/**
 * Phase 9 — Basic rate limiting for AI requests.
 * Per-user, in-memory. Lightweight MVP.
 */

const DEFAULT_LIMIT = 20;
const WINDOW_MS = 60 * 1000;

/** userId -> { count, resetAt } */
const store = new Map<string, { count: number; resetAt: number }>();

function now(): number {
  return Date.now();
}

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds?: number };

/**
 * Check if user is within rate limit. Increments count on success.
 * In-memory only — resets on server restart.
 */
export function checkAIRateLimit(
  userId: string,
  limit: number = DEFAULT_LIMIT
): RateLimitResult {
  const key = userId.trim();
  if (!key) {
    return { allowed: false };
  }

  const nowMs = now();
  let entry = store.get(key);

  if (!entry || nowMs >= entry.resetAt) {
    entry = { count: 1, resetAt: nowMs + WINDOW_MS };
    store.set(key, entry);
    return { allowed: true };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.resetAt - nowMs) / 1000),
    };
  }

  entry.count += 1;
  return { allowed: true };
}
