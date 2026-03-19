"use client";

import { useQuery } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";
import { getUserProfileProgress } from "@/lib/services/progress/get-user-profile-progress";
import { progressQueryKeys } from "@/lib/query/query-keys";
import { useAuthUserId } from "@/hooks/queries/useAuthUserId";
import type { UserProfileProgressView } from "@/types/progress-view";

export function useUserProfileProgress() {
  const supabase = createSupabaseBrowserClient();
  const { data: userId, isPending: authPending } = useAuthUserId();

  const q = useQuery<UserProfileProgressView | null, Error>({
    queryKey: progressQueryKeys.profileProgress(userId ?? "__none__"),
    queryFn: async () => {
      if (!userId) return null;
      return getUserProfileProgress(supabase, userId);
    },
    enabled: Boolean(userId),
  });

  return {
    ...q,
    isPending: authPending || (Boolean(userId) && q.isPending),
    isAuthenticated: Boolean(userId),
  };
}
