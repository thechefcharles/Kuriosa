/**
 * Passes completion celebration from challenge → post-challenge view (same session).
 * Cleared after display. Not for long-term storage.
 */

const KEY = "kuriosa:completionCelebration";

export type CompletionCelebrationPayload = {
  topicSlug: string;
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

export function stashCompletionCelebration(
  payload: CompletionCelebrationPayload
): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    /* ignore quota */
  }
}

export function consumeCompletionCelebration(
  topicSlug: string
): CompletionCelebrationPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as CompletionCelebrationPayload;
    if (p.topicSlug !== topicSlug) return null;
    sessionStorage.removeItem(KEY);
    return p;
  } catch {
    return null;
  }
}
