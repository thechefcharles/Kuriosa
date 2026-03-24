/**
 * Pure XP calculation for a completion event.
 * Quiz-first model: XP from main quiz outcome + optional bonus question.
 * See XP_BADGES_AND_DAILY_MULTIPLIER_OVERHAUL.md.
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
 * - Correct main quiz: base XP (by difficulty) × daily multiplier, capped
 * - Wrong main quiz: 5 XP participation
 * - Bonus question correct: +10 flat (no multiplier)
 */
export function calculateRewards(
  event: CompletionEventInput
): RewardCalculationResult {
  const dailyMult =
    event.wasDailyFeature && event.dailyMultiplier != null
      ? event.dailyMultiplier
      : XP_CONFIG.DEFAULT_DAILY_MULTIPLIER;

  let mainQuizXp: number;
  if (event.challengeCorrect) {
    const base = getBaseXpFromDifficulty(event.difficultyLevel);
    mainQuizXp = roundXp(base * dailyMult);
    mainQuizXp = Math.min(mainQuizXp, XP_CONFIG.MAX_XP_PER_COMPLETION);
  } else {
    mainQuizXp = XP_CONFIG.WRONG_ANSWER_XP;
  }

  const bonusQuestionXp = event.bonusCorrect
    ? XP_CONFIG.BONUS_QUESTION_XP
    : 0;

  const xpEarned = mainQuizXp + bonusQuestionXp;

  return {
    xpEarned,
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
