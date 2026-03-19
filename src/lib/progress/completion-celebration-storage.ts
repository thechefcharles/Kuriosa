/**
 * One-shot celebration: challenge → same-topic curiosity view.
 * TTL + validation prevent stale or malformed payloads from resurfacing.
 */

const KEY = "kuriosa:completionCelebration";
/** Drop celebration if not shown within this window (avoids surprise pop-ins days later). */
export const COMPLETION_CELEBRATION_TTL_MS = 15 * 60 * 1000;

export type CompletionCelebrationPayload = {
  topicSlug: string;
  storedAtMs: number;
  xpEarned: number;
  wasCountedAsNewCompletion: boolean;
  levelBefore: number;
  levelAfter: number;
  streakBefore: number;
  streakAfter: number;
  curiosityScoreBefore: number;
  curiosityScoreAfter: number;
  unlockedBadges: { slug: string; name: string; description: string | null }[];
};

function isFiniteNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

function normalizePayload(raw: unknown): CompletionCelebrationPayload | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.topicSlug !== "string" || !o.topicSlug.trim()) return null;
  const storedAtMs = isFiniteNumber(o.storedAtMs)
    ? o.storedAtMs
    : 0;
  if (Date.now() - storedAtMs > COMPLETION_CELEBRATION_TTL_MS) return null;

  if (!isFiniteNumber(o.xpEarned)) return null;
  if (typeof o.wasCountedAsNewCompletion !== "boolean") return null;
  if (!isFiniteNumber(o.levelBefore) || !isFiniteNumber(o.levelAfter)) return null;
  if (!isFiniteNumber(o.streakBefore) || !isFiniteNumber(o.streakAfter)) return null;
  if (
    !isFiniteNumber(o.curiosityScoreBefore) ||
    !isFiniteNumber(o.curiosityScoreAfter)
  ) {
    return null;
  }
  const badges = o.unlockedBadges;
  if (!Array.isArray(badges)) return null;
  const unlockedBadges = badges.map((b) => {
    if (!b || typeof b !== "object") return null;
    const x = b as Record<string, unknown>;
    if (typeof x.slug !== "string" || typeof x.name !== "string") return null;
    return {
      slug: x.slug,
      name: x.name,
      description:
        x.description === null || typeof x.description === "string"
          ? x.description
          : null,
    };
  });
  if (unlockedBadges.some((x) => x === null)) return null;

  return {
    topicSlug: o.topicSlug.trim(),
    storedAtMs,
    xpEarned: o.xpEarned,
    wasCountedAsNewCompletion: o.wasCountedAsNewCompletion,
    levelBefore: o.levelBefore,
    levelAfter: o.levelAfter,
    streakBefore: o.streakBefore,
    streakAfter: o.streakAfter,
    curiosityScoreBefore: o.curiosityScoreBefore,
    curiosityScoreAfter: o.curiosityScoreAfter,
    unlockedBadges: unlockedBadges as CompletionCelebrationPayload["unlockedBadges"],
  };
}

export function stashCompletionCelebration(
  payload: Omit<CompletionCelebrationPayload, "storedAtMs">
): void {
  if (typeof window === "undefined") return;
  try {
    const full: CompletionCelebrationPayload = {
      ...payload,
      storedAtMs: Date.now(),
    };
    sessionStorage.setItem(KEY, JSON.stringify(full));
  } catch {
    /* ignore quota */
  }
}

/**
 * If payload matches topicSlug and is valid, remove from storage and return it.
 * Malformed or expired payloads are cleared. Wrong topic leaves storage intact (for correct slug).
 */
export function consumeCompletionCelebration(
  topicSlug: string
): CompletionCelebrationPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      sessionStorage.removeItem(KEY);
      return null;
    }

    const p = normalizePayload(parsed);
    if (!p) {
      sessionStorage.removeItem(KEY);
      return null;
    }

    if (p.topicSlug !== topicSlug.trim()) {
      return null;
    }

    sessionStorage.removeItem(KEY);
    return p;
  } catch {
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    return null;
  }
}
