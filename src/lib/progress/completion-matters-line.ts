import type { RewardBreakdownPayload } from "@/lib/progress/completion-celebration-storage";

export type CompletionMattersInput = {
  wasCountedAsNewCompletion: boolean;
  xpEarned: number;
  levelBefore: number;
  levelAfter: number;
  streakBefore: number;
  streakAfter: number;
  curiosityScoreBefore: number;
  curiosityScoreAfter: number;
  breakdown: RewardBreakdownPayload | null;
  unlockedBadgesCount: number;
};

/**
 * Returns one short dynamic line explaining why this completion mattered.
 * Chooses the single strongest relevant signal. Used in completion celebration.
 */
export function getCompletionMattersLine(input: CompletionMattersInput): string | null {
  const {
    wasCountedAsNewCompletion,
    levelBefore,
    levelAfter,
    streakBefore,
    streakAfter,
    curiosityScoreBefore,
    curiosityScoreAfter,
    breakdown,
  } = input;

  if (!wasCountedAsNewCompletion && levelBefore === levelAfter && streakBefore === streakAfter) {
    return null;
  }

  if (levelAfter > levelBefore) return "You leveled up.";
  if (streakAfter > streakBefore && streakAfter >= 2) return "Your streak is still growing.";
  if (breakdown?.firstTryBonusXp && breakdown.firstTryBonusXp > 0) return "That first-try answer gave you a small boost.";
  if (curiosityScoreAfter > curiosityScoreBefore) return "This topic strengthened your curiosity score.";
  if (breakdown?.dailyBonusXp && breakdown.dailyBonusXp > 0) return "You completed today's pick.";
  if (breakdown?.randomBonusXp && breakdown.randomBonusXp > 0) return "You followed a random discovery.";
  if (input.xpEarned > 0) return "You're getting closer to your next level.";
  if (wasCountedAsNewCompletion) return "You explored something new today.";

  return null;
}
