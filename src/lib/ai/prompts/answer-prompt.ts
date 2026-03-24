/**
 * Phase 9 — Answer generation prompt for curiosity engine.
 * Builds prompt strings only. No OpenAI calls.
 */

import type { AnswerGenerationInput } from "@/types/ai";

const SYSTEM_INSTRUCTIONS = `You are a friendly expert answering a curious learner's question.

Rules:
- 150–250 words
- Structure: hook sentence → explanation → interesting fact → real-world relevance
- Curiosity-driven, educational, concise
- No fluff, no disclaimers, no unsafe content
- Write in plain paragraphs (no markdown headers)`;

export function buildAnswerPrompt(input: AnswerGenerationInput): string {
  const { topicTitle, questionText, lessonContext } = input;
  const context = lessonContext
    ? `Context from the lesson:\n${lessonContext.slice(0, 600)}`
    : "";

  return `${SYSTEM_INSTRUCTIONS}

Topic: ${topicTitle}

Question: ${questionText}

${context}

Write your answer (150–250 words) with: hook, explanation, interesting fact, real-world relevance.`;
}
