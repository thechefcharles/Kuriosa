"use client";

import { useQuery } from "@tanstack/react-query";
import { publicProfileQueryKeys } from "@/lib/query/query-keys";
import type { PublicProfileView } from "@/types/social";
import type { UserBadgeView } from "@/types/progress-view";
import type { RecentTopicView } from "@/types/discovery";
import { fetchApi } from "@/lib/network/fetch-api";

export type PublicProfileData = {
  profile: PublicProfileView;
  badges: UserBadgeView[];
  recentTopics: RecentTopicView[];
};

export type UsePublicProfileResult =
  | { ok: true; data: PublicProfileData }
  | { ok: false; error: string; notFound?: boolean };

export function usePublicProfile(userId: string | null) {
  return useQuery<UsePublicProfileResult, Error>({
    queryKey: publicProfileQueryKeys.byUserId(userId ?? "__none__"),
    queryFn: async (): Promise<UsePublicProfileResult> => {
      if (!userId?.trim()) return { ok: false, error: "User ID required" };

      const res = await fetchApi(
        `/api/social/profile/${encodeURIComponent(userId)}`
      );
      const json = await res.json();

      if (!res.ok) {
        return {
          ok: false,
          error: json?.error ?? "Profile not found",
          notFound: json?.notFound ?? res.status === 404,
        };
      }

      if (!json.ok || !json.data) {
        return { ok: false, error: "Invalid response" };
      }

      return { ok: true, data: json.data as PublicProfileData };
    },
    enabled: Boolean(userId?.trim()),
  });
}
