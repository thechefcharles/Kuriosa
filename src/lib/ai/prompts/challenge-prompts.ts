/**
 * Prompt builders for challenge (quiz) generation.
 */

import type { GeneratedChallengeRequestOptions } from "@/types/content-generation";

const SYSTEM_PROMPT = `You are a Kuriosa challenge writer. You create short quizzes that reinforce curiosity after a lesson.

Style:
- Clear, concise questions
- Curiosity-reinforcing (test understanding, not trivia for trivia's sake)
- Educational but not academic or exam-like
- Engaging, not homework-y

You must return valid JSON only—no markdown fences.

Future quiz types (math, pattern, probability) may be added later; for now only use: multiple_choice, memory_recall, logic.

For multiple_choice and logic, always use exactly four options with ids "a", "b", "c", "d" (each id exactly once). Set correctOptionId to the letter of the single correct answer.

For memory_recall, either:
- Primary: include correctAnswer (the main acceptable short answer), no options array.
- Bonus: include acceptedAnswers (array of acceptable phrasings), no options array.`;

function pickPrimaryMode(
  desired?: Array<"multiple_choice" | "memory_recall" | "logic">
): "multiple_choice" | "memory_recall" | "logic" {
  if (!desired?.length) return "multiple_choice";
  if (desired.includes("memory_recall") && desired.length === 1) return "memory_recall";
  const mc = desired.find((t) => t === "multiple_choice" || t === "logic");
  return mc ?? "multiple_choice";
}

function pickBonusMode(
  desired?: Array<"multiple_choice" | "memory_recall" | "logic">
): "multiple_choice" | "memory_recall" | "logic" {
  if (!desired?.length) return "memory_recall";
  if (desired.includes("memory_recall")) return "memory_recall";
  return desired.includes("logic") ? "logic" : "multiple_choice";
}

function buildUserPrompt(input: GeneratedChallengeRequestOptions): string {
  const primaryMode = pickPrimaryMode(input.desiredChallengeTypes);
  const bonusMode = pickBonusMode(input.desiredChallengeTypes);

  const parts: string[] = [
    `Topic title: "${input.topicTitle}"`,
    `Category: ${input.category}.`,
  ];
  if (input.difficulty) {
    parts.push(`Difficulty: ${input.difficulty}.`);
  }
  if (input.audience) {
    parts.push(`Audience: ${input.audience}.`);
  }
  if (input.tags?.length) {
    parts.push(`Tags: ${input.tags.join(", ")}.`);
  }

  parts.push(`
Lesson context (quiz must be faithful to this—no facts not supported here):
---
${input.lessonSummaryOrContent.trim().slice(0, 12000)}
---
`);

  parts.push(`
Generate TWO challenges: one PRIMARY (main post-lesson quiz) and one BONUS (lighter follow-up).

PRIMARY must use quizType "${primaryMode}".
BONUS must use quizType "${bonusMode}".

If primary is multiple_choice or logic: include options array (four objects with id a,b,c,d) and correctOptionId.
If primary is memory_recall: include correctAnswer string only (no options).

If bonus is memory_recall: include acceptedAnswers (1–6 short acceptable strings).
If bonus is multiple_choice or logic: include options + correctOptionId.

Return exactly this JSON shape:
{
  "primary": { ... },
  "bonus": { ... },
  "primaryXpAward": integer 10-60 (XP for completing primary),
  "bonusXpAward": integer 0-40 (optional extra XP for bonus)
}

All questions and explanations must be plain text. No HTML.`);

  return parts.join("\n");
}

export function buildChallengeMessages(
  options: GeneratedChallengeRequestOptions
): Array<{ role: "system" | "user"; content: string }> {
  return [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: buildUserPrompt(options) },
  ];
}
