"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";
import { getCompletedTopicIds } from "@/lib/services/progress/get-completed-topic-ids";
import { progressQueryKeys } from "@/lib/query/query-keys";
import { useAuthUserId } from "@/hooks/queries/useAuthUserId";

/**
 * Returns topic IDs the user has completed (rewards_granted).
 * Used for What's next gating and completion badges.
 */
export function useCompletedTopicIds() {
  const { data: userId } = useAuthUserId();

  const query = useQuery<string[], Error>({
    queryKey: progressQueryKeys.completedTopicIds(userId ?? "__none__"),
    queryFn: async () => {
      if (!userId?.trim()) return [];
      const supabase = createSupabaseBrowserClient();
      return getCompletedTopicIds(supabase, userId);
    },
    enabled: Boolean(userId?.trim()),
  });

  const completedSet = useMemo(
    () => (query.data ? new Set(query.data) : new Set<string>()),
    [query.data]
  );

  return {
    ...query,
    completedIds: query.data ?? [],
    isCompleted: (topicId: string) => completedSet.has(topicId),
  };
}
