/**
 * Load a CuriosityExperience-like object for internal preview.
 * This assembles a preview from normalized tables (topics + related rows).
 *
 * Note: rewards and audio transcript are not fully persisted in the schema yet,
 * so preview uses safe defaults / derived values.
 */

import type { CuriosityExperience } from "@/types/curiosity-experience";
import type { CuriosityReviewStatus } from "@/types/curiosity-experience";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server-client";

function normalizeText(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function deriveShortSummary(lessonText: string, fallback: string): string {
  const cleaned = normalizeText(lessonText);
  if (cleaned.length > 0) return cleaned.slice(0, 160);
  return normalizeText(fallback).slice(0, 160) || "Curiosity awaits.";
}

function mapTopicStatusToReviewStatus(status: string | null): CuriosityReviewStatus {
  if (status === "published") return "published";
  if (status === "reviewed") return "reviewed";
  if (status === "rejected") return "rejected";
  if (status === "archived") return "archived";
  return "draft";
}

export async function loadCuriosityPreviewBySlug(
  topicSlug: string
): Promise<CuriosityExperience | null> {
  const supabase = await createSupabaseServerClient();

  const { data: topic, error: topicErr } = await supabase
    .from("topics")
    .select(
      "id, title, slug, category_id, subcategory, difficulty_level, estimated_minutes, hook_text, lesson_text, surprising_fact, real_world_relevance, audio_url, status, source_type, created_at, updated_at"
    )
    .eq("slug", topicSlug)
    .maybeSingle();

  if (topicErr) return null;
  if (!topic) return null;

  const categoryId = topic.category_id as string;
  const { data: category } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("id", categoryId)
    .maybeSingle();

  const categoryName = (category?.name as string | undefined) ?? "Unknown";
  const categorySlug = (category?.slug as string | undefined) ?? "unknown";

  const { data: tagRows } = await supabase
    .from("topic_tags")
    .select("tag")
    .eq("topic_id", topic.id as string);

  const tags = [...new Set((tagRows ?? []).map((r: any) => String(r.tag).trim()).filter(Boolean))];

  const { data: followupRows } = await supabase
    .from("topic_followups")
    .select(
      "id, question_text, answer_text, sort_order, difficulty_level"
    )
    .eq("topic_id", topic.id as string)
    .order("sort_order", { ascending: true });

  const followups =
    (followupRows ?? []).map((r: any) => ({
      id: String(r.id),
      questionText: String(r.question_text),
      answerText: r.answer_text != null ? String(r.answer_text) : undefined,
      difficultyLevel: r.difficulty_level != null ? String(r.difficulty_level) : undefined,
    })) ?? [];

  const { data: quizRows } = await supabase
    .from("quizzes")
    .select(
      "id, quiz_type, question_text, explanation_text, difficulty_level, sort_order"
    )
    .eq("topic_id", topic.id as string)
    .order("sort_order", { ascending: true });

  const quiz = (quizRows ?? [])[0];
  if (!quiz) {
    return null;
  }

  const { data: optionRows } = await supabase
    .from("quiz_options")
    .select("option_text, is_correct")
    .eq("quiz_id", quiz.id as string)
    .order("created_at", { ascending: true });

  const options = (optionRows ?? []).map((o: any) => ({
    optionText: String(o.option_text),
    isCorrect: Boolean(o.is_correct),
  }));

  const challenge = {
    id: String(quiz.id),
    questionText: String(quiz.question_text),
    quizType: String(quiz.quiz_type),
    options: options.length > 0 ? options : [{ optionText: "(missing options)", isCorrect: true }],
    explanationText:
      quiz.explanation_text != null ? String(quiz.explanation_text) : undefined,
    difficultyLevel:
      quiz.difficulty_level != null ? String(quiz.difficulty_level) : undefined,
  };

  const { data: trailRows } = await supabase
    .from("topic_trails")
    .select("to_topic_id, reason_text, sort_order")
    .eq("from_topic_id", topic.id as string)
    .order("sort_order", { ascending: true });

  const toTopicIds = [...new Set((trailRows ?? []).map((r: any) => String(r.to_topic_id)).filter(Boolean))];
  const { data: toTopicRows } = toTopicIds.length
    ? await supabase
        .from("topics")
        .select("id, slug, title")
        .in("id", toTopicIds)
    : { data: [] };

  const toTopicMap = new Map(
    (toTopicRows ?? []).map((t: any) => [
      String(t.id),
      { slug: String(t.slug), title: String(t.title) },
    ])
  );

  const trails = (trailRows ?? [])
    .map((tr: any) => {
      const to = toTopicMap.get(String(tr.to_topic_id));
      if (!to) return null;
      return {
        toTopicSlug: to.slug,
        toTopicTitle: to.title,
        reasonText: String(tr.reason_text ?? ""),
        sortOrder: Number(tr.sort_order ?? 0),
      };
    })
    .filter(Boolean) as CuriosityExperience["trails"];

  const reviewStatus = mapTopicStatusToReviewStatus(topic.status ?? null);
  const shortSummary = deriveShortSummary(
    String(topic.lesson_text ?? ""),
    String(topic.hook_text ?? "")
  );

  const discoveryCard = {
    hookQuestion: String(topic.hook_text ?? ""),
    shortSummary: shortSummary.length > 0 ? shortSummary : "Curiosity awaits.",
    estimatedMinutes: Number(topic.estimated_minutes ?? 5),
  };

  const difficultyLevel = topic.difficulty_level
    ? String(topic.difficulty_level)
    : "beginner";

  const experience: CuriosityExperience = {
    identity: {
      id: String(topic.id),
      slug: String(topic.slug),
      title: String(topic.title),
    },
    discoveryCard,
    taxonomy: {
      category: categoryName,
      categorySlug,
      subcategory: topic.subcategory != null ? String(topic.subcategory) : undefined,
      difficultyLevel,
      tags,
    },
    lesson: {
      lessonText: String(topic.lesson_text),
      surprisingFact:
        topic.surprising_fact != null ? String(topic.surprising_fact) : undefined,
      realWorldRelevance:
        topic.real_world_relevance != null
          ? String(topic.real_world_relevance)
          : undefined,
    },
    audio: topic.audio_url
      ? {
          audioUrl: String(topic.audio_url),
        }
      : undefined,
    challenge,
    rewards: {
      xpAward: 0,
    },
    followups,
    trails,
    progressionHooks: {
      nextTrailSlugs: trails
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((t) => t.toTopicSlug)
        .slice(0, 8),
    },
    moderation: {
      reviewStatus,
      status:
        reviewStatus === "published" ? "approved" : "pending",
      reviewedAt: topic.updated_at ? String(topic.updated_at) : undefined,
      safetyFlags: [],
    },
    analytics: {
      sourceType: topic.source_type ?? "ai_generated",
      generatedAt: topic.created_at ? String(topic.created_at) : undefined,
      version: 1,
    },
  };

  return experience;
}

