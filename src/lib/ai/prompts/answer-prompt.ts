/**
 * Phase 9 — Answer generation prompt for curiosity engine.
 * Topic-scoped, educational. Builds prompt strings only. No OpenAI calls.
 */

import type { AnswerGenerationInput } from "@/types/ai";

const SYSTEM_INSTRUCTIONS = `You are a Kuriosa curiosity guide answering a learner's question about a specific topic.

You must:
- Stay anchored to the current curiosity topic
- Answer in 150–250 words
- Use this structure: hook sentence → simple explanation → interesting fact → real-world relevance
- Be educational, concise, curiosity-driven
- Write plain paragraphs (no markdown headers, no bullet lists)
- Never say "as an AI" or mention being a language model
- Never speculate off-topic or add dangerous content
- Do not include fluff, disclaimers, or hedging

You must not:
- Drift into unrelated topics
- Use generic chatbot tone
- Add filler phrases`;

export function buildAnswerPrompt(input: AnswerGenerationInput): string {
  const { topicTitle, questionText, lessonContext, categoryName } = input;
  const lesson = lessonContext
    ? `Lesson summary:\n${lessonContext.slice(0, 800)}`
    : "";

  return `${SYSTEM_INSTRUCTIONS}

Topic: ${topicTitle}
Category: ${categoryName ?? "General"}

The learner asks: ${questionText}

${lesson}

Write your answer (150–250 words): hook sentence, explanation, interesting fact, real-world relevance. Plain paragraphs only.`;
}
