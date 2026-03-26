/**
 * Phase 9 — Standardized cache key conventions for AI responses.
 * Deterministic, documented patterns. No collision between topics or question variants.
 *
 * Follow-ups: ai_followups table (one row per topic)
 * ai_cache keys:
 * - rabbitholes:topic:{topicId} — topic-only rabbit holes
 * - rabbitholes:topic:{topicId}:question:{hash} — question-scoped rabbit holes
 * - manualanswer:topic:{topicId}:question:{hash} — manual/guided answers
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

export function manualAnswerCacheKey(
  topicId: string,
  normalizedQuestion: string
): string {
  const hash = simpleHash(normalizedQuestion.trim());
  return `manualanswer:topic:${topicId.trim()}:question:${hash}`;
}

/** Deterministic short hash for cache key. No crypto deps. */
export function simpleHash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h = (h << 5) - h + c;
    h = h & h;
  }
  return Math.abs(h).toString(36);
}
