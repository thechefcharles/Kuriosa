"use client";

import { useQuery } from "@tanstack/react-query";
import { privacySettingsQueryKeys } from "@/lib/query/query-keys";
import { useAuthUserId } from "@/hooks/queries/useAuthUserId";
import type { ProfilePrivacySettings } from "@/types/social";

export function useProfilePrivacy() {
  const { data: userId, isPending: authPending } = useAuthUserId();

  const q = useQuery<ProfilePrivacySettings | null, Error>({
    queryKey: privacySettingsQueryKeys.all,
    queryFn: async () => {
      const res = await fetch("/api/social/settings/privacy", {
        credentials: "same-origin",
      });
      if (!res.ok) {
        if (res.status === 401) return null;
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? "Failed to load privacy settings");
      }
      const json = await res.json();
      if (!json.ok || !json.data) return null;
      return json.data as ProfilePrivacySettings;
    },
    enabled: Boolean(userId),
  });

  return {
    ...q,
    isPending: authPending || (Boolean(userId) && q.isPending),
    isAuthenticated: Boolean(userId),
  };
}
