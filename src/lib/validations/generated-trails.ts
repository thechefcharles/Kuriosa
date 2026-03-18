/**
 * Zod schemas for structured trail (rabbit-hole) generation output.
 */

import { z } from "zod";

const slugCandidateSchema = z
  .string()
  .trim()
  .min(3)
  .max(72)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slugCandidate must be lowercase kebab-case");

const relationshipTypeSchema = z.enum([
  "same_category",
  "deeper_dive",
  "tangential",
  "contrast",
  "application",
]);

const confidenceHintSchema = z.enum(["high", "medium", "speculative"]);

export const generatedTrailItemSchema = z.object({
  title: z.string().trim().min(8).max(140),
  reasonText: z.string().trim().min(25).max(420),
  sortOrder: z.number().int().min(1).max(6),
  category: z.string().trim().min(1).max(64).optional(),
  subcategory: z.string().trim().min(1).max(64).optional(),
  tags: z.array(z.string().trim().min(1).max(36)).max(6).optional(),
  slugCandidate: slugCandidateSchema.optional(),
  relationshipType: relationshipTypeSchema.optional(),
  confidenceHint: confidenceHintSchema.optional(),
});

export function clampTrailCount(requested: number | undefined): number {
  const n = requested ?? 4;
  return Math.min(6, Math.max(2, Math.round(n)));
}

export function trailsResponseSchemaForCount(count: number) {
  const c = clampTrailCount(count);
  return z
    .object({
      trails: z.array(generatedTrailItemSchema).length(c),
    })
    .superRefine((data, ctx) => {
      const orders = data.trails.map((t) => t.sortOrder);
      const expected = new Set(Array.from({ length: c }, (_, i) => i + 1));
      const got = new Set(orders);
      if (got.size !== c) {
        ctx.addIssue({
          code: "custom",
          message: `sortOrder must be unique; expected ${c} distinct values 1..${c}.`,
        });
        return;
      }
      for (const o of orders) {
        if (!expected.has(o)) {
          ctx.addIssue({
            code: "custom",
            message: `Invalid sortOrder ${o}; must be 1..${c} each once.`,
          });
          return;
        }
      }
    });
}
