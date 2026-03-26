"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privacySettingsQueryKeys } from "@/lib/query/query-keys";
import type { ProfilePrivacySettings } from "@/types/social";
import { fetchApiWithOptionalAuth } from "@/lib/network/fetch-api-session";

type UpdatePrivacyInput = Partial<
  Pick<ProfilePrivacySettings, "isPublicProfile" | "allowActivityFeed" | "allowLeaderboard">
>;

export function useUpdatePrivacySettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdatePrivacyInput) => {
      const res = await fetchApiWithOptionalAuth("/api/social/settings/privacy", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error ?? "Failed to update settings");
      }
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: privacySettingsQueryKeys.all });
    },
  });
}
