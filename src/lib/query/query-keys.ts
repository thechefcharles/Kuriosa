/**
 * Central React Query keys for curiosity content.
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
