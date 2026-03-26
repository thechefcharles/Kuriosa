/**
 * Phase 10 — Social layer types.
 * Public profiles, activity events, privacy settings.
 */

export type PublicProfileView = {
  id: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  curiosityScore: number;
  level: number;
  badgesCount: number;
  topicsExploredCount: number;
};

export type ActivityEventType =
  | "topic_completed"
  | "badge_unlocked"
  | "level_up";

export type ActivityEvent = {
  id: string;
  userId: string;
  type: string;
  topicId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

export type ProfilePrivacySettings = {
  isPublicProfile: boolean;
  allowActivityFeed: boolean;
  allowLeaderboard: boolean;
};
