/**
 * Progress / gamification types (Phase 6).
 */

/** Pure reward math input (no user/topic ids). */
export type CompletionEventInput = {
  lessonCompleted: boolean;
  challengeAttempted: boolean;
  challengeCorrect: boolean;
  wasDailyFeature: boolean;
  wasRandomSpin: boolean;
  usedListenMode: boolean;
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
  wasDailyFeature: boolean;
  wasRandomSpin: boolean;
  usedListenMode: boolean;
  /** Optional; loaded from topics if omitted */
  categoryId?: string | null;
};

/** Body sent from the client to record a challenge-flow completion (thin API). */
export type CompleteCuriosityClientPayload = {
  topicId: string;
  slug: string;
  modeUsed: "read" | "listen" | "read_listen";
  challengeCorrect: boolean;
  wasDailyFeature: boolean;
  wasRandomSpin: boolean;
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

export type ProgressUpdateSuccess = {
  xpEarned: number;
  wasCountedAsNewCompletion: boolean;
  levelBefore: number;
  levelAfter: number;
  streakBefore: number;
  streakAfter: number;
  curiosityScoreBefore: number;
  curiosityScoreAfter: number;
  profileUpdated: boolean;
  historyUpdated: boolean;
  breakdown: RewardBreakdown | null;
  warnings: string[];
};

export type ProgressUpdateResult =
  | { ok: true; data: ProgressUpdateSuccess }
  | { ok: false; message: string };
