/**
 * Phase 9 — Safe fallback responses for AI failures.
 * Kuriosa tone: curious, calm, helpful, not robotic.
 */

export const FALLBACKS = {
  moderationFailed:
    "This question touched on something we can't answer safely. Try a different angle — we're here for curiosity, not risk.",
  generationFailed:
    "We couldn't generate an answer right now. Your curiosity is worth it — try again in a moment.",
  rateLimitExceeded:
    "You're asking a lot of great questions. Take a breather and come back in a minute — we'll be here.",
  timeout:
    "The answer took a bit too long. Give it another try — sometimes a fresh request does the trick.",
} as const;

export type FallbackKey = keyof typeof FALLBACKS;

export function getFallbackResponse(key: FallbackKey): string {
  return FALLBACKS[key];
}
