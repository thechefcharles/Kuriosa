/**
 * Central XP amounts for user progress (grants on completion).
 * Quiz-first model: XP comes primarily from quiz outcomes.
 * See XP_BADGES_AND_DAILY_MULTIPLIER_OVERHAUL.md for design.
 *
 * Note: Content drafts may suggest `rewards.xpAward` on topics; that is editorial metadata,
 * not the same as these user-grant constants.
 */

export const XP_CONFIG = {
  /** Base XP by difficulty when main quiz is correct */
  BEGINNER_XP: 10,
  INTERMEDIATE_XP: 20,
  ADVANCED_XP: 30,
  EXPERT_XP: 40,
  /** Participation XP when main quiz is wrong (no retry XP) */
  WRONG_ANSWER_XP: 5,
  /** Bonus question correct = flat +10, no multiplier */
  BONUS_QUESTION_XP: 10,
  /** Daily multiplier range (1.2, 1.5, 1.8, 2.0, 2.5) — stored per day in daily_curiosity */
  DAILY_MULTIPLIERS: [1.2, 1.5, 1.8, 2.0, 2.5] as const,
  /** Default when no daily row exists (non-daily topic) */
  DEFAULT_DAILY_MULTIPLIER: 1,
  /** Cap on final XP per completion (avoids expert+2.5x explosion) */
  MAX_XP_PER_COMPLETION: 150,
} as const;

/** Base XP by difficulty level (correct answer only) */
export const DIFFICULTY_XP: Record<string, number> = {
  beginner: XP_CONFIG.BEGINNER_XP,
  easy: XP_CONFIG.BEGINNER_XP,
  intermediate: XP_CONFIG.INTERMEDIATE_XP,
  advanced: XP_CONFIG.ADVANCED_XP,
  expert: XP_CONFIG.EXPERT_XP,
};

export type XpConfigKey = keyof typeof XP_CONFIG;

/**
 * Base XP for a correct answer from difficulty.
 * Wrong answers always give WRONG_ANSWER_XP.
 */
export function getBaseXpFromDifficulty(
  difficultyLevel: string | null | undefined
): number {
  const key = (difficultyLevel ?? "beginner").trim().toLowerCase();
  return DIFFICULTY_XP[key] ?? XP_CONFIG.BEGINNER_XP;
}

/**
 * Card display value (correct answer XP) — used on topic cards.
 * Does not include daily multiplier (that's shown separately when applicable).
 */
export function getCardXpFromDifficulty(
  difficultyLevel: string | null | undefined
): number {
  return getBaseXpFromDifficulty(difficultyLevel);
}
