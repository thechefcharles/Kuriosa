/**
 * Progress / gamification types (Phase 6).
 * Reward application (DB writes) lives in later prompts; 6.1 is calculation-only.
 */

/** Inputs for a single completion moment (e.g. loop finished after challenge). */
export type CompletionEventInput = {
  /** User consumed the lesson (read and/or listen). */
  lessonCompleted: boolean;
  /** User submitted the challenge. */
  challengeAttempted: boolean;
  /** Challenge was answered correctly (only meaningful if challengeAttempted). */
  challengeCorrect: boolean;
  /** Topic was the daily feature when user entered. */
  wasDailyFeature: boolean;
  /** User arrived via random discovery. */
  wasRandomSpin: boolean;
  /** User used Listen mode at least once this visit. */
  usedListenMode: boolean;
};

export type RewardBreakdown = {
  lessonXp: number;
  challengeXp: number;
  perfectBonusXp: number;
  dailyBonusXp: number;
  randomBonusXp: number;
  listenBonusXp: number;
};

export type RewardCalculationResult = {
  xpEarned: number;
  breakdown: RewardBreakdown;
  isPerfect: boolean;
};

export type LevelInfo = {
  level: number;
  totalXp: number;
  xpIntoLevel: number;
  xpToNextLevel: number;
};

export type StreakInfo = {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
};

/** Snapshot of profile progress columns (read models for UI later). */
export type UserProgressSnapshot = {
  totalXp: number;
  currentLevel: number;
  curiosityScore: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
};

export type CuriosityScoreInput = {
  topicsCompleted: number;
  /** 0–1, e.g. correct / attempted */
  accuracyRatio: number;
  distinctCategoriesExplored: number;
  streakLength: number;
};
