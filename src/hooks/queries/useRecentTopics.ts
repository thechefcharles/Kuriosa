"use client";

import { useQuery } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";
import { getRecentTopics } from "@/lib/services/discovery/get-recent-topics";
import { discoveryQueryKeys } from "@/lib/query/query-keys";
import { useAuthUserId } from "@/hooks/queries/useAuthUserId";
import type { RecentTopicView } from "@/types/discovery";

export function useRecentTopics() {
  const supabase = createSupabaseBrowserClient();
  const { data: userId, isPending: authPending } = useAuthUserId();

  const q = useQuery<RecentTopicView[], Error>({
    queryKey: discoveryQueryKeys.recent(userId ?? "__none__"),
    queryFn: async () => {
      if (!userId) return [];
      return getRecentTopics(supabase, userId);
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
