import type { SupabaseClient } from "@supabase/supabase-js";
import type { RecentTopicView } from "@/types/discovery";

const LIMIT = 10;

/**
 * User's rewarded completions, most recent first.
 */
export async function getRecentTopics(
  supabase: SupabaseClient,
  userId: string
): Promise<RecentTopicView[]> {
  const uid = userId.trim();
  if (!uid) return [];

  const { data: hist, error } = await supabase
    .from("user_topic_history")
    .select("completed_at, topic_id")
    .eq("user_id", uid)
    .eq("rewards_granted", true)
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false })
    .limit(LIMIT);

  if (error || !hist?.length) return [];

  const topicIds = [...new Set(hist.map((h) => String((h as { topic_id: string }).topic_id)))];
  const { data: topics, error: tErr } = await supabase
    .from("topics")
    .select("id, slug, title, category_id")
    .in("id", topicIds);

  if (tErr || !topics?.length) return [];

  const catIds = [...new Set(topics.map((t) => String(t.category_id)))];
  const { data: cats } = await supabase
    .from("categories")
    .select("id, name")
    .in("id", catIds);
  const catName = new Map(
    (cats ?? []).map((c) => [String((c as { id: string }).id), String((c as { name: string }).name)])
  );

  const topicById = new Map(
    topics.map((t) => {
      const row = t as { id: string; slug: string; title: string; category_id: string };
      return [
        String(row.id),
        {
          slug: row.slug,
          title: row.title,
          categoryName: catName.get(String(row.category_id)) ?? "Curiosity",
        },
      ];
    })
  );

  const out: RecentTopicView[] = [];
  const seen = new Set<string>();
  for (const h of hist) {
    const row = h as { topic_id: string; completed_at: string | null };
    const tid = String(row.topic_id);
    if (seen.has(tid)) continue;
    seen.add(tid);
    const t = topicById.get(tid);
    if (!t) continue;
    out.push({
      id: tid,
      slug: t.slug,
      title: t.title,
      categoryName: t.categoryName,
      ...(row.completed_at ? { completedAt: row.completed_at } : {}),
    });
    if (out.length >= LIMIT) break;
  }

  return out;
}
