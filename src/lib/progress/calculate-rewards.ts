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
  const isPerfect = event.challengeAttempted && event.challengeCorrect;
  const mult = getDifficultyMultiplier(event.difficultyLevel);

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
  const listenBase =
    event.usedListenMode && event.lessonCompleted
      ? XP_CONFIG.LISTEN_MODE_BONUS_XP
      : 0;

  const lessonXp = roundXp(lessonBase * mult);
  const challengeXp = roundXp(challengeBase * mult);
  const perfectBonusXp = roundXp(perfectBase * mult);
  const bonusQuestionXp = roundXp(bonusQuestionBase * mult);
  const dailyBonusXp = roundXp(dailyBase * mult);
  const randomBonusXp = roundXp(randomBase * mult);
  const listenBonusXp = roundXp(listenBase * mult);

  const firstTryBonusXp =
    event.firstTryCorrect && event.challengeCorrect
      ? XP_CONFIG.FIRST_TRY_CORRECT_BONUS_XP
      : 0;

  const breakdown = {
    lessonXp,
    challengeXp,
    perfectBonusXp,
    bonusQuestionXp,
    firstTryBonusXp,
    dailyBonusXp,
    randomBonusXp,
    listenBonusXp,
  };

  const xpEarned =
    lessonXp +
    challengeXp +
    perfectBonusXp +
    bonusQuestionXp +
    firstTryBonusXp +
    dailyBonusXp +
    randomBonusXp +
    listenBonusXp;

  return {
    xpEarned,
    breakdown,
    isPerfect,
  };
}
