"use client";

import { useQuery } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";
import { getTopicCompletionDetails } from "@/lib/services/progress/get-topic-completion-details";
import { progressQueryKeys } from "@/lib/query/query-keys";
import { useAuthUserId } from "@/hooks/queries/useAuthUserId";

export function useTopicCompletionDetails(topicId: string | undefined) {
  const supabase = createSupabaseBrowserClient();
  const { data: userId } = useAuthUserId();
  const tid = topicId?.trim() ?? "";

  return useQuery({
    queryKey: progressQueryKeys.topicCompletionDetails(tid, userId ?? "__guest__"),
    queryFn: () => getTopicCompletionDetails(supabase, userId!, tid),
    enabled: Boolean(tid) && Boolean(userId),
  });
}
