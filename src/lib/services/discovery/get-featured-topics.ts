import type { SupabaseClient } from "@supabase/supabase-js";
import type { TopicCardView } from "@/types/discovery";
import { mapTopicToTopicCardView } from "@/lib/services/discovery/read/discovery-read-helpers";

const LIMIT = 24;

type TopicRow = {
  id: string;
  slug: string;
  title: string;
  hook_text?: string | null;
  difficulty_level?: string | null;
  estimated_minutes?: number | null;
  category_id: string;
};

async function loadCategoryMap(
  supabase: SupabaseClient,
  categoryIds: string[]
): Promise<Map<string, { slug: string; name: string }>> {
  const map = new Map<string, { slug: string; name: string }>();
  if (!categoryIds.length) return map;
  const { data: cats } = await supabase
    .from("categories")
    .select("id, slug, name")
    .in("id", categoryIds);
  for (const c of cats ?? []) {
    const row = c as { id: string; slug: string; name: string };
    map.set(String(row.id), { slug: String(row.slug), name: String(row.name) });
  }
  return map;
}

/**
 * Prefer random-featured published topics; fallback to recently updated.
 */
export async function getFeaturedTopics(
  supabase: SupabaseClient
): Promise<TopicCardView[]> {
  const { data: featured, error: e1 } = await supabase
    .from("topics")
    .select(
      "id, slug, title, hook_text, difficulty_level, estimated_minutes, category_id"
    )
    .eq("status", "published")
    .eq("is_random_featured", true)
    .limit(LIMIT);

  let rows: TopicRow[] | null =
    !e1 && featured && featured.length > 0 ? (featured as TopicRow[]) : null;

  if (!rows) {
    const { data: recent, error: e2 } = await supabase
      .from("topics")
      .select(
        "id, slug, title, hook_text, difficulty_level, estimated_minutes, category_id"
      )
      .eq("status", "published")
      .order("updated_at", { ascending: false })
      .limit(LIMIT);
    if (e2 || !recent?.length) return [];
    rows = recent as TopicRow[];
  }

  const catIds = [...new Set(rows.map((r) => String(r.category_id)))];
  const catMap = await loadCategoryMap(supabase, catIds);

  const out: TopicCardView[] = [];
  for (const row of rows) {
    const c = catMap.get(String(row.category_id));
    const mapped = mapTopicToTopicCardView(row, {
      categoryName: c?.name,
      categorySlug: c?.slug,
    });
    if (mapped) out.push(mapped);
  }
  return out;
}
