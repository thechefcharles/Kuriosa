"use client";

import { useQuery } from "@tanstack/react-query";
import { activityFeedQueryKeys } from "@/lib/query/query-keys";
import type { ActivityFeedItemView } from "@/types/activity-feed";

export type UseActivityFeedOptions = {
  limit?: number;
  offset?: number;
  enabled?: boolean;
};

export function useActivityFeed(options: UseActivityFeedOptions = {}) {
  const { limit = 20, offset = 0, enabled = true } = options;

  return useQuery<ActivityFeedItemView[], Error>({
    queryKey: activityFeedQueryKeys.list(limit, offset),
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
      });
      const res = await fetch(`/api/social/activity-feed?${params}`, {
        credentials: "same-origin",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? `Activity feed fetch failed: ${res.status}`);
      }
      const json = await res.json();
      if (!json.ok || !Array.isArray(json.data))
        throw new Error("Invalid activity feed response");
      return json.data as ActivityFeedItemView[];
    },
    enabled,
  });
}
