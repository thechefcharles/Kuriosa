"use client";

import { useQuery } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";
import { getCategoryDetail } from "@/lib/services/discovery/get-category-detail";
import { discoveryQueryKeys } from "@/lib/query/query-keys";
import type { CategoryDetailView } from "@/types/discovery";

export function useCategoryDetail(categorySlug: string | undefined) {
  const supabase = createSupabaseBrowserClient();
  const slug = categorySlug?.trim().toLowerCase() ?? "";

  return useQuery<CategoryDetailView | null, Error>({
    queryKey: discoveryQueryKeys.categoryDetail(slug || "__none__"),
    queryFn: () => getCategoryDetail(supabase, slug),
    enabled: Boolean(slug),
  });
}
