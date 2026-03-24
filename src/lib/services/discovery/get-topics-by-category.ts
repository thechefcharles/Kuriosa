import type { SupabaseClient } from "@supabase/supabase-js";
import type { TopicCardView } from "@/types/discovery";
import { mapTopicToTopicCardView } from "@/lib/services/discovery/read/discovery-read-helpers";
import { getCompletedTopicIds } from "@/lib/services/progress/get-completed-topic-ids";

const LIMIT = 50;

export type GetTopicsByCategoryOptions = {
  userId?: string | null;
};

/**
 * Published topics in a category (by category slug).
 */
export async function getTopicsByCategory(
  supabase: SupabaseClient,
  categorySlug: string,
  options?: GetTopicsByCategoryOptions
): Promise<TopicCardView[]> {
  const slug = categorySlug.trim().toLowerCase();
  if (!slug) return [];

  const { data: cat, error: catErr } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (catErr || !cat) return [];

  const { id: categoryId, name: categoryName, slug: catSlug } = cat as {
    id: string;
    name: string;
    slug: string;
  };

  const { data: rows, error } = await supabase
    .from("topics")
    .select("id, slug, title, hook_text, difficulty_level, estimated_minutes")
    .eq("category_id", categoryId)
    .eq("status", "published")
    .order("title", { ascending: true })
    .limit(LIMIT);

  if (error || !rows?.length) return [];

  const completedIds = options?.userId?.trim()
    ? await getCompletedTopicIds(supabase, options.userId)
    : [];
  const completedSet = new Set(completedIds);

  const out: TopicCardView[] = [];
  for (const row of rows) {
    const mapped = mapTopicToTopicCardView(
      row as {
        id: string;
        slug: string;
        title: string;
        hook_text?: string | null;
        difficulty_level?: string | null;
        estimated_minutes?: number | null;
      },
      {
        categoryName,
        categorySlug: catSlug,
        isCompleted: completedSet.has(String(row.id)),
      }
    );
    if (mapped) out.push(mapped);
  }
  return out;
}
