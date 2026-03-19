"use client";

import { useQuery } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";
import { getUserProgressStats } from "@/lib/services/progress/get-user-progress-stats";
import { progressQueryKeys } from "@/lib/query/query-keys";
import { useAuthUserId } from "@/hooks/queries/useAuthUserId";
import type { ProgressStatsView } from "@/types/progress-view";

export function useUserProgressStats() {
  const supabase = createSupabaseBrowserClient();
  const { data: userId, isPending: authPending } = useAuthUserId();

  const q = useQuery<ProgressStatsView | null, Error>({
    queryKey: progressQueryKeys.stats(userId ?? "__none__"),
    queryFn: async () => {
      if (!userId) return null;
      return getUserProgressStats(supabase, userId);
    },
    enabled: Boolean(userId),
  });

  return {
    ...q,
    isPending: authPending || (Boolean(userId) && q.isPending),
    isAuthenticated: Boolean(userId),
  };
}
