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
  summary: (userId: string) =>
    [...progressQueryKeys.all, "summary", userId] as const,
  badges: (userId: string) =>
    [...progressQueryKeys.all, "badges", userId] as const,
  stats: (userId: string) =>
    [...progressQueryKeys.all, "stats", userId] as const,
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
  featured: ["discovery", "featured"] as const,
  recent: (userId: string) => ["discovery", "recent", userId] as const,
} as const;
