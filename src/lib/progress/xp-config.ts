/**
 * Central XP amounts for user progress (grants on completion).
 * Tune here only — do not duplicate in UI or ad-hoc services.
 *
 * Note: Content drafts may suggest `rewards.xpAward` on topics; that is editorial metadata,
 * not the same as these user-grant constants.
 */

export const XP_CONFIG = {
  LESSON_COMPLETION_XP: 10,
  CHALLENGE_COMPLETION_XP: 20,
  PERFECT_CHALLENGE_BONUS_XP: 10,
  /** Bonus (second) question answered correctly */
  BONUS_QUESTION_XP: 10,
  DAILY_COMPLETION_BONUS_XP: 5,
  RANDOM_COMPLETION_BONUS_XP: 5,
  /** Main challenge correct on first try (no retry) */
  FIRST_TRY_CORRECT_BONUS_XP: 5,
} as const;

/** Difficulty multipliers: beginner=1.0, intermediate=1.1, advanced=1.2 */
export const DIFFICULTY_MULTIPLIERS = {
  beginner: 1.0,
  easy: 1.0,
  intermediate: 1.1,
  advanced: 1.2,
  expert: 1.2,
} as const;

export type XpConfigKey = keyof typeof XP_CONFIG;

/** Card value (lesson + challenge) from difficulty — for display on topic cards. */
export function getCardXpFromDifficulty(
  difficultyLevel: string | null | undefined
): number {
  const base =
    XP_CONFIG.LESSON_COMPLETION_XP + XP_CONFIG.CHALLENGE_COMPLETION_XP;
  const key = (difficultyLevel ?? "").trim().toLowerCase();
  const mult =
    (DIFFICULTY_MULTIPLIERS as Record<string, number>)[key] ?? 1;
  return Math.round(base * mult);
}
