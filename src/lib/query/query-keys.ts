/**
 * Central React Query keys for curiosity content and user progress.
 */

export const curiosityQueryKeys = {
  all: ["curiosity"] as const,
  daily: (dateISO?: string) =>
    [...curiosityQueryKeys.all, "daily", dateISO ?? "today"] as const,
  random: (difficulty?: string, excludeSlug?: string) =>
    [
      ...curiosityQueryKeys.all,
      "random",
      difficulty ?? "any",
      excludeSlug ?? "none",
    ] as const,
  bySlug: (slug: string) =>
    [...curiosityQueryKeys.all, "slug", slug] as const,
} as const;

/** User-scoped progress reads (6.4). Always include real userId when known. */
export const progressQueryKeys = {
  all: ["progress"] as const,
  completedTopicIds: (userId: string) =>
    [...progressQueryKeys.all, "completedTopicIds", userId] as const,
  summary: (userId: string) =>
    [...progressQueryKeys.all, "summary", userId] as const,
  badges: (userId: string) =>
    [...progressQueryKeys.all, "badges", userId] as const,
  stats: (userId: string) =>
    [...progressQueryKeys.all, "stats", userId] as const,
  categoryXp: (userId: string) =>
    [...progressQueryKeys.all, "categoryXp", userId] as const,
  profileProgress: (userId: string) =>
    [...progressQueryKeys.all, "profile-progress", userId] as const,
} as const;

export const discoveryQueryKeys = {
  categories: ["discovery", "categories"] as const,
  categoriesWithCounts: ["discovery", "categories", "counts"] as const,
  topicsByCategory: (slug: string) =>
    ["discovery", "category", slug] as const,
  categoryDetail: (slug: string) =>
    ["discovery", "category-detail", slug] as const,
  featured: (userId?: string | null) =>
    ["discovery", "featured", userId ?? "guest"] as const,
  recent: (userId: string) => ["discovery", "recent", userId] as const,
  searchTopics: (query: string) =>
    ["discovery", "search", query] as const,
  suggestedTopics: (userId?: string | null) =>
    ["discovery", "suggested", userId ?? "guest"] as const,
} as const;

/** Phase 10.5 — Public profile. */
export const publicProfileQueryKeys = {
  all: ["public-profile"] as const,
  byUserId: (userId: string) =>
    [...publicProfileQueryKeys.all, userId] as const,
} as const;

/** Phase 10.5 — Privacy settings. */
export const privacySettingsQueryKeys = {
  all: ["privacy-settings"] as const,
} as const;

/** Phase 10.4 — Activity feed. */
export const activityFeedQueryKeys = {
  all: ["activity-feed"] as const,
  list: (limit?: number, offset?: number) =>
    [...activityFeedQueryKeys.all, "list", limit ?? 20, offset ?? 0] as const,
} as const;

/** Phase 10.3 — Leaderboard. */
export const leaderboardQueryKeys = {
  all: ["leaderboard"] as const,
  list: (window: string, limit?: number, offset?: number) =>
    [...leaderboardQueryKeys.all, "list", window, limit ?? 50, offset ?? 0] as const,
  position: (window: string) =>
    [...leaderboardQueryKeys.all, "position", window] as const,
} as const;

/** Phase 9.4 — AI exploration (guided follow-ups, rabbit holes). */
export const aiExplorationQueryKeys = {
  topicExploration: (slugOrId: string) =>
    ["ai", "topic-exploration", slugOrId] as const,
} as const;
