/**
 * Map CuriosityExperience → topics row shape for insert/upsert.
 */

import type { CuriosityExperience } from "@/types/curiosity-experience";

export interface TopicRowPayload {
  title: string;
  slug: string;
  category_id: string;
  subcategory: string | null;
  difficulty_level: string | null;
  estimated_minutes: number | null;
  hook_text: string | null;
  lesson_text: string;
  surprising_fact: string | null;
  real_world_relevance: string | null;
  audio_url: string | null;
  audio_script: string | null;
  audio_duration_seconds: number | null;
  is_random_featured: boolean;
  status: string;
  source_type: string | null;
  updated_at: string;
}

function mapReviewStatusToTopicStatus(
  experience: CuriosityExperience
): string {
  const rs = experience.moderation?.reviewStatus;
  if (rs === "published") return "published";
  if (rs === "rejected") return "rejected";
  if (rs === "archived") return "archived";
  if (rs === "reviewed") return "reviewed";
  return "draft";
}

export function mapDraftToTopicRow(
  experience: CuriosityExperience,
  categoryId: string
): TopicRowPayload {
  const d = experience.discoveryCard;
  const t = experience.taxonomy;
  const l = experience.lesson;

  return {
    title: experience.identity.title,
    slug: experience.identity.slug,
    category_id: categoryId,
    subcategory: t.subcategory ?? null,
    difficulty_level: t.difficultyLevel ?? null,
    estimated_minutes: d.estimatedMinutes ?? null,
    hook_text: d.hookQuestion,
    lesson_text: l.lessonText,
    surprising_fact: l.surprisingFact ?? null,
    real_world_relevance: l.realWorldRelevance ?? null,
    audio_url: experience.audio?.audioUrl?.trim() || null,
    audio_script: experience.audio?.transcript?.trim() || null,
    audio_duration_seconds:
      experience.audio?.durationSeconds != null &&
      Number.isFinite(Number(experience.audio.durationSeconds)) &&
      Number(experience.audio.durationSeconds) > 0
        ? Math.round(Number(experience.audio.durationSeconds))
        : null,
    is_random_featured: false,
    status: mapReviewStatusToTopicStatus(experience),
    source_type: experience.analytics?.sourceType ?? "ai_generated",
    updated_at: new Date().toISOString(),
  };
}
