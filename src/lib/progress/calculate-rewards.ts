/**
 * Pure XP calculation for a completion event.
 * Quiz-first model: XP from main quiz outcome.
 * - Wrong: no XP (must retry)
 * - Correct first try: base XP × daily multiplier
 * - Correct after retry: 5 XP only
 */

import type {
  CompletionEventInput,
  RewardCalculationResult,
} from "@/types/progress";
import {
  XP_CONFIG,
  getBaseXpFromDifficulty,
} from "@/lib/progress/xp-config";

function roundXp(n: number): number {
  return Math.round(Math.max(0, n));
}

/**
 * Calculate rewards for a completion event.
 * - Wrong: 0 XP (caller should not grant; user must retry)
 * - Correct first try: base XP (by difficulty) × daily multiplier, capped
 * - Correct after retry: 5 XP only (no bonus)
 */
export function calculateRewards(
  event: CompletionEventInput
): RewardCalculationResult {
  if (!event.challengeCorrect) {
    return {
      xpEarned: 0,
      breakdown: { mainQuizXp: 0, bonusQuestionXp: 0 },
      isPerfect: false,
    };
  }

  const firstTryCorrect = event.firstTryCorrect !== false;

  if (!firstTryCorrect) {
    return {
      xpEarned: XP_CONFIG.WRONG_ANSWER_XP,
      breakdown: {
        mainQuizXp: XP_CONFIG.WRONG_ANSWER_XP,
        bonusQuestionXp: 0,
      },
      isPerfect: false,
    };
  }

  const dailyMult =
    event.wasDailyFeature && event.dailyMultiplier != null
      ? event.dailyMultiplier
      : XP_CONFIG.DEFAULT_DAILY_MULTIPLIER;

  const base = getBaseXpFromDifficulty(event.difficultyLevel);
  const mainQuizXp = Math.min(
    roundXp(base * dailyMult),
    XP_CONFIG.MAX_XP_PER_COMPLETION
  );
  const bonusQuestionXp = event.bonusCorrect
    ? XP_CONFIG.BONUS_QUESTION_XP
    : 0;

  return {
    xpEarned: mainQuizXp + bonusQuestionXp,
    breakdown: {
      mainQuizXp,
      bonusQuestionXp,
      ...(event.wasDailyFeature && event.dailyMultiplier != null
        ? { dailyMultiplierApplied: event.dailyMultiplier }
        : {}),
    },
    isPerfect: event.challengeAttempted && event.challengeCorrect,
  };
}
