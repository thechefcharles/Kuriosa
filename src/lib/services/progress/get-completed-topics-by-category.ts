import type { SupabaseClient } from "@supabase/supabase-js";

export type CompletedTopicCardView = {
  id: string;
  slug: string;
  title: string;
  hook: string;
  categoryName: string;
  categorySlug: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  estimatedMinutes?: number;
  /** True when challenge was answered correctly */
  challengeCorrect: boolean;
  /** XP earned for this completion */
  xpEarned: number;
};

/**
 * Fetches completed topics for a user in a given category.
 * Joins user_topic_history (rewards_granted) with topics.
 */
export async function getCompletedTopicsByCategory(
  supabase: SupabaseClient,
  userId: string,
  categorySlug: string
): Promise<CompletedTopicCardView[]> {
  const uid = userId.trim();
  const slug = categorySlug.trim().toLowerCase();
  if (!uid || !slug) return [];

  const { data: cat, error: catErr } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (catErr || !cat) return [];

  const categoryId = (cat as { id: string }).id;
  const categoryName = (cat as { name: string }).name;
  const catSlug = (cat as { slug: string }).slug;

  const { data: histRows, error } = await supabase
    .from("user_topic_history")
    .select("topic_id, challenge_correct, xp_earned")
    .eq("user_id", uid)
    .eq("rewards_granted", true);

  if (error || !histRows?.length) return [];

  const topicIds = [...new Set(histRows.map((r) => String((r as { topic_id: string }).topic_id)))];

  const { data: topics, error: topicsErr } = await supabase
    .from("topics")
    .select("id, slug, title, hook_text, difficulty_level, estimated_minutes, category_id")
    .in("id", topicIds)
    .eq("category_id", categoryId)
    .eq("status", "published");

  if (topicsErr || !topics?.length) return [];

  const histByTopic = new Map(
    histRows.map((r) => {
      const row = r as { topic_id: string; challenge_correct?: boolean | null; xp_earned?: number | null };
      return [
        String(row.topic_id),
        {
          challengeCorrect: row.challenge_correct === true,
          xpEarned: Math.max(0, Math.floor(Number(row.xp_earned) ?? 0)),
        },
      ];
    })
  );

  function normalizeDifficulty(raw: string | null | undefined): CompletedTopicCardView["difficulty"] {
    if (!raw?.trim()) return undefined;
    const s = raw.trim().toLowerCase();
    if (s === "beginner" || s === "easy") return "beginner";
    if (s === "intermediate") return "intermediate";
    if (s === "advanced" || s === "expert") return "advanced";
    return undefined;
  }

  const out: CompletedTopicCardView[] = [];
  for (const t of topics) {
    const row = t as {
      id: string;
      slug: string;
      title: string;
      hook_text?: string | null;
      difficulty_level?: string | null;
      estimated_minutes?: number | null;
    };
    const h = histByTopic.get(String(row.id));
    if (!h) continue;

    const hook = (row.hook_text ?? "").trim() || "Open to find out.";
    const em =
      row.estimated_minutes != null && Number.isFinite(Number(row.estimated_minutes))
        ? Math.max(1, Math.round(Number(row.estimated_minutes)))
        : undefined;

    out.push({
      id: String(row.id),
      slug: String(row.slug),
      title: String(row.title).trim(),
      hook: hook.slice(0, 220),
      categoryName,
      categorySlug: catSlug,
      difficulty: normalizeDifficulty(row.difficulty_level),
      estimatedMinutes: em,
      challengeCorrect: h.challengeCorrect,
      xpEarned: h.xpEarned,
    });
  }

  return out.sort((a, b) => b.xpEarned - a.xpEarned);
}
