/**
 * Stable frontend-facing loader: normalized DB rows → LoadedCuriosityExperience.
 * Use with any Supabase client (browser session or server cookies).
 *
 * Missing optional sections (quiz, followups, trails, audio) never throw;
 * challenge is omitted when no quiz exists.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CuriosityAudioBlock,
  CuriosityChallenge,
  CuriosityExperience,
  CuriosityFollowup,
  CuriosityReviewStatus,
  CuriosityTrail,
  LoadedCuriosityExperience,
} from "@/types/curiosity-experience";
import { getNormalizedAudioData } from "@/lib/services/audio/audio-metadata";

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

type TopicRow = {
  id: string;
  title: string;
  slug: string;
  category_id: string;
  subcategory: string | null;
  difficulty_level: string | null;
  estimated_minutes: number | null;
  hook_text: string | null;
  lesson_text: string | null;
  surprising_fact: string | null;
  real_world_relevance: string | null;
  audio_url: string | null;
  audio_script: string | null;
  audio_duration_seconds: number | null;
  status: string | null;
  source_type: string | null;
  created_at: string | null;
  updated_at: string | null;
};

function buildExperience(
  topic: TopicRow,
  categoryName: string,
  categorySlug: string,
  tags: string[],
  followups: CuriosityFollowup[],
  challenge: CuriosityChallenge | undefined,
  trails: CuriosityTrail[]
): LoadedCuriosityExperience {
  const hook =
    normalizeText(String(topic.hook_text ?? "")) ||
    normalizeText(String(topic.title ?? "")) ||
    "Explore this curiosity.";
  const lessonText =
    normalizeText(String(topic.lesson_text ?? "")) ||
    "Lesson content will appear here soon.";

  const shortSummary = deriveShortSummary(
    String(topic.lesson_text ?? ""),
    hook
  );

  const discoveryCard: CuriosityExperience["discoveryCard"] = {
    hookQuestion: hook,
    shortSummary: shortSummary.length > 0 ? shortSummary : "Curiosity awaits.",
    estimatedMinutes: Math.max(1, Number(topic.estimated_minutes ?? 5)),
  };

  const difficultyLevel = topic.difficulty_level
    ? String(topic.difficulty_level)
    : "beginner";

  const norm = getNormalizedAudioData({
    audio_url: topic.audio_url,
    audio_script: topic.audio_script,
    audio_duration_seconds: topic.audio_duration_seconds,
    lesson_text: topic.lesson_text,
  });
  const audio: CuriosityAudioBlock | null =
    norm.isListenReady && norm.audioUrl
      ? {
          audioUrl: norm.audioUrl,
          durationSeconds: norm.durationSeconds,
          transcript: norm.transcript,
        }
      : null;

  const reviewStatus = mapTopicStatusToReviewStatus(topic.status ?? null);

  const experience: LoadedCuriosityExperience = {
    identity: {
      id: String(topic.id),
      slug: String(topic.slug),
      title: String(topic.title),
    },
    discoveryCard,
    taxonomy: {
      category: categoryName,
      categorySlug,
      subcategory:
        topic.subcategory != null ? String(topic.subcategory) : undefined,
      difficultyLevel,
      tags,
    },
    lesson: {
      lessonText,
      surprisingFact:
        topic.surprising_fact != null
          ? String(topic.surprising_fact)
          : undefined,
      realWorldRelevance:
        topic.real_world_relevance != null
          ? String(topic.real_world_relevance)
          : undefined,
    },
    audio,
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
      status: reviewStatus === "published" ? "approved" : "pending",
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

export type LoadCuriosityExperienceInput =
  | { slug: string; topicId?: never }
  | { topicId: string; slug?: never };

/**
 * Load one topic and related rows, assembled for the app shell / lesson flows.
 * Returns null if the topic row is missing or a fatal query error occurs.
 */
export async function loadCuriosityExperience(
  supabase: SupabaseClient,
  input: LoadCuriosityExperienceInput
): Promise<LoadedCuriosityExperience | null> {
  const topicQuery = supabase
    .from("topics")
    .select(
      "id, title, slug, category_id, subcategory, difficulty_level, estimated_minutes, hook_text, lesson_text, surprising_fact, real_world_relevance, audio_url, audio_script, audio_duration_seconds, status, source_type, created_at, updated_at"
    );

  const { data: topicRaw, error: topicErr } =
    "slug" in input && input.slug
      ? await topicQuery.eq("slug", input.slug).maybeSingle()
      : await topicQuery.eq("id", input.topicId).maybeSingle();

  if (topicErr || !topicRaw) return null;

  const topic = topicRaw as TopicRow;
  const categoryId = topic.category_id;

  const { data: category } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("id", categoryId)
    .maybeSingle();

  const categoryName =
    (category?.name as string | undefined)?.trim() || "Unknown";
  const categorySlug =
    (category?.slug as string | undefined)?.trim() || "unknown";

  const { data: tagRows } = await supabase
    .from("topic_tags")
    .select("tag")
    .eq("topic_id", topic.id);

  const tags = [
    ...new Set(
      (tagRows ?? [])
        .map((r: { tag: string }) => String(r.tag).trim())
        .filter(Boolean)
    ),
  ];

  const { data: followupRows } = await supabase
    .from("topic_followups")
    .select("id, question_text, answer_text, sort_order, difficulty_level")
    .eq("topic_id", topic.id)
    .order("sort_order", { ascending: true });

  const followups: CuriosityFollowup[] = (followupRows ?? []).map(
    (r: {
      id: string;
      question_text: string;
      answer_text: string | null;
      difficulty_level: string | null;
    }) => ({
      id: String(r.id),
      questionText: String(r.question_text),
      answerText:
        r.answer_text != null ? String(r.answer_text) : undefined,
      difficultyLevel:
        r.difficulty_level != null ? String(r.difficulty_level) : undefined,
    })
  );

  const { data: quizRows } = await supabase
    .from("quizzes")
    .select(
      "id, quiz_type, question_text, explanation_text, difficulty_level, sort_order"
    )
    .eq("topic_id", topic.id)
    .order("sort_order", { ascending: true });

  const quiz = (quizRows ?? [])[0];
  let challenge: CuriosityChallenge | undefined;

  if (quiz) {
    const { data: optionRows } = await supabase
      .from("quiz_options")
      .select("option_text, is_correct")
      .eq("quiz_id", quiz.id as string)
      .order("created_at", { ascending: true });

    const options = (optionRows ?? []).map(
      (o: { option_text: string; is_correct: boolean | null }) => ({
        optionText: String(o.option_text),
        isCorrect: Boolean(o.is_correct),
      })
    );

    challenge = {
      id: String(quiz.id),
      questionText: String(quiz.question_text),
      quizType: String(quiz.quiz_type),
      options:
        options.length > 0
          ? options
          : [{ optionText: "(No options yet)", isCorrect: true }],
      explanationText:
        quiz.explanation_text != null
          ? String(quiz.explanation_text)
          : undefined,
      difficultyLevel:
        quiz.difficulty_level != null
          ? String(quiz.difficulty_level)
          : undefined,
    };
  }

  const { data: trailRows } = await supabase
    .from("topic_trails")
    .select("to_topic_id, reason_text, sort_order")
    .eq("from_topic_id", topic.id)
    .order("sort_order", { ascending: true });

  const toTopicIds = [
    ...new Set(
      (trailRows ?? [])
        .map((r: { to_topic_id: string }) => String(r.to_topic_id))
        .filter(Boolean)
    ),
  ];

  const { data: toTopicRows } = toTopicIds.length
    ? await supabase.from("topics").select("id, slug, title").in("id", toTopicIds)
    : { data: [] as { id: string; slug: string; title: string }[] };

  const toTopicMap = new Map(
    (toTopicRows ?? []).map((t: { id: string; slug: string; title: string }) => [
      String(t.id),
      { slug: String(t.slug), title: String(t.title) },
    ])
  );

  const trails: CuriosityTrail[] = (trailRows ?? [])
    .map(
      (tr: {
        to_topic_id: string;
        reason_text: string | null;
        sort_order: number | null;
      }) => {
        const to = toTopicMap.get(String(tr.to_topic_id));
        if (!to) return null;
        return {
          toTopicSlug: to.slug,
          toTopicTitle: to.title,
          reasonText: String(tr.reason_text ?? ""),
          sortOrder: Number(tr.sort_order ?? 0),
        };
      }
    )
    .filter(Boolean) as CuriosityTrail[];

  return buildExperience(
    topic,
    categoryName,
    categorySlug,
    tags,
    followups,
    challenge,
    trails
  );
}
