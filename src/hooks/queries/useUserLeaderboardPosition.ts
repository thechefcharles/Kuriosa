"use client";

import { useQuery } from "@tanstack/react-query";
import { leaderboardQueryKeys } from "@/lib/query/query-keys";
import { useAuthUserId } from "@/hooks/queries/useAuthUserId";
import type { LeaderboardWindow } from "@/types/leaderboard";
import type { UserLeaderboardPosition } from "@/types/leaderboard";

export function useUserLeaderboardPosition(window: LeaderboardWindow) {
  const { data: userId, isPending: authPending } = useAuthUserId();

  const q = useQuery<UserLeaderboardPosition, Error>({
    queryKey: leaderboardQueryKeys.position(window),
    queryFn: async () => {
      const params = new URLSearchParams({ window });
      const res = await fetch(`/api/social/leaderboard/position?${params}`, {
        credentials: "same-origin",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? `Position fetch failed: ${res.status}`);
      }
      const json = await res.json();
      if (!json.ok) throw new Error("Invalid position response");
      return json.data as UserLeaderboardPosition;
    },
    enabled: Boolean(userId),
  });

  return {
    ...q,
    isPending: authPending || (Boolean(userId) && q.isPending),
    isAuthenticated: Boolean(userId),
  };
}
