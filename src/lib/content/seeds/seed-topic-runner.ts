import { generateLesson } from "@/lib/ai/generators/generate-lesson";
import { generateChallenge } from "@/lib/ai/generators/generate-challenge";
import { generateFollowups } from "@/lib/ai/generators/generate-followups";
import { generateTrails } from "@/lib/ai/generators/generate-trails";
import { generateAudioScript } from "@/lib/ai/generators/generate-audio-script";
import { buildCuriosityExperienceDraft } from "@/lib/services/content/build-curiosity-experience-draft";
import { safeValidateCuriosityExperienceDraft } from "@/lib/validations/assembled-curiosity-draft";
import { persistCuriosityExperienceDraft } from "@/lib/services/content/persist-curiosity-experience-draft";
import { composeLessonTextFromGenerated } from "@/types/content-generation";
import type { Phase4SeedTopic } from "@/lib/content/seeds/phase-4-seed-topics";
import type { PersistCuriosityExperienceResult } from "@/types/content-persistence";
import type { CuriosityExperience } from "@/types/curiosity-experience";

export interface SeedSingleResult {
  title: string;
  slug?: string;
  success: boolean;
  persisted?: PersistCuriosityExperienceResult;
  draft?: CuriosityExperience;
  error?: string;
  warnings: string[];
}

function toHookQuestion(title: string): string {
  const t = title.trim();
  return t.endsWith("?") ? t : `${t}?`;
}

function summarizeLessonForInputs(lessonText: string): string {
  const s = lessonText.replace(/\s+/g, " ").trim();
  return s.slice(0, 900);
}

export async function runSeedTopic(
  seed: Phase4SeedTopic
): Promise<SeedSingleResult> {
  const warnings: string[] = [];

  const lessonRes = await generateLesson({
    topicTitle: seed.title,
    category: seed.category,
    subcategory: seed.subcategory,
    difficulty: seed.intendedDifficulty,
    targetWordCount: seed.intendedDifficulty === "beginner" ? 220 : 320,
    tone: "curious, warm, slightly magical",
    tags: seed.tags,
    hookContext: toHookQuestion(seed.title),
    audience: "curious general audience",
  });
  if (!lessonRes.success) {
    return {
      title: seed.title,
      success: false,
      error: `lesson: ${lessonRes.error}`,
      warnings,
    };
  }
  const lesson = lessonRes.lesson;
  const lessonText = composeLessonTextFromGenerated(lesson);
  const lessonSummary = summarizeLessonForInputs(lessonText);

  const challengeRes = await generateChallenge({
    topicTitle: seed.title,
    category: seed.category,
    difficulty: seed.intendedDifficulty,
    lessonSummaryOrContent: lessonSummary,
    desiredChallengeTypes: ["multiple_choice", "memory_recall", "logic"],
    tags: seed.tags,
    audience: "curious general audience",
  });
  if (!challengeRes.success) {
    return {
      title: seed.title,
      success: false,
      error: `challenge: ${challengeRes.error}`,
      warnings,
    };
  }

  const followRes = await generateFollowups({
    topicTitle: seed.title,
    category: seed.category,
    subcategory: seed.subcategory,
    difficulty: seed.intendedDifficulty,
    lessonSummaryOrContent: lessonSummary,
    tags: seed.tags,
    audience: "curious general audience",
    desiredCount: 4,
  });
  if (!followRes.success) {
    return {
      title: seed.title,
      success: false,
      error: `followups: ${followRes.error}`,
      warnings,
    };
  }

  const trailsRes = await generateTrails({
    currentTopicTitle: seed.title,
    category: seed.category,
    subcategory: seed.subcategory,
    difficulty: seed.intendedDifficulty,
    tags: seed.tags,
    lessonSummaryOrContent: lessonSummary,
    audience: "curious general audience",
    desiredCount: 4,
    existingTopicLibraryContext: "",
  });
  if (!trailsRes.success) {
    return {
      title: seed.title,
      success: false,
      error: `trails: ${trailsRes.error}`,
      warnings,
    };
  }

  const audio = seed.includeAudio
    ? await generateAudioScript({
        topicTitle: seed.title,
        category: seed.category,
        difficulty: seed.intendedDifficulty,
        generatedLesson: lesson,
        targetDurationSeconds: 110,
        audience: "curious listeners",
        tone: "warm, clear, wonder-forward",
      })
    : null;

  if (audio && !audio.success) {
    warnings.push(`audio skipped: ${audio.error}`);
  }

  const draft = buildCuriosityExperienceDraft({
    topicIdea: {
      title: seed.title,
      hookQuestion: toHookQuestion(seed.title),
      category: seed.category,
      subcategory: seed.subcategory,
      difficultyLevel: seed.intendedDifficulty,
      estimatedMinutes: lesson.estimatedMinutes,
      tags: seed.tags ?? [],
    },
    lesson,
    challenge: challengeRes.challenge,
    followups: followRes.content.followups,
    trails: trailsRes.content.trails,
    audio: audio?.success ? audio.content.audio : undefined,
    assemblyOptions: {
      reviewStatus: "draft",
      sourceType: "ai_generated",
      safetyFlags: [],
      contentVersion: 1,
    },
  });

  const validated = safeValidateCuriosityExperienceDraft(draft);
  if (!validated.success) {
    return {
      title: seed.title,
      slug: draft.identity.slug,
      success: false,
      draft,
      error: `draft validation: ${validated.error}`,
      warnings,
    };
  }

  const persisted = await persistCuriosityExperienceDraft(validated.data);
  if (!persisted.success) {
    return {
      title: seed.title,
      slug: validated.data.identity.slug,
      success: false,
      draft: validated.data,
      persisted,
      error: persisted.error ?? "persist failed",
      warnings: [...warnings, ...persisted.warnings],
    };
  }

  return {
    title: seed.title,
    slug: persisted.topicSlug,
    success: true,
    draft: validated.data,
    persisted,
    warnings: [...warnings, ...persisted.warnings],
  };
}

