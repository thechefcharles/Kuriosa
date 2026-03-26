/**
 * Prompt builders for suggested follow-up Q&A generation.
 */

import { clampFollowupCount } from "@/lib/validations/generated-followups";
import type { GeneratedFollowupRequestOptions } from "@/types/content-generation";

const SYSTEM_PROMPT = `You are a Kuriosa follow-up writer. You suggest short Q&A pairs that feel like natural next questions a curious reader would ask after a lesson.

Style:
- Curiosity-driven, conversational questions (not exam prompts)
- Specific and intriguing — avoid generic phrasing like "What is X?" or "How does X work?"
- Questions that feel like natural rabbit holes: "Why does X but not Y?", "What happens if…?"
- Concise answers (snippets, not essays)
- Educational but warm—not academic
- Plausible "I wonder…" energy

Return valid JSON only. No markdown.

These are **pre-generated** suggested follow-ups for a topic page—not live answers to user-typed questions.`;

function buildUserPrompt(input: GeneratedFollowupRequestOptions): string {
  const count = clampFollowupCount(input.desiredCount);
  const parts: string[] = [
    `Topic title: "${input.topicTitle}"`,
    `Category: ${input.category}.`,
    `Generate exactly ${count} follow-up Q&A items.`,
  ];

  if (input.subcategory) {
    parts.push(`Subcategory: ${input.subcategory}.`);
  }
  if (input.difficulty) {
    parts.push(`Overall difficulty hint: ${input.difficulty}.`);
  }
  if (input.audience) {
    parts.push(`Audience: ${input.audience}.`);
  }
  if (input.tags?.length) {
    parts.push(`Tags (optional inspiration): ${input.tags.join(", ")}.`);
  }

  parts.push(`
Lesson context (follow-ups must stay faithful to this—no invented facts):
---
${input.lessonSummaryOrContent.trim().slice(0, 12000)}
---
`);

  parts.push(`
Return a JSON object with this exact shape:
{
  "followups": [
    {
      "questionText": "Natural follow-up question",
      "answerSnippet": "Short direct answer (2-5 sentences max)",
      "difficultyLevel": "beginner" | "intermediate" | "advanced",
      "sortOrder": 1,
      "rationale": "optional one line why this question fits",
      "tagHints": ["optional", "short", "labels"]
    }
  ]
}

Rules:
- Exactly ${count} objects in followups
- sortOrder must be 1 through ${count} with each integer used exactly once
- Vary difficultyLevel across items where it makes sense
- questionText and answerSnippet are required; rationale and tagHints optional`);

  return parts.join("\n");
}

export function buildFollowupMessages(
  options: GeneratedFollowupRequestOptions
): Array<{ role: "system" | "user"; content: string }> {
  return [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: buildUserPrompt(options) },
  ];
}
