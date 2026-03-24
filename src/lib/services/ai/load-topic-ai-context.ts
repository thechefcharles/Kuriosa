/**
 * Phase 9 — Load minimum topic context for AI generation.
 * Shared source of truth for follow-ups, rabbit holes, and answer generation.
 */

import { getSupabaseServiceRoleClient } from "@/lib/supabase/supabase-service-client";
import type { TopicAIContext } from "@/types/ai";

export type LoadTopicAIContextInput =
  | { topicId: string; slug?: never }
  | { slug: string; topicId?: never };

/**
 * Load topic context for AI generation. Returns null if topic not found.
 */
export async function loadTopicAIContext(
  input: LoadTopicAIContextInput
): Promise<TopicAIContext | null> {
  const supabase = getSupabaseServiceRoleClient();

  const topicQuery = supabase
    .from("topics")
    .select(
      "id, title, slug, category_id, hook_text, lesson_text, subcategory"
    );

  const { data: topic, error: topicErr } =
    "slug" in input && input.slug
      ? await topicQuery.eq("slug", input.slug).maybeSingle()
      : await topicQuery.eq("id", input.topicId).maybeSingle();

  if (topicErr || !topic) return null;

  const { data: category } = await supabase
    .from("categories")
    .select("name, slug")
    .eq("id", topic.category_id)
    .maybeSingle();

  const { data: tagRows } = await supabase
    .from("topic_tags")
    .select("tag")
    .eq("topic_id", topic.id);

  const tags = (tagRows ?? [])
    .map((r: { tag: string }) => String(r.tag).trim())
    .filter(Boolean);

  const lessonText = String(topic.lesson_text ?? "").trim();
  const lessonExcerpt = lessonText.slice(0, 1200);

  return {
    topicId: String(topic.id),
    slug: String(topic.slug),
    title: String(topic.title ?? ""),
    categoryName: (category?.name as string)?.trim() ?? "General",
    categorySlug: (category?.slug as string)?.trim() ?? "general",
    subcategory: topic.subcategory ? String(topic.subcategory) : undefined,
    hookText: topic.hook_text ? String(topic.hook_text).trim() : undefined,
    lessonExcerpt: lessonExcerpt || undefined,
    tags,
  };
}
