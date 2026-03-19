# Topic Idea Generation

## What It Does

Topic idea generation uses OpenAI to produce curiosity-worthy topic ideas for Kuriosa. Ideas are short, clickable, and curiosity-driven—e.g. "Why do octopuses have three hearts?" rather than academic or generic titles.

## Files Involved

| File | Purpose |
|------|---------|
| `src/lib/ai/openai-client.ts` | OpenAI client; `getOpenAIClient()` |
| `src/lib/ai/prompts/topic-idea-prompts.ts` | Prompt builder for topic ideas |
| `src/lib/ai/parsers/topic-idea-parser.ts` | Parses and validates API response |
| `src/lib/ai/generators/generate-topic-ideas.ts` | Main service: `generateTopicIdeas(options)` |
| `src/lib/validations/topic-idea.ts` | Zod schemas for topic ideas |
| `src/types/content-generation.ts` | `TopicIdeaCandidate` type |

## How Prompts Are Structured

- **System prompt**: Defines Kuriosa style—curiosity-first, concise, accessible.
- **User prompt**: Built from options (category, count, difficulty, etc.) and includes a JSON output format.
- **Output**: Expects `{ "ideas": [ {...}, ... ] }` with `title`, `hookQuestion`, `category`, `difficultyLevel`, `estimatedMinutes`, `tags`.

## How Outputs Are Validated

1. API returns JSON (via `response_format: { type: "json_object" }`).
2. `parseTopicIdeasResponse()` parses the string and runs Zod `topicIdeasResponseSchema`.
3. Invalid or malformed output returns `{ success: false, error: "..." }`.
4. Valid output returns `{ success: true, ideas: TopicIdeaCandidate[] }`.

Validation constraints enforced by Zod include:

- `difficultyLevel`: `beginner | intermediate | advanced`
- `estimatedMinutes`: integer 3–15
- `tags`: 1–10 non-empty strings

## How to Run / Test

1. Set `OPENAI_API_KEY` in `.env.local`.
2. Run the example:
   ```bash
   npm run ai:topic-ideas
   ```
3. Or import and call from a server context:
   ```typescript
   import { generateTopicIdeas } from "@/lib/ai/generators/generate-topic-ideas";

   const result = await generateTopicIdeas({ category: "Science", count: 3 });
   if (result.success) {
     console.log(result.ideas);
   }
   ```

## Later Phases

- **4.3+**: Lesson generator, challenge generator, follow-up generator, trail generator.
- Each will follow the same pattern: prompts → parsers → generators → Zod validation.
- Topic ideas feed into lesson generation; lessons feed into quizzes and follow-ups.
