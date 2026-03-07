/**
 * Zod schemas for CuriosityExperience validation.
 */

import { z } from "zod";

export const curiosityIdentitySchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
});

export const curiosityDiscoveryCardSchema = z.object({
  hookQuestion: z.string().min(1),
  shortSummary: z.string().min(1),
  estimatedMinutes: z.number().int().positive(),
});

export const curiosityTaxonomySchema = z.object({
  category: z.string().min(1),
  categorySlug: z.string().min(1),
  subcategory: z.string().optional(),
  difficultyLevel: z.string().min(1),
  tags: z.array(z.string()),
});

export const curiosityLessonSchema = z.object({
  lessonText: z.string().min(1),
  surprisingFact: z.string().optional(),
  realWorldRelevance: z.string().optional(),
});

export const curiosityAudioSchema = z.object({
  audioUrl: z.string().url().optional(),
  transcript: z.string().optional(),
  durationSeconds: z.number().int().positive().optional(),
});

export const curiosityQuizOptionSchema = z.object({
  optionText: z.string().min(1),
  isCorrect: z.boolean(),
});

export const curiosityChallengeSchema = z.object({
  id: z.string().min(1),
  questionText: z.string().min(1),
  quizType: z.string().min(1),
  options: z.array(curiosityQuizOptionSchema).min(1),
  explanationText: z.string().optional(),
  difficultyLevel: z.string().optional(),
});

export const curiosityRewardsSchema = z.object({
  xpAward: z.number().int().nonnegative(),
  levelHint: z.number().int().positive().optional(),
});

export const curiosityFollowupSchema = z.object({
  id: z.string().min(1),
  questionText: z.string().min(1),
  answerText: z.string().optional(),
  difficultyLevel: z.string().optional(),
});

export const curiosityTrailSchema = z.object({
  toTopicSlug: z.string().min(1),
  toTopicTitle: z.string().min(1),
  reasonText: z.string(),
  sortOrder: z.number().int().nonnegative(),
});

export const curiosityProgressionHooksSchema = z.object({
  suggestedBadges: z.array(z.string()).optional(),
  nextTrailSlugs: z.array(z.string()).optional(),
});

export const curiosityModerationSchema = z.object({
  reviewedAt: z.string().optional(),
  status: z.enum(["pending", "approved", "flagged"]).optional(),
  notes: z.string().optional(),
});

export const curiosityAnalyticsMetadataSchema = z.object({
  sourceType: z.string().optional(),
  generatedAt: z.string().optional(),
  version: z.number().optional(),
});

export const curiosityExperienceSchema = z.object({
  identity: curiosityIdentitySchema,
  discoveryCard: curiosityDiscoveryCardSchema,
  taxonomy: curiosityTaxonomySchema,
  lesson: curiosityLessonSchema,
  audio: curiosityAudioSchema.optional(),
  challenge: curiosityChallengeSchema,
  rewards: curiosityRewardsSchema,
  followups: z.array(curiosityFollowupSchema),
  trails: z.array(curiosityTrailSchema),
  progressionHooks: curiosityProgressionHooksSchema.optional(),
  moderation: curiosityModerationSchema.optional(),
  analytics: curiosityAnalyticsMetadataSchema.optional(),
});

export type CuriosityExperienceSchemaType = z.infer<typeof curiosityExperienceSchema>;
