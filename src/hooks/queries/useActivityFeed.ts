"use client";

import { useQuery } from "@tanstack/react-query";
import { activityFeedQueryKeys } from "@/lib/query/query-keys";
import type { ActivityFeedItemView } from "@/types/activity-feed";
import { fetchApi } from "@/lib/network/fetch-api";

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
      const res = await fetchApi(`/api/social/activity-feed?${params}`);
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
