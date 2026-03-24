/**
 * Phase 10.4 — Human-readable activity event formatting.
 */

import type { ActivityFeedItemView } from "@/types/activity-feed";

/**
 * Format an activity feed item as a short, human-readable line.
 * e.g. "Alex explored the physics of lightning."
 */
export function formatActivityEventLine(item: ActivityFeedItemView): string {
  const name = item.displayName?.trim() || "Someone";
  const topic = item.topicTitle?.trim() || "a curiosity topic";

  switch (item.type) {
    case "topic_completed":
      return `${name} explored ${topic}.`;
    case "topic_shared":
      return `${name} shared ${topic}.`;
    case "badge_unlocked":
      return `${name} unlocked the ${item.badgeName?.trim() || "Explorer"} badge.`;
    case "level_up":
      return `${name} leveled up!`;
    default:
      return `${name} did something curious.`;
  }
}
