"use client";

import { useQuery } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";
import { getCategories } from "@/lib/services/discovery/get-categories";
import { discoveryQueryKeys } from "@/lib/query/query-keys";
import type { CategoryView } from "@/types/discovery";

export function useCategories(options?: { withTopicCounts?: boolean }) {
  const supabase = createSupabaseBrowserClient();
  const withCounts = Boolean(options?.withTopicCounts);

  return useQuery<CategoryView[], Error>({
    queryKey: withCounts
      ? discoveryQueryKeys.categoriesWithCounts
      : discoveryQueryKeys.categories,
    queryFn: () => getCategories(supabase, { withTopicCounts: withCounts }),
  });
}
