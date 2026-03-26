"use client";

import { useQuery } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";
import { getTopicsByCategory } from "@/lib/services/discovery/get-topics-by-category";
import { discoveryQueryKeys } from "@/lib/query/query-keys";
import { useAuthUserId } from "@/hooks/queries/useAuthUserId";
import type { TopicCardView } from "@/types/discovery";

export function useTopicsByCategory(categorySlug: string | undefined) {
  const supabase = createSupabaseBrowserClient();
  const { data: userId } = useAuthUserId();
  const slug = categorySlug?.trim() ?? "";

  return useQuery<TopicCardView[], Error>({
    queryKey: [...discoveryQueryKeys.topicsByCategory(slug || "__none__"), userId ?? "guest"],
    queryFn: () => getTopicsByCategory(supabase, slug, { userId: userId ?? null }),
    enabled: Boolean(slug),
  });
}
