/**
 * Frontend-facing progress shapes (Phase 6.4). UI consumes these, not raw DB rows.
 */

export type UserStreakView = {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
};

/** One earned badge for lists and celebration prep. */
export type UserBadgeView = {
  badgeId: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  earnedAt: string;
};

/**
 * Headline progress: XP, level bar, score, streaks.
 * Level fields derived from totalXP via shared level-config (same as server).
 */
export type UserProgressSummary = {
  totalXP: number;
  currentLevel: number;
  /** 0–1 progress within current level. */
  currentLevelProgress: number;
  /** XP accumulated inside this level. */
  xpIntoCurrentLevel: number;
  /** XP required to complete this level (denominator for bar). */
  xpRequiredForCurrentLevel: number;
  /** XP still needed to hit next level. */
  nextLevelXP: number;
  curiosityScore: number;
  streak: UserStreakView;
};

/** Profile identity + progress headline (profile / dashboard shells). */
export type UserProfileProgressView = {
  userId: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  summary: UserProgressSummary;
};

/** Aggregate stats + recent unlocks for stats cards / dev verification. */
export type ProgressStatsView = {
  totalTopicsCompleted: number;
  categoriesExplored: number;
  badgesEarned: number;
  /** Most recent unlocks first (e.g. last 8). */
  recentBadgeUnlocks: UserBadgeView[];
  randomCompletionsCount: number;
  perfectChallengesCount: number;
};
