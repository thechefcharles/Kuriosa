"use client";

import { useQuery } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";
import { getCategoryDetail } from "@/lib/services/discovery/get-category-detail";
import { discoveryQueryKeys } from "@/lib/query/query-keys";
import { useAuthUserId } from "@/hooks/queries/useAuthUserId";
import type { CategoryDetailView } from "@/types/discovery";

export function useCategoryDetail(categorySlug: string | undefined) {
  const supabase = createSupabaseBrowserClient();
  const { data: userId } = useAuthUserId();
  const slug = categorySlug?.trim().toLowerCase() ?? "";

  return useQuery<CategoryDetailView | null, Error>({
    queryKey: [...discoveryQueryKeys.categoryDetail(slug || "__none__"), userId ?? "guest"],
    queryFn: () => getCategoryDetail(supabase, slug, { userId: userId ?? null }),
    enabled: Boolean(slug),
  });
}
