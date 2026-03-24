"use client";

import { useQuery } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";
import { searchTopics } from "@/lib/services/discovery/search-topics";
import { discoveryQueryKeys } from "@/lib/query/query-keys";
import { useAuthUserId } from "@/hooks/queries/useAuthUserId";
import type { TopicCardView } from "@/types/discovery";

function normalizeQuery(q: string): string {
  return q.trim().replace(/\s+/g, " ");
}

export function useSearchTopics(rawQuery: string) {
  const supabase = createSupabaseBrowserClient();
  const { data: userId } = useAuthUserId();
  const query = normalizeQuery(rawQuery);
  const enabled = query.length >= 2;

  return useQuery<TopicCardView[], Error>({
    queryKey: [...discoveryQueryKeys.searchTopics(query), userId ?? "guest"],
    queryFn: () => searchTopics(supabase, query, { userId: userId ?? null }),
    enabled,
  });
}
