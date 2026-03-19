import type { SupabaseClient } from "@supabase/supabase-js";
import type { CategoryView } from "@/types/discovery";
import { mapCategoryToCategoryView } from "@/lib/services/discovery/read/discovery-read-helpers";

/**
 * All categories, ordered by sort_order. Optionally attach published topic counts.
 */
export async function getCategories(
  supabase: SupabaseClient,
  options?: { withTopicCounts?: boolean }
): Promise<CategoryView[]> {
  const { data: cats, error } = await supabase
    .from("categories")
    .select("id, name, slug, description, sort_order")
    .order("sort_order", { ascending: true });

  if (error || !cats?.length) return [];

  if (!options?.withTopicCounts) {
    return cats.map((c) =>
      mapCategoryToCategoryView(c as { id: string; slug: string; name: string; description: string | null })
    );
  }

  const { data: counts, error: cErr } = await supabase
    .from("topics")
    .select("category_id")
    .eq("status", "published");

  if (cErr || !counts?.length) {
    return cats.map((c) =>
      mapCategoryToCategoryView(c as { id: string; slug: string; name: string; description: string | null }, 0)
    );
  }

  const byCat = new Map<string, number>();
  for (const t of counts) {
    const id = String((t as { category_id: string }).category_id);
    byCat.set(id, (byCat.get(id) ?? 0) + 1);
  }

  return cats.map((c) => {
    const row = c as { id: string; slug: string; name: string; description: string | null };
    return mapCategoryToCategoryView(row, byCat.get(String(row.id)) ?? 0);
  });
}
