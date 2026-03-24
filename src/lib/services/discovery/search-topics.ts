/**
 * Lightweight published-topic search: title, hook, tags, category name/slug.
 * Case-insensitive ilike; no fuzzy ranking. Min meaningful query: 2+ chars (caller).
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { TopicCardView } from "@/types/discovery";
import { mapTopicToTopicCardView } from "@/lib/services/discovery/read/discovery-read-helpers";
import { getCompletedTopicIds } from "@/lib/services/progress/get-completed-topic-ids";

const RESULT_LIMIT = 20;

export type SearchTopicsOptions = {
  userId?: string | null;
};

function ilikePattern(term: string): string {
  return `%${term.replace(/%/g, "").replace(/_/g, "").trim()}%`;
}

async function topicsToCardViews(
  supabase: SupabaseClient,
  topicIds: string[],
  completedTopicIds: string[] = []
): Promise<TopicCardView[]> {
  const ids = topicIds.slice(0, RESULT_LIMIT);
  if (!ids.length) return [];

  const { data: rows, error } = await supabase
    .from("topics")
    .select(
      "id, slug, title, hook_text, difficulty_level, estimated_minutes, category_id"
    )
    .in("id", ids)
    .eq("status", "published");

  if (error || !rows?.length) return [];

  const catIds = [...new Set(rows.map((r) => String(r.category_id)))];
  const { data: cats } = await supabase
    .from("categories")
    .select("id, slug, name")
    .in("id", catIds);
  const catMap = new Map(
    (cats ?? []).map((c) => {
      const x = c as { id: string; slug: string; name: string };
      return [String(x.id), { slug: x.slug, name: x.name }];
    })
  );

  const completedSet = new Set(completedTopicIds);
  const byId = new Map(rows.map((r) => [String((r as { id: string }).id), r]));
  const out: TopicCardView[] = [];
  for (const id of ids) {
    const row = byId.get(id) as {
      id: string;
      slug: string;
      title: string;
      hook_text?: string | null;
      difficulty_level?: string | null;
      estimated_minutes?: number | null;
      category_id: string;
    } | undefined;
    if (!row || completedSet.has(String(row.id))) continue;
    const c = catMap.get(String(row.category_id));
    const v = mapTopicToTopicCardView(row, {
      categoryName: c?.name,
      categorySlug: c?.slug,
      isCompleted: false,
    });
    if (v) out.push(v);
  }
  return out;
}

export async function searchTopics(
  supabase: SupabaseClient,
  rawQuery: string,
  options?: SearchTopicsOptions
): Promise<TopicCardView[]> {
  const term = rawQuery.trim();
  if (term.length < 2) return [];

  const completedIds = options?.userId?.trim()
    ? await getCompletedTopicIds(supabase, options.userId)
    : [];

  const pat = ilikePattern(term);
  const seen = new Set<string>();
  const orderedIds: string[] = [];

  const add = (ids: (string | undefined)[]) => {
    for (const id of ids) {
      if (!id || seen.has(id)) continue;
      seen.add(id);
      orderedIds.push(id);
      if (orderedIds.length >= RESULT_LIMIT) return;
    }
  };

  const { data: byTitle } = await supabase
    .from("topics")
    .select("id")
    .eq("status", "published")
    .ilike("title", pat)
    .limit(RESULT_LIMIT);
  add((byTitle ?? []).map((r) => String((r as { id: string }).id)));

  const { data: byHook } = await supabase
    .from("topics")
    .select("id")
    .eq("status", "published")
    .ilike("hook_text", pat)
    .limit(RESULT_LIMIT);
  add((byHook ?? []).map((r) => String((r as { id: string }).id)));

  const { data: tagRows } = await supabase
    .from("topic_tags")
    .select("topic_id")
    .ilike("tag", pat)
    .limit(40);
  const tagIds = [...new Set((tagRows ?? []).map((t) => String((t as { topic_id: string }).topic_id)))];
  add(tagIds);

  const { data: catByName } = await supabase
    .from("categories")
    .select("id")
    .ilike("name", pat);
  const { data: catBySlug } = await supabase
    .from("categories")
    .select("id")
    .ilike("slug", pat);
  const catIds = [
    ...new Set([
      ...(catByName ?? []).map((c) => String((c as { id: string }).id)),
      ...(catBySlug ?? []).map((c) => String((c as { id: string }).id)),
    ]),
  ];
  if (catIds.length) {
    const { data: catTopics } = await supabase
      .from("topics")
      .select("id")
      .eq("status", "published")
      .in("category_id", catIds)
      .limit(RESULT_LIMIT);
    add((catTopics ?? []).map((r) => String((r as { id: string }).id)));
  }

  return topicsToCardViews(supabase, orderedIds, completedIds);
}
