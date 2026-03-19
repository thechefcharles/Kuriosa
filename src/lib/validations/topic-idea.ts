/**
 * Zod schemas for topic idea generation outputs.
 */

import { z } from "zod";

const difficultyLevelSchema = z.enum(["beginner", "intermediate", "advanced"]);

export const topicIdeaCandidateSchema = z.object({
  title: z.string().trim().min(1).max(120),
  hookQuestion: z.string().trim().min(1).max(200),
  category: z.string().trim().min(1).max(80),
  subcategory: z.string().optional(),
  difficultyLevel: difficultyLevelSchema,
  estimatedMinutes: z.number().int().min(3).max(15),
  tags: z.array(z.string().trim().min(1)).min(1).max(10),
});

export const topicIdeasResponseSchema = z.object({
  ideas: z.array(topicIdeaCandidateSchema).min(1),
});

export type TopicIdeaCandidateSchemaType = z.infer<typeof topicIdeaCandidateSchema>;
