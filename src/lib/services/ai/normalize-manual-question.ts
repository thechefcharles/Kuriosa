/**
 * Phase 9 — Normalize and validate manual question input.
 */

const MAX_CHARS = 500;
const MIN_CHARS = 3;

export type NormalizeQuestionResult =
  | { ok: true; normalized: string }
  | { ok: false; error: string };

/**
 * Normalize question text for caching and generation.
 * - trim whitespace
 * - collapse repeated spaces
 * - enforce character limit
 * - reject empty or too-short input
 */
export function normalizeManualQuestion(
  raw: string
): NormalizeQuestionResult {
  if (raw == null || typeof raw !== "string") {
    return { ok: false, error: "Question must be a string" };
  }

  const collapsed = raw.replace(/\s+/g, " ").trim();
  if (collapsed.length < MIN_CHARS) {
    return {
      ok: false,
      error: `Question must be at least ${MIN_CHARS} characters`,
    };
  }

  if (collapsed.length > MAX_CHARS) {
    return {
      ok: false,
      error: `Question must be at most ${MAX_CHARS} characters`,
    };
  }

  const normalized = collapsePunctuation(collapsed);
  if (normalized.length < MIN_CHARS) {
    return { ok: false, error: "Question is too short after normalization" };
  }

  return { ok: true, normalized };
}

/** Light punctuation normalization: ensure single space after terminal punctuation */
function collapsePunctuation(s: string): string {
  return s
    .replace(/\s*([.?!,;:])\s*/g, "$1 ")
    .replace(/\s+/g, " ")
    .trim();
}
