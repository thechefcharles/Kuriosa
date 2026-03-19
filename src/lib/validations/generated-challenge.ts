/**
 * Zod schemas for structured challenge (quiz) generation output.
 */

import { z } from "zod";

const optionSchema = z.object({
  id: z.enum(["a", "b", "c", "d"]),
  optionText: z.string().trim().min(1).max(280),
});

function refineFourOptionsUnique(
  data: {
    options: { id: "a" | "b" | "c" | "d" }[];
    correctOptionId: "a" | "b" | "c" | "d";
  },
  ctx: z.RefinementCtx
): void {
  const ids = data.options.map((o) => o.id).sort().join("");
  if (ids !== "abcd") {
    ctx.addIssue({
      code: "custom",
      message:
        "Primary multiple_choice/logic must have exactly four options with ids a, b, c, d (each once).",
    });
    return;
  }
  if (!data.options.some((o) => o.id === data.correctOptionId)) {
    ctx.addIssue({
      code: "custom",
      path: ["correctOptionId"],
      message: "correctOptionId must match one of the option ids.",
    });
  }
}

/** Primary: MC or logic — four options, exactly one correct. */
const primaryOptionsQuizSchema = z
  .object({
    quizType: z.union([z.literal("multiple_choice"), z.literal("logic")]),
    questionText: z.string().trim().min(15).max(520),
    options: z.array(optionSchema).length(4),
    correctOptionId: z.enum(["a", "b", "c", "d"]),
    explanationText: z.string().trim().min(25).max(1600),
  })
  .superRefine(refineFourOptionsUnique);

/** Primary: short-answer style (maps later to freeform / recall UX). */
const primaryMemoryRecallSchema = z.object({
  quizType: z.literal("memory_recall"),
  questionText: z.string().trim().min(15).max(520),
  correctAnswer: z.string().trim().min(1).max(220),
  explanationText: z.string().trim().min(25).max(1600),
});

export const generatedPrimaryQuizSchema = z.union([
  primaryOptionsQuizSchema,
  primaryMemoryRecallSchema,
]);

function refineBonusFourOptions(
  data: {
    options: { id: "a" | "b" | "c" | "d" }[];
    correctOptionId: "a" | "b" | "c" | "d";
  },
  ctx: z.RefinementCtx
): void {
  const ids = data.options.map((o) => o.id).sort().join("");
  if (ids !== "abcd") {
    ctx.addIssue({
      code: "custom",
      message:
        "Bonus multiple_choice/logic must have exactly four options with ids a, b, c, d (each once).",
    });
    return;
  }
  if (!data.options.some((o) => o.id === data.correctOptionId)) {
    ctx.addIssue({
      code: "custom",
      path: ["correctOptionId"],
      message: "correctOptionId must match one of the option ids.",
    });
  }
}

const bonusMemorySchema = z.object({
  quizType: z.literal("memory_recall"),
  questionText: z.string().trim().min(12).max(480),
  acceptedAnswers: z.array(z.string().trim().min(1)).min(1).max(8),
  explanationText: z.string().trim().min(20).max(1200),
});

const bonusOptionsQuizSchema = z
  .object({
    quizType: z.union([z.literal("multiple_choice"), z.literal("logic")]),
    questionText: z.string().trim().min(12).max(480),
    options: z.array(optionSchema).length(4),
    correctOptionId: z.enum(["a", "b", "c", "d"]),
    explanationText: z.string().trim().min(20).max(1200),
  })
  .superRefine(refineBonusFourOptions);

export const generatedBonusQuestionSchema = z.union([
  bonusMemorySchema,
  bonusOptionsQuizSchema,
]);

export const generatedChallengePackSchema = z.object({
  primary: generatedPrimaryQuizSchema,
  bonus: generatedBonusQuestionSchema,
  primaryXpAward: z.number().int().min(5).max(80).optional(),
  bonusXpAward: z.number().int().min(0).max(50).optional(),
});

export type GeneratedPrimaryQuizInferred = z.infer<
  typeof generatedPrimaryQuizSchema
>;
export type GeneratedBonusQuestionInferred = z.infer<
  typeof generatedBonusQuestionSchema
>;
