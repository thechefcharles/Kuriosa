import type { CuriosityScoreInput } from "@/types/progress";

/** Transparent weights — adjust in one place as the model evolves. */
const W = {
  topics: 12,
  accuracy: 40,
  categories: 8,
  streak: 3,
} as const;

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

/**
 * Lightweight Curiosity Score (0+). Extensible; not tied to DB yet.
 */
export function calculateCuriosityScore(input: CuriosityScoreInput): number {
  const topics = Math.max(0, Math.floor(input.topicsCompleted));
  const acc = clamp01(input.accuracyRatio);
  const cats = Math.max(0, Math.floor(input.distinctCategoriesExplored));
  const streak = Math.max(0, Math.floor(input.streakLength));

  const raw =
    topics * W.topics +
    acc * W.accuracy +
    cats * W.categories +
    streak * W.streak;

  return Math.round(raw);
}
