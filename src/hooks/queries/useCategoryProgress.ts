"use client";

import { useQuery } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";
import { getCompletedTopicsByCategory } from "@/lib/services/progress/get-completed-topics-by-category";
import { progressQueryKeys } from "@/lib/query/query-keys";
import { useAuthUserId } from "@/hooks/queries/useAuthUserId";
import type { CompletedTopicCardView } from "@/lib/services/progress/get-completed-topics-by-category";

export function useCategoryProgress(categorySlug: string | undefined) {
  const supabase = createSupabaseBrowserClient();
  const { data: userId } = useAuthUserId();
  const slug = categorySlug?.trim() ?? "";

  return useQuery<CompletedTopicCardView[], Error>({
    queryKey: progressQueryKeys.categoryProgress(slug || "__none__", userId ?? "__guest__"),
    queryFn: () => getCompletedTopicsByCategory(supabase, userId!, slug),
    enabled: Boolean(slug) && Boolean(userId),
  });
}
