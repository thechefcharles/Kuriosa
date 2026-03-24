/**
 * Phase 9 — Standardized cache key conventions for AI responses.
 * Deterministic, documented patterns.
 *
 * Patterns:
 * - followups:topic:{topicId}
 * - rabbitholes:topic:{topicId}
 * - rabbitholes:topic:{topicId}:question:{hash}
 */

export function followupsCacheKey(topicId: string): string {
  return `followups:topic:${topicId.trim()}`;
}

export function rabbitHolesCacheKey(
  topicId: string,
  questionText?: string | null
): string {
  const base = `rabbitholes:topic:${topicId.trim()}`;
  if (!questionText?.trim()) return base;
  const hash = simpleHash(questionText.trim());
  return `${base}:question:${hash}`;
}

/** Deterministic short hash for cache key. No crypto deps. */
function simpleHash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h = (h << 5) - h + c;
    h = h & h;
  }
  return Math.abs(h).toString(36);
}
