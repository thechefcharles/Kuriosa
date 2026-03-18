/**
 * Prompt builders for curiosity trail (next-topic) generation.
 */

import { clampTrailCount } from "@/lib/validations/generated-trails";
import type { GeneratedTrailRequestOptions } from "@/types/content-generation";

const SYSTEM_PROMPT = `You are a Kuriosa trail designer. You suggest "what to explore next" topics—natural rabbit holes after someone finishes a curiosity lesson.

Style:
- Curiosity-driven next steps, not random Wikipedia dumps
- Varied angles (deeper dive, related wonder, contrast, real-world hook)
- Concise reason lines (why this trail fits)
- Warm and wonder-forward, not academic

Return valid JSON only. No markdown.

These are **candidate** topics—they may not exist in the product database yet. Use plausible titles; slugCandidate must be lowercase kebab-case if provided.

Optional fields you may include per trail: category, subcategory, tags, slugCandidate, relationshipType (same_category | deeper_dive | tangential | contrast | application), confidenceHint (high | medium | speculative).`;

function buildUserPrompt(input: GeneratedTrailRequestOptions): string {
  const count = clampTrailCount(input.desiredCount);
  const parts: string[] = [
    `Current topic title: "${input.currentTopicTitle}"`,
    `Category: ${input.category}.`,
    `Suggest exactly ${count} distinct next-topic trails.`,
  ];

  if (input.subcategory) parts.push(`Subcategory: ${input.subcategory}.`);
  if (input.difficulty) parts.push(`Difficulty context: ${input.difficulty}.`);
  if (input.tags?.length) parts.push(`Topic tags: ${input.tags.join(", ")}.`);
  if (input.audience) parts.push(`Audience: ${input.audience}.`);

  parts.push(`
Lesson context (trails must feel connected—not generic trivia):
---
${input.lessonSummaryOrContent.trim().slice(0, 12000)}
---
`);

  if (input.existingTopicLibraryContext?.trim()) {
    parts.push(`
Optional reference — existing or planned topic titles (avoid near-duplicates of the current title; you may echo one if it is a strong next step):
---
${input.existingTopicLibraryContext.trim().slice(0, 8000)}
---
`);
  }

  parts.push(`
Return JSON:
{
  "trails": [
    {
      "title": "Short clickable next-topic title (question-style welcome)",
      "reasonText": "One or two sentences: why go there next",
      "sortOrder": 1,
      "category": "optional",
      "subcategory": "optional",
      "tags": ["optional"],
      "slugCandidate": "optional-kebab-slug",
      "relationshipType": "deeper_dive",
      "confidenceHint": "medium"
    }
  ]
}

Rules:
- Exactly ${count} trails
- sortOrder must be 1 through ${count}, each integer exactly once
- Titles must not repeat the same idea; diversify relationshipType where possible`);

  return parts.join("\n");
}

export function buildTrailMessages(
  options: GeneratedTrailRequestOptions
): Array<{ role: "system" | "user"; content: string }> {
  return [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: buildUserPrompt(options) },
  ];
}
