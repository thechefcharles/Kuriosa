import type { SupabaseClient } from "@supabase/supabase-js";

export type CategoryXpEntry = {
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  totalXp: number;
};

/**
 * Fetches per-category XP for a user.
 * Returns empty array if user_category_xp table doesn't exist (migration not run).
 */
export async function getUserCategoryXp(
  supabase: SupabaseClient,
  userId: string
): Promise<CategoryXpEntry[]> {
  const uid = userId.trim();
  if (!uid) return [];

  const { data: rows, error } = await supabase
    .from("user_category_xp")
    .select("category_id, total_xp")
    .eq("user_id", uid)
    .gt("total_xp", 0);

  if (error) return [];

  if (!rows?.length) return [];

  const categoryIds = [...new Set(rows.map((r) => (r as { category_id: string }).category_id))];
  const { data: categories, error: catErr } = await supabase
    .from("categories")
    .select("id, slug, name")
    .in("id", categoryIds);

  if (catErr || !categories?.length) return [];

  const catMap = new Map(
    (categories as { id: string; slug: string; name: string }[]).map((c) => [
      c.id,
      { slug: c.slug, name: c.name },
    ])
  );

  const entries: CategoryXpEntry[] = [];
  for (const row of rows) {
    const r = row as { category_id: string; total_xp?: number };
    const cat = catMap.get(r.category_id);
    if (!cat) continue;
    const xp = Math.max(0, Math.floor(Number(r.total_xp) ?? 0));
    if (xp > 0) {
      entries.push({
        categoryId: r.category_id,
        categorySlug: cat.slug,
        categoryName: cat.name,
        totalXp: xp,
      });
    }
  }

  return entries.sort((a, b) => b.totalXp - a.totalXp);
}
