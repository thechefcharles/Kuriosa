/**
 * Phase 10.3 — Leaderboard data model.
 */

export type LeaderboardWindow = "weekly" | "monthly" | "all_time";

export type LeaderboardEntryView = {
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  rank: number;
  score: number;
  curiosityScore?: number;
  totalXp?: number;
  level?: number;
  topicsExplored?: number;
  isCurrentUser?: boolean;
};

export type LeaderboardSummaryView = {
  window: LeaderboardWindow;
  entries: LeaderboardEntryView[];
  totalEligible: number;
  windowStart: string | null;
  windowEnd: string | null;
};

export type UserLeaderboardPosition = {
  window: LeaderboardWindow;
  rank: number;
  score: number;
  totalEligible: number;
  entry: LeaderboardEntryView;
} | null;
