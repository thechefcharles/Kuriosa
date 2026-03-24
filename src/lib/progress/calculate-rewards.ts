import type {
  CompletionEventInput,
  RewardCalculationResult,
} from "@/types/progress";
import { XP_CONFIG, DIFFICULTY_MULTIPLIERS } from "@/lib/progress/xp-config";

/** Get difficulty multiplier (1.0, 1.1, or 1.2). Default 1.0. */
function getDifficultyMultiplier(difficultyLevel: string | null | undefined): number {
  if (!difficultyLevel?.trim()) return 1;
  const key = difficultyLevel.trim().toLowerCase();
  return (DIFFICULTY_MULTIPLIERS as Record<string, number>)[key] ?? 1;
}

/** Round XP for display — always whole numbers. */
function roundXp(n: number): number {
  return Math.round(Math.max(0, n));
}

/**
 * Pure XP calculation for a completion event. No DB, no side effects.
 * Callers (6.2+) persist totals and history.
 *
 * Difficulty multiplier: beginner=1.0, intermediate=1.1, advanced=1.2.
 * Applied to base sources (lesson, challenge, bonuses); first-try bonus is flat +5.
 * All breakdown values are rounded to integers.
 */
export function calculateRewards(
  event: CompletionEventInput
): RewardCalculationResult {
  if (event.wasDailyFeature && !event.challengeCorrect) {
    const xp = XP_CONFIG.DAILY_WRONG_ANSWER_XP;
    return {
      xpEarned: xp,
      breakdown: {
        lessonXp: 0,
        challengeXp: 0,
        perfectBonusXp: 0,
        bonusQuestionXp: 0,
        firstTryBonusXp: 0,
        dailyBonusXp: xp,
        randomBonusXp: 0,
        listenBonusXp: 0,
      },
      isPerfect: false,
    };
  }

  const isPerfect = event.challengeAttempted && event.challengeCorrect;
  const mult = getDifficultyMultiplier(event.difficultyLevel);
  const dailyMult = event.wasDailyFeature ? XP_CONFIG.DAILY_CHALLENGE_XP_MULTIPLIER : 1;

  const lessonBase = event.lessonCompleted ? XP_CONFIG.LESSON_COMPLETION_XP : 0;
  const challengeBase =
    event.challengeAttempted ? XP_CONFIG.CHALLENGE_COMPLETION_XP : 0;
  const perfectBase = isPerfect ? XP_CONFIG.PERFECT_CHALLENGE_BONUS_XP : 0;
  const bonusQuestionBase = event.bonusCorrect
    ? XP_CONFIG.BONUS_QUESTION_XP
    : 0;
  const dailyBase = event.wasDailyFeature
    ? XP_CONFIG.DAILY_COMPLETION_BONUS_XP
    : 0;
  const randomBase = event.wasRandomSpin
    ? XP_CONFIG.RANDOM_COMPLETION_BONUS_XP
    : 0;

  const lessonXp = roundXp(lessonBase * mult * dailyMult);
  const challengeXp = roundXp(challengeBase * mult * dailyMult);
  const perfectBonusXp = roundXp(perfectBase * mult * dailyMult);
  const bonusQuestionXp = roundXp(bonusQuestionBase * mult * dailyMult);
  const dailyBonusXp = roundXp(dailyBase * mult);
  const randomBonusXp = roundXp(randomBase * mult);

  const firstTryBonusXp =
    event.firstTryCorrect && event.challengeCorrect
      ? roundXp(XP_CONFIG.FIRST_TRY_CORRECT_BONUS_XP * dailyMult)
      : 0;

  const breakdown = {
    lessonXp,
    challengeXp,
    perfectBonusXp,
    bonusQuestionXp,
    firstTryBonusXp,
    dailyBonusXp,
    randomBonusXp,
    listenBonusXp: 0,
  };

  const xpEarned =
    lessonXp +
    challengeXp +
    perfectBonusXp +
    bonusQuestionXp +
    firstTryBonusXp +
    dailyBonusXp +
    randomBonusXp;

  return {
    xpEarned,
    breakdown,
    isPerfect,
  };
}
