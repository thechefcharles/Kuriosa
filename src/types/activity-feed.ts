/**
 * Phase 10.4 — Activity feed view types.
 */

export type ActivityFeedItemView = {
  id: string;
  userId: string;
  displayName: string | null;
  type: string;
  topicId: string | null;
  topicTitle: string | null;
  topicSlug: string | null;
  badgeName: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};
