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

/** Parts for rendering with name and topic linking. */
export function formatActivityEventParts(item: ActivityFeedItemView): {
  name: string;
  beforeTopic: string;
  topicTitle: string | null;
  afterTopic: string;
} {
  const name = item.displayName?.trim() || "Someone";
  const topic = item.topicTitle?.trim() || null;

  switch (item.type) {
    case "topic_completed":
      return {
        name,
        beforeTopic: " explored ",
        topicTitle: topic ?? "a curiosity topic",
        afterTopic: ".",
      };
    case "topic_shared":
      return {
        name,
        beforeTopic: " shared ",
        topicTitle: topic ?? "a curiosity topic",
        afterTopic: ".",
      };
    case "badge_unlocked":
      return {
        name,
        beforeTopic: "",
        topicTitle: null,
        afterTopic: ` unlocked the ${item.badgeName?.trim() || "Explorer"} badge.`,
      };
    case "level_up":
      return {
        name,
        beforeTopic: "",
        topicTitle: null,
        afterTopic: " leveled up!",
      };
    default:
      return {
        name,
        beforeTopic: "",
        topicTitle: null,
        afterTopic: " did something curious.",
      };
  }
}
