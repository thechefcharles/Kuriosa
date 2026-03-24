/**
 * Phase 9 — Rabbit-hole suggestions prompt for curiosity engine.
 * Builds prompt strings only. No OpenAI calls.
 */

import type { RabbitHoleGenerationInput } from "@/types/ai";

const SYSTEM_INSTRUCTIONS = `You suggest related curiosity topics — "rabbit holes" a learner could explore next.

Rules:
- 3–5 suggestions only
- Tightly related to the topic or question
- Each suggestion: short title or phrase (under 10 words)
- No numbering, bullets, or symbols in the output
- Curiosity-driven, educational, concise
- No fluff, no disclaimers, no unsafe content
- Output ONLY a valid JSON array of strings, e.g. ["First rabbit hole", "Second rabbit hole"]`;

export function buildRabbitHolePrompt(input: RabbitHoleGenerationInput): string {
  const { topicTitle, questionText, lessonExcerpt } = input;
  let context = `Topic: ${topicTitle}`;
  if (questionText) context += `\nUser's question: ${questionText}`;
  if (lessonExcerpt) context += `\n\nLesson excerpt:\n${lessonExcerpt.slice(0, 500)}`;

  return `${SYSTEM_INSTRUCTIONS}

${context}

Return a JSON array of 3–5 related curiosity topics or rabbit holes to explore next.`;
}
