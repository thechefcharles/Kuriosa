"use client";

import { useQuery } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";
import { getUserProgressSummary } from "@/lib/services/progress/get-user-progress-summary";
import { progressQueryKeys } from "@/lib/query/query-keys";
import { useAuthUserId } from "@/hooks/queries/useAuthUserId";
import type { UserProgressSummary } from "@/types/progress-view";

export function useUserProgressSummary() {
  const supabase = createSupabaseBrowserClient();
  const { data: userId, isPending: authPending } = useAuthUserId();

  const q = useQuery<UserProgressSummary | null, Error>({
    queryKey: progressQueryKeys.summary(userId ?? "__none__"),
    queryFn: async () => {
      if (!userId) return null;
      return getUserProgressSummary(supabase, userId);
    },
    enabled: Boolean(userId),
  });

  return {
    ...q,
    isPending: authPending || (Boolean(userId) && q.isPending),
    isAuthenticated: Boolean(userId),
  };
}
