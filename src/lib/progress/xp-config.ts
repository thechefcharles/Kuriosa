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
  DAILY_COMPLETION_BONUS_XP: 5,
  RANDOM_COMPLETION_BONUS_XP: 5,
  /** Small nod for using narration */
  LISTEN_MODE_BONUS_XP: 3,
} as const;

export type XpConfigKey = keyof typeof XP_CONFIG;
