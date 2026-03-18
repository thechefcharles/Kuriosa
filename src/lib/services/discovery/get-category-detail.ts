import type { SupabaseClient } from "@supabase/supabase-js";
import type { CategoryDetailView } from "@/types/discovery";
import { mapCategoryToCategoryView } from "@/lib/services/discovery/read/discovery-read-helpers";
import { getTopicsByCategory } from "@/lib/services/discovery/get-topics-by-category";

/**
 * Category metadata + published topics. Returns null if slug does not exist.
 */
export async function getCategoryDetail(
  supabase: SupabaseClient,
  categorySlug: string
): Promise<CategoryDetailView | null> {
  const slug = categorySlug.trim().toLowerCase();
  if (!slug) return null;

  const { data: cat, error } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !cat) return null;

  const topics = await getTopicsByCategory(supabase, slug);
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
