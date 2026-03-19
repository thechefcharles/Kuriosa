/**
 * Prompt builders for curiosity lesson generation.
 * Kuriosa: curiosity-first, concise, slightly magical, not academic.
 */

import type { GeneratedLessonRequestOptions } from "@/types/content-generation";

const SYSTEM_PROMPT = `You are a Kuriosa lesson writer. You write short curiosity lessons for a general audience.

Voice and style:
- Curiosity-first: open with wonder, not a textbook definition
- Concise and scannable; short paragraphs
- Accessible (no jargon without a plain explanation)
- Slightly magical in tone—delightful, not corny
- Never dry, academic, or lecture-heavy

You must respond with valid JSON only, matching the exact shape requested in the user message.`;

function buildUserPrompt(input: GeneratedLessonRequestOptions): string {
  const wordTarget = input.targetWordCount ?? 220;
  const tone = input.tone ?? "curious, warm, a little wonder-struck";
  const parts: string[] = [
    `Write one Kuriosa lesson for this topic title: "${input.topicTitle}".`,
    `Category: ${input.category}.`,
  ];

  if (input.subcategory) {
    parts.push(`Subcategory or angle: ${input.subcategory}.`);
  }
  if (input.audience) {
    parts.push(`Primary audience: ${input.audience}.`);
  }
  if (input.difficulty) {
    parts.push(`Difficulty level (voice depth): ${input.difficulty}.`);
  }
  parts.push(`Tone: ${tone}.`);
  parts.push(
    `Aim for roughly ${wordTarget} words total in intro + body combined (intro shorter, body carries the explanation). Stay within that ballpark.`
  );

  if (input.tags?.length) {
    parts.push(`Relevant tags to reflect in the tags array: ${input.tags.join(", ")}.`);
  }
  if (input.hookContext?.trim()) {
    parts.push(`Hook / question context to lean into: ${input.hookContext.trim()}`);
  }

  parts.push(`
Return a single JSON object with this exact shape (no markdown, no code fences):
{
  "lesson": {
    "title": "Same or refined topic title",
    "hookText": "One line curiosity hook (can echo the title question)",
    "shortSummary": "1–2 sentences for a discovery card / feed blurb",
    "intro": "Opening paragraph(s) that pull the reader in",
    "body": "Main lesson: explain clearly with curiosity; no quiz or follow-up questions here",
    "surprisingFact": "One memorable surprising fact",
    "realWorldRelevance": "Why this matters or where you see it in life",
    "difficultyLevel": "beginner" | "intermediate" | "advanced",
    "estimatedMinutes": 3-15 integer (reading time),
    "tags": ["3-8 short lowercase-ish tags"],
    "xpAward": integer 10-80 (reasonable XP for one short lesson),
    "levelHint": optional integer 1-20 if you want to hint progression tier
  }
}

Rules:
- difficultyLevel must be exactly beginner, intermediate, or advanced
- All string fields must be non-empty and within reasonable length
- Do not include quizzes, follow-up Q&A, or trail suggestions in the JSON`);

  return parts.join("\n");
}

/**
 * Build chat messages for lesson generation.
 */
export function buildLessonMessages(
  options: GeneratedLessonRequestOptions
): Array<{ role: "system" | "user"; content: string }> {
  return [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: buildUserPrompt(options) },
  ];
}
