"use client";

import { useQuery } from "@tanstack/react-query";
import { leaderboardQueryKeys } from "@/lib/query/query-keys";
import type { LeaderboardWindow } from "@/types/leaderboard";
import type { LeaderboardSummaryView } from "@/types/leaderboard";

export type UseLeaderboardOptions = {
  limit?: number;
  offset?: number;
  enabled?: boolean;
};

export function useLeaderboard(
  window: LeaderboardWindow,
  options: UseLeaderboardOptions = {}
) {
  const { limit = 50, offset = 0, enabled = true } = options;

  return useQuery<LeaderboardSummaryView, Error>({
    queryKey: leaderboardQueryKeys.list(window, limit, offset),
    queryFn: async () => {
      const params = new URLSearchParams({
        window,
        limit: String(limit),
        offset: String(offset),
      });
      const res = await fetch(`/api/social/leaderboard?${params}`, {
        credentials: "same-origin",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? `Leaderboard fetch failed: ${res.status}`);
      }
      const json = await res.json();
      if (!json.ok || !json.data) throw new Error("Invalid leaderboard response");
      return json.data as LeaderboardSummaryView;
    },
    enabled,
  });
}
