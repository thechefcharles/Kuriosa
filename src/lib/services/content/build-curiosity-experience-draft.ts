/**
 * Assembles validated generator outputs into a canonical CuriosityExperience.
 * No DB writes. No new AI calls.
 */

import type { CuriosityExperience } from "@/types/curiosity-experience";
import { createCuriosityDraftIdentity } from "@/lib/services/content/ensure-curiosity-identity";
import { defaultCuriosityRewards } from "@/lib/services/content/default-curiosity-rewards";
import {
  slugifyCategorySlug,
} from "@/lib/services/content/slugify-curiosity";
import {
  composeLessonTextFromGenerated,
  followupItemToCuriosityFields,
  primaryQuizToCuriosityOptions,
} from "@/types/content-generation";
import type { GeneratedCuriosityExperienceDraftInput } from "@/types/content-generation";
import { generatedAudioToCuriosityFields } from "@/types/content-generation";
import type {
  GeneratedBonusQuestion,
  GeneratedPrimaryQuiz,
} from "@/types/content-generation";
import { trailItemToCuriosityTrail } from "@/lib/services/content/normalize-trail-candidate";

function primaryToCuriosityChallenge(
  primary: GeneratedPrimaryQuiz,
  challengeId: string
): CuriosityExperience["challenge"] {
  const opts = primaryQuizToCuriosityOptions(primary);
  if (primary.quizType === "memory_recall") {
    return {
      id: challengeId,
      questionText: primary.questionText,
      quizType: "memory_recall",
      options: [
        {
          optionText: primary.correctAnswer,
          isCorrect: true,
        },
      ],
      explanationText: primary.explanationText,
      difficultyLevel: undefined,
    };
  }
  return {
    id: challengeId,
    questionText: primary.questionText,
    quizType: primary.quizType,
    options: opts,
    explanationText: primary.explanationText,
    difficultyLevel: undefined,
  };
}

function summarizeBonusForNotes(bonus: GeneratedBonusQuestion): string {
  if (bonus.quizType === "memory_recall") {
    return [
      `[Bonus memory_recall] ${bonus.questionText}`,
      `Accepted: ${bonus.acceptedAnswers.join(" | ")}`,
      bonus.explanationText,
    ].join("\n");
  }
  const correct = bonus.options.find((o) => o.id === bonus.correctOptionId);
  return [
    `[Bonus ${bonus.quizType}] ${bonus.questionText}`,
    `Correct: ${correct?.optionText ?? bonus.correctOptionId}`,
    bonus.explanationText,
  ].join("\n");
}

function mergeTags(ideaTags: string[], lessonTags: string[]): string[] {
  const set = new Set<string>();
  for (const t of [...ideaTags, ...lessonTags]) {
    const x = t.trim().toLowerCase();
    if (x) set.add(x.replace(/\s+/g, "-"));
  }
  return Array.from(set).slice(0, 16);
}

/**
 * Build a full CuriosityExperience from generator outputs.
 */
export function buildCuriosityExperienceDraft(
  input: GeneratedCuriosityExperienceDraftInput
): CuriosityExperience {
  const {
    topicIdea,
    lesson,
    challenge,
    followups,
    trails,
    audio: audioScript,
    assemblyOptions,
  } = input;

  const { identity } = createCuriosityDraftIdentity(lesson.title, {
    slugOverride: assemblyOptions?.slugOverride,
  });

  const category = topicIdea.category;
  const subcategory = topicIdea.subcategory ?? lesson.tags[0];

  const moderationNotesParts: string[] = [];
  moderationNotesParts.push(summarizeBonusForNotes(challenge.bonus));
  if (assemblyOptions?.assemblyNotes) {
    moderationNotesParts.push(assemblyOptions.assemblyNotes);
  }

  const trailCuriosity = [...trails]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(trailItemToCuriosityTrail);

  const followupCuriosity = [...followups]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item, i) => {
      const f = followupItemToCuriosityFields(item);
      return {
        id: `fu-${identity.slug}-${item.sortOrder}`,
        questionText: f.questionText,
        answerText: f.answerText,
        difficultyLevel: f.difficultyLevel,
      };
    });

  const experience: CuriosityExperience = {
    identity,
    discoveryCard: {
      hookQuestion: lesson.hookText,
      shortSummary: lesson.shortSummary,
      estimatedMinutes: lesson.estimatedMinutes,
    },
    taxonomy: {
      category,
      categorySlug: slugifyCategorySlug(category),
      subcategory,
      difficultyLevel: lesson.difficultyLevel,
      tags: mergeTags(topicIdea.tags, lesson.tags),
    },
    lesson: {
      lessonText: composeLessonTextFromGenerated(lesson),
      surprisingFact: lesson.surprisingFact,
      realWorldRelevance: lesson.realWorldRelevance,
    },
    challenge: primaryToCuriosityChallenge(
      challenge.primary,
      `quiz-${identity.slug}`
    ),
    rewards: defaultCuriosityRewards(lesson, challenge),
    followups: followupCuriosity,
    trails: trailCuriosity,
    progressionHooks: {
      nextTrailSlugs: trailCuriosity.map((t) => t.toTopicSlug).slice(0, 8),
      suggestedBadges: assemblyOptions?.suggestedBadges,
    },
    moderation: {
      reviewStatus: assemblyOptions?.reviewStatus ?? "draft",
      safetyFlags: assemblyOptions?.safetyFlags ?? [],
      notes: moderationNotesParts.filter(Boolean).join("\n\n---\n\n") || undefined,
      status: "pending",
    },
    analytics: {
      sourceType: assemblyOptions?.sourceType ?? "ai_generated",
      generatedAt: new Date().toISOString(),
      version: assemblyOptions?.contentVersion ?? 1,
    },
  };

  if (audioScript) {
    experience.audio = {
      ...generatedAudioToCuriosityFields(audioScript),
    };
  }

  return experience;
}
