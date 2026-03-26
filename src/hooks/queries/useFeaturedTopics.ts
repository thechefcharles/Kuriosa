"use client";

import { useQuery } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";
import { getFeaturedTopics } from "@/lib/services/discovery/get-featured-topics";
import { discoveryQueryKeys } from "@/lib/query/query-keys";
import { useAuthUserId } from "@/hooks/queries/useAuthUserId";
import type { TopicCardView } from "@/types/discovery";

export function useFeaturedTopics() {
  const supabase = createSupabaseBrowserClient();
  const { data: userId } = useAuthUserId();

  return useQuery<TopicCardView[], Error>({
    queryKey: discoveryQueryKeys.featured(userId ?? undefined),
    queryFn: () => getFeaturedTopics(supabase, { userId: userId ?? null }),
  });
}
