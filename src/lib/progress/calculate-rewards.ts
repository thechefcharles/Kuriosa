import type {
  CompletionEventInput,
  RewardCalculationResult,
} from "@/types/progress";
import { XP_CONFIG } from "@/lib/progress/xp-config";

/**
 * Pure XP calculation for a completion event. No DB, no side effects.
 * Callers (6.2+) persist totals and history.
 */
export function calculateRewards(
  event: CompletionEventInput
): RewardCalculationResult {
  const isPerfect = event.challengeAttempted && event.challengeCorrect;

  const lessonXp = event.lessonCompleted ? XP_CONFIG.LESSON_COMPLETION_XP : 0;
  const challengeXp =
    event.challengeAttempted ? XP_CONFIG.CHALLENGE_COMPLETION_XP : 0;
  const perfectBonusXp = isPerfect ? XP_CONFIG.PERFECT_CHALLENGE_BONUS_XP : 0;
  const dailyBonusXp = event.wasDailyFeature
    ? XP_CONFIG.DAILY_COMPLETION_BONUS_XP
    : 0;
  const randomBonusXp = event.wasRandomSpin
    ? XP_CONFIG.RANDOM_COMPLETION_BONUS_XP
    : 0;
  const listenBonusXp =
    event.usedListenMode && event.lessonCompleted
      ? XP_CONFIG.LISTEN_MODE_BONUS_XP
      : 0;

  const breakdown = {
    lessonXp,
    challengeXp,
    perfectBonusXp,
    dailyBonusXp,
    randomBonusXp,
    listenBonusXp,
  };

  const xpEarned =
    lessonXp +
    challengeXp +
    perfectBonusXp +
    dailyBonusXp +
    randomBonusXp +
    listenBonusXp;

  return {
    xpEarned,
    breakdown,
    isPerfect,
  };
}
