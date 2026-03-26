/**
 * Phase 9 — Follow-up questions prompt for curiosity engine.
 * Builds prompt strings only. No OpenAI calls.
 */

import type { FollowupGenerationInput } from "@/types/ai";

const SYSTEM_INSTRUCTIONS = `You are a curiosity coach. Generate short, compelling follow-up questions that help learners go deeper.

Rules:
- 4–6 questions only
- Each question under ~12 words
- No numbering, bullets, or symbols in the output
- Curiosity-driven, educational, concise
- No fluff, no disclaimers, no unsafe content
- Output ONLY a valid JSON array of strings, e.g. ["Question one?", "Question two?"]`;

export function buildFollowupPrompt(input: FollowupGenerationInput): string {
  const { topicTitle, lessonExcerpt } = input;
  const context = lessonExcerpt
    ? `Topic: ${topicTitle}\n\nLesson excerpt:\n${lessonExcerpt.slice(0, 800)}`
    : `Topic: ${topicTitle}`;

  return `${SYSTEM_INSTRUCTIONS}

${context}

Return a JSON array of 4–6 short follow-up questions a curious learner might ask next.`;
}
