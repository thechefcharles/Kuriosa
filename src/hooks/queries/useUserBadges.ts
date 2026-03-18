"use client";

import { useQuery } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";
import { getUserBadges } from "@/lib/services/progress/get-user-badges";
import { progressQueryKeys } from "@/lib/query/query-keys";
import { useAuthUserId } from "@/hooks/queries/useAuthUserId";
import type { UserBadgeView } from "@/types/progress-view";

export function useUserBadges() {
  const supabase = createSupabaseBrowserClient();
  const { data: userId, isPending: authPending } = useAuthUserId();

  const q = useQuery<UserBadgeView[], Error>({
    queryKey: progressQueryKeys.badges(userId ?? "__none__"),
    queryFn: async () => {
      if (!userId) return [];
      return getUserBadges(supabase, userId);
    },
    enabled: Boolean(userId),
  });

  return {
    ...q,
    data: q.data ?? [],
    isPending: authPending || (Boolean(userId) && q.isPending),
    isAuthenticated: Boolean(userId),
  };
}
