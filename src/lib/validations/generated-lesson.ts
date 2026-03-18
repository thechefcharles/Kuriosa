/**
 * Zod schemas for structured lesson generation output.
 */

import { z } from "zod";

const difficultyLevelSchema = z.enum(["beginner", "intermediate", "advanced"]);

/** Single lesson object as returned by the model (nested under "lesson"). */
export const generatedLessonContentSchema = z.object({
  title: z.string().trim().min(3).max(140),
  hookText: z.string().trim().min(8).max(220),
  shortSummary: z
    .string()
    .trim()
    .min(20)
    .max(320),
  intro: z.string().trim().min(40).max(1200),
  body: z.string().trim().min(200).max(8000),
  surprisingFact: z.string().trim().min(15).max(600),
  realWorldRelevance: z.string().trim().min(20).max(900),
  difficultyLevel: difficultyLevelSchema,
  estimatedMinutes: z.number().int().min(3).max(15),
  tags: z.array(z.string().trim().min(1)).min(1).max(12),
  /** XP suggested for completing this curiosity; feeds rewards later. */
  xpAward: z.number().int().min(10).max(100),
  levelHint: z.number().int().min(1).max(50).optional(),
});

export const generatedLessonResponseSchema = z.object({
  lesson: generatedLessonContentSchema,
});

export type GeneratedLessonContentSchemaType = z.infer<
  typeof generatedLessonContentSchema
>;
