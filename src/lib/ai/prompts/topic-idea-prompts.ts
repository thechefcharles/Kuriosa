/**
 * Prompt builders for topic idea generation.
 * Kuriosa: curiosity-first, concise, accessible, not academic.
 */

export interface TopicIdeaPromptInput {
  category: string;
  subcategory?: string;
  audience?: string;
  tone?: string;
  difficulty?: string;
  count?: number;
  excludeTitles?: string[];
}

const SYSTEM_PROMPT = `You are a Kuriosa topic designer. Generate curiosity-worthy topic ideas that are:
- Short and clickable (like headlines)
- Curiosity-driven (questions or intriguing hooks)
- Accessible to a general audience
- NOT generic trivia or academic paper titles

Good examples: "Why do octopuses have three hearts?", "Why is lightning hotter than the sun?", "Why do humans yawn?", "How did Roman concrete last so long?"
Avoid: vague broad titles, dry textbook phrasing, repetitive variants of the same idea.`;

function buildUserPrompt(input: TopicIdeaPromptInput): string {
  const count = input.count ?? 5;
  const parts: string[] = [`Generate ${count} curiosity topic ideas for the category: ${input.category}.`];

  if (input.subcategory) {
    parts.push(`Subcategory or focus: ${input.subcategory}.`);
  }
  if (input.difficulty) {
    parts.push(`Target difficulty: ${input.difficulty}.`);
  }
  if (input.audience) {
    parts.push(`Audience: ${input.audience}.`);
  }
  if (input.tone) {
    parts.push(`Tone: ${input.tone}.`);
  }
  if (input.excludeTitles?.length) {
    parts.push(`Do NOT suggest ideas similar to: ${input.excludeTitles.join(", ")}.`);
  }

  parts.push(`
Return a JSON object with this exact shape:
{
  "ideas": [
    {
      "title": "Short clickable title",
      "hookQuestion": "Curiosity question (e.g. Why do X?)",
      "category": "Category name",
      "subcategory": "Optional subcategory",
      "difficultyLevel": "beginner|intermediate|advanced",
      "estimatedMinutes": 5,
      "tags": ["tag1", "tag2"]
    }
  ]
}
Constraints:
- difficultyLevel must be exactly one of: beginner, intermediate, advanced
- estimatedMinutes must be an integer between 3 and 15
- tags must be 1-10 short strings (no hashtags)

Each idea must have title, hookQuestion, category, difficultyLevel, estimatedMinutes, and tags.`);

  return parts.join("\n");
}

export interface TopicIdeaPromptOptions {
  category: string;
  subcategory?: string;
  audience?: string;
  tone?: string;
  difficulty?: string;
  count?: number;
  excludeTitles?: string[];
}

/**
 * Build messages for topic idea generation.
 */
export function buildTopicIdeaMessages(
  options: TopicIdeaPromptOptions
): Array<{ role: "system" | "user"; content: string }> {
  const input: TopicIdeaPromptInput = {
    category: options.category,
    subcategory: options.subcategory,
    audience: options.audience,
    tone: options.tone ?? "curious, accessible",
    difficulty: options.difficulty,
    count: options.count ?? 5,
    excludeTitles: options.excludeTitles,
  };
  return [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: buildUserPrompt(input) },
  ];
}
