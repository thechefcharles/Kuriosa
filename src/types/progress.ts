/**
 * Progress / gamification types (Phase 6).
 */

/** Pure reward math input (no user/topic ids). */
export type CompletionEventInput = {
  lessonCompleted: boolean;
  challengeAttempted: boolean;
  challengeCorrect: boolean;
  /** True when bonus question was attempted and answered correctly. */
  bonusCorrect?: boolean;
  /** True when main challenge was correct on first try (no retry). */
  firstTryCorrect?: boolean;
  wasDailyFeature: boolean;
  wasRandomSpin: boolean;
  usedListenMode: boolean;
  /** Topic difficulty for multiplier: beginner, intermediate, advanced, etc. */
  difficultyLevel?: string | null;
};

/** Full payload for the progress processor (server-validated). */
export type CuriosityCompletionPayload = {
  userId: string;
  topicId: string;
  /** Must match topics.slug for the given topicId (tamper resistance). */
  slug: string;
  completedAt: string;
  /** Merged read / listen / read_listen */
  modeUsed: "read" | "listen" | "read_listen";
  lessonCompleted: boolean;
  challengeAttempted: boolean;
  challengeCorrect: boolean;
  bonusCorrect?: boolean;
  /** True when main challenge correct on first try (no retry). */
  firstTryCorrect?: boolean;
  wasDailyFeature: boolean;
  wasRandomSpin: boolean;
  usedListenMode: boolean;
  /** Optional; loaded from topics if omitted */
  categoryId?: string | null;
  /** Topic difficulty for XP multiplier; loaded from topics if omitted */
  difficultyLevel?: string | null;
};

/** Body sent from the client to record a challenge-flow completion (thin API). */
export type CompleteCuriosityClientPayload = {
  topicId: string;
  slug: string;
  modeUsed: "read" | "listen" | "read_listen";
  challengeCorrect: boolean;
  /** True when user attempted bonus question and got it right. */
  bonusCorrect?: boolean;
  /** True when main challenge correct on first try (no retry). */
  firstTryCorrect?: boolean;
  wasDailyFeature: boolean;
  wasRandomSpin: boolean;
};

export type RewardBreakdown = {
  lessonXp: number;
  challengeXp: number;
  perfectBonusXp: number;
  bonusQuestionXp: number;
  firstTryBonusXp: number;
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
  accuracyRatio: number;
  distinctCategoriesExplored: number;
  streakLength: number;
};

/** Single badge unlocked in this completion (for future celebration UI). */
export type UnlockedBadgeResult = {
  badgeId: string;
  slug: string;
  name: string;
  description: string | null;
  earnedAt: string;
};

export type ProgressUpdateSuccess = {
  xpEarned: number;
  wasCountedAsNewCompletion: boolean;
  levelBefore: number;
  levelAfter: number;
  /** XP still needed for next level (after this completion). */
  xpToNextLevel?: number;
  streakBefore: number;
  streakAfter: number;
  curiosityScoreBefore: number;
  curiosityScoreAfter: number;
  profileUpdated: boolean;
  historyUpdated: boolean;
  breakdown: RewardBreakdown | null;
  warnings: string[];
  /** Badges unlocked during this completion (empty if none or evaluation skipped). */
  unlockedBadges: UnlockedBadgeResult[];
  /** True when a new rewarded completion triggered badge evaluation. */
  badgeEvaluationRan: boolean;
};

export type ProgressUpdateResult =
  | { ok: true; data: ProgressUpdateSuccess }
  | { ok: false; message: string };

/** Eligibility snapshot (server); re-exported for API consumers. */
export type { BadgeEligibilityResult } from "@/lib/services/progress/evaluate-badge-eligibility";
