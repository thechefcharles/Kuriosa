import type { SupabaseClient } from "@supabase/supabase-js";
import type { CategoryDetailView } from "@/types/discovery";
import { mapCategoryToCategoryView } from "@/lib/services/discovery/read/discovery-read-helpers";
import { getTopicsByCategory } from "@/lib/services/discovery/get-topics-by-category";

export type GetCategoryDetailOptions = {
  userId?: string | null;
};

/**
 * Category metadata + published topics. Returns null if slug does not exist.
 * Excludes completed topics when userId is provided.
 */
export async function getCategoryDetail(
  supabase: SupabaseClient,
  categorySlug: string,
  options?: GetCategoryDetailOptions
): Promise<CategoryDetailView | null> {
  const slug = categorySlug.trim().toLowerCase();
  if (!slug) return null;

  const { data: cat, error } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !cat) return null;

  const topics = await getTopicsByCategory(supabase, slug, {
    userId: options?.userId ?? null,
  });
  const row = cat as {
    id: string;
    name: string;
    slug: string;
    description: string | null;
  };

  return {
    category: mapCategoryToCategoryView(row, topics.length),
    topics,
  };
}
