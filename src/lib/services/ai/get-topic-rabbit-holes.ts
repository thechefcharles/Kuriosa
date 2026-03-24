/**
 * Phase 9 — Get rabbit-hole suggestions for a topic.
 * Uses ai_cache. Loads context, generates 3–5 suggestions if miss.
 * Aligns suggestions with real topics when possible (rabbit holes → content links).
 */

import { loadTopicAIContext } from "@/lib/services/ai/load-topic-ai-context";
import { generateRabbitHoles } from "@/lib/services/ai/generate-rabbit-holes";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/supabase-service-client";
import type { RabbitHoleSuggestionResult, TopicRabbitHoleItem } from "@/types/ai";

export type GetTopicRabbitHolesInput =
  | { topicId: string; slug?: never }
  | { slug: string; topicId?: never };

export type GetTopicRabbitHolesOptions = {
  /** Optional question that triggered the request (e.g. user's follow-up) */
  questionText?: string | null;
  userId?: string;
};

function normalizeForMatch(s: string): string {
  return s
    .toLowerCase()
    .replace(/[?!.'"]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Match suggestion title to a topic. Returns slug if found.
 */
function matchSuggestionToTopic(
  suggestion: string,
  topicMap: Map<string, string>
): string | undefined {
  const norm = normalizeForMatch(suggestion);
  if (!norm) return undefined;
  for (const [title, slug] of topicMap) {
    const titleNorm = normalizeForMatch(title);
    if (titleNorm === norm) return slug;
    if (norm.length >= 8 && titleNorm.length >= 8 && (norm === titleNorm || norm.startsWith(titleNorm) || titleNorm.startsWith(norm))) {
      return slug;
    }
  }
  return undefined;
}

/**
 * Get rabbit-hole suggestions for a topic.
 * Cached in ai_cache. Key: topic + optional question hash.
 * Suggestion titles are matched to real topics; when matched, topicSlug is set so UI can link.
 */
export async function getTopicRabbitHoles(
  input: GetTopicRabbitHolesInput,
  options?: GetTopicRabbitHolesOptions
): Promise<RabbitHoleSuggestionResult> {
  const context = await loadTopicAIContext(input);
  if (!context) {
    return { ok: false, error: "Topic not found" };
  }

  const supabase = getSupabaseServiceRoleClient();
  const { data: topics } = await supabase
    .from("topics")
    .select("title, slug")
    .eq("status", "published")
    .neq("id", context.topicId);
  const topicMap = new Map(
    (topics ?? []).map((t: { title: string; slug: string }) => [String(t.title), String(t.slug)])
  );
  const availableTitles = [...topicMap.keys()];

  const result = await generateRabbitHoles(
    {
      topicId: context.topicId,
      topicTitle: context.title,
      questionText: options?.questionText ?? undefined,
      lessonExcerpt: context.lessonExcerpt,
      availableTopicTitles: availableTitles,
    },
    { userId: options?.userId }
  );

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  const items: TopicRabbitHoleItem[] = result.suggestions.map((title) => {
    const topicSlug = matchSuggestionToTopic(title, topicMap);
    return {
      title,
      reasonText: undefined,
      ...(topicSlug ? { topicSlug } : {}),
    };
  });

  return {
    ok: true,
    suggestions: items,
    fromCache: result.fromCache,
    topicId: context.topicId,
  };
}
