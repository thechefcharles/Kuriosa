"use client";

import { useQuery } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";
import { getSuggestedTopics } from "@/lib/services/discovery/get-suggested-topics";
import { discoveryQueryKeys } from "@/lib/query/query-keys";
import { useAuthUserId } from "@/hooks/queries/useAuthUserId";
import type { TopicCardView } from "@/types/discovery";

export function useSuggestedTopics() {
  const supabase = createSupabaseBrowserClient();
  const { data: userId, isPending: authPending } = useAuthUserId();
  const keyUser = userId ?? null;

  const q = useQuery<TopicCardView[], Error>({
    queryKey: discoveryQueryKeys.suggestedTopics(keyUser ?? undefined),
    queryFn: () => getSuggestedTopics(supabase, keyUser),
    enabled: !authPending,
    staleTime: 90_000,
  });

  return {
    ...q,
    data: q.data ?? [],
    isPending: authPending || q.isPending,
  };
}
