import type { SupabaseClient } from "@supabase/supabase-js";
import type { TopicCardView } from "@/types/discovery";
import { mapTopicToTopicCardView } from "@/lib/services/discovery/read/discovery-read-helpers";
import { getCompletedTopicIds } from "@/lib/services/progress/get-completed-topic-ids";

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

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

export type GetRandomTopicsOptions = {
  limit?: number;
  categorySlug?: string;
  difficultyLevel?: string;
  userId?: string | null;
};

/**
 * Fetches random published topics as TopicCardView[].
 * Respects category and difficulty filters.
 */
export async function getRandomTopicCards(
  supabase: SupabaseClient,
  options: GetRandomTopicsOptions = {}
): Promise<TopicCardView[]> {
  const limit = Math.min(options.limit ?? 6, 24);
  let categoryId: string | undefined;

  if (options.categorySlug?.trim()) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", options.categorySlug.trim().toLowerCase())
      .maybeSingle();
    if (cat && (cat as { id: string }).id) {
      categoryId = (cat as { id: string }).id;
    }
  }

  let q = supabase
    .from("topics")
    .select("id, slug, title, hook_text, difficulty_level, estimated_minutes, category_id")
    .eq("status", "published");

  if (categoryId) {
    q = q.eq("category_id", categoryId);
  }
  if (options.difficultyLevel?.trim()) {
    q = q.eq("difficulty_level", options.difficultyLevel.trim());
  }

  const { data: rows, error } = await q.limit(100);
  if (error || !rows?.length) return [];

  const completedIds = options.userId?.trim()
    ? await getCompletedTopicIds(supabase, options.userId)
    : [];
  const completedSet = new Set(completedIds);

  const shuffled = shuffle(rows as TopicRow[]);
  const available = shuffled.filter((r) => !completedSet.has(String(r.id)));
  const selected = available.slice(0, limit);

  const catIds = [...new Set(selected.map((r) => String(r.category_id)))];
  const catMap = await loadCategoryMap(supabase, catIds);

  const out: TopicCardView[] = [];
  for (const row of selected) {
    const c = catMap.get(String(row.category_id));
    const mapped = mapTopicToTopicCardView(row, {
      categoryName: c?.name,
      categorySlug: c?.slug,
      isCompleted: false,
    });
    if (mapped) out.push(mapped);
  }
  return out;
}
