/**
 * Zod schemas for structured follow-up generation output.
 */

import { z } from "zod";

const difficultyLevelSchema = z.enum(["beginner", "intermediate", "advanced"]);

export const generatedFollowupItemSchema = z.object({
  questionText: z.string().trim().min(12).max(320),
  answerSnippet: z.string().trim().min(30).max(900),
  difficultyLevel: difficultyLevelSchema,
  sortOrder: z.number().int().min(1).max(5),
  rationale: z.string().trim().min(1).max(260).optional(),
  tagHints: z.array(z.string().trim().min(1).max(40)).max(6).optional(),
});

export function clampFollowupCount(requested: number | undefined): number {
  const n = requested ?? 4;
  return Math.min(5, Math.max(3, Math.round(n)));
}

/**
 * Root JSON: { "followups": [...] } with exact length and sortOrder 1..n each once.
 */
export function followupsResponseSchemaForCount(count: number) {
  const c = clampFollowupCount(count);
  return z
    .object({
      followups: z.array(generatedFollowupItemSchema).length(c),
    })
    .superRefine((data, ctx) => {
      const orders = data.followups.map((f) => f.sortOrder);
      const expected = new Set(Array.from({ length: c }, (_, i) => i + 1));
      const got = new Set(orders);
      if (got.size !== c || expected.size !== got.size) {
        ctx.addIssue({
          code: "custom",
          message: `sortOrder must be integers 1 through ${c}, each exactly once.`,
        });
        return;
      }
      for (const o of orders) {
        if (!expected.has(o)) {
          ctx.addIssue({
            code: "custom",
            message: `Invalid sortOrder ${o}; expected unique values 1..${c}.`,
          });
          return;
        }
      }
    });
}

export type GeneratedFollowupItemInferred = z.infer<
  typeof generatedFollowupItemSchema
>;
