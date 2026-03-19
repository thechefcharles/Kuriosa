# Lesson generation (Phase 4.3)

## What it does

The **lesson generator** calls OpenAI with a Kuriosa-style prompt and expects **structured JSON** back: one full **curiosity lesson** (intro, body, hook, summary, facts, tags, difficulty, reading time, and suggested XP). Nothing is saved to the database yet—this is the foundation for later assembly into a `CuriosityExperience`.

## Files involved

| File | Role |
|------|------|
| `src/lib/ai/prompts/lesson-prompts.ts` | Builds system + user messages from options |
| `src/lib/ai/generators/generate-lesson.ts` | `generateLesson(options)` — API call + parse |
| `src/lib/ai/parsers/lesson-parser.ts` | Safe JSON parse + Zod validation |
| `src/lib/validations/generated-lesson.ts` | Zod schemas for the `lesson` object |
| `src/types/content-generation.ts` | `GeneratedLessonRequestOptions`, `GeneratedLessonContent`, `composeLessonTextFromGenerated()` |
| `src/lib/ai/openai-client.ts` | Server-only OpenAI client |
| `src/lib/ai/examples/run-lesson-generation-example.ts` | Local verification script |

## How prompt building works

- **System message**: Kuriosa voice (curiosity-first, concise, slightly magical, not academic) + JSON-only instruction.
- **User message**: Topic title, category, optional subcategory, audience, difficulty, word-count target, tone, tags, and optional hook context.
- The model must return `{ "lesson": { ... } }` with fixed field names.

## How validation works

1. OpenAI is called with `response_format: { type: "json_object" }`.
2. `parseLessonResponse()` parses the string and runs `generatedLessonResponseSchema`.
3. Failures return `{ success: false, error, details }` with Zod issue paths—no silent failures.

Bounds (high level): min/max string lengths per field, `difficultyLevel` enum, `estimatedMinutes` 3–15, `tags` 1–12, `xpAward` 10–100.

## Mapping to CuriosityExperience (later)

| Generated field | CuriosityExperience area |
|-----------------|---------------------------|
| `title` | `identity.title` |
| `hookText` | `discoveryCard.hookQuestion` |
| `shortSummary` | `discoveryCard.shortSummary` |
| `estimatedMinutes` | `discoveryCard.estimatedMinutes` |
| `difficultyLevel`, `tags` | `taxonomy` (plus category from request) |
| `intro` + `body` | `lesson.lessonText` via `composeLessonTextFromGenerated()` |
| `surprisingFact`, `realWorldRelevance` | `lesson.*` |
| `xpAward`, `levelHint` | `rewards` |
| Intro + body text | Future **audio script** source (not generated in 4.3) |

## Run the example locally

1. Set `OPENAI_API_KEY` in `.env.local` (see `ENVIRONMENT_SETUP.md`).
2. From the project root:

```bash
npm run ai:lesson
```

You should see two lessons logged (octopus hearts + lightning), with titles, hooks, summaries, and snippet previews. If the key is missing, you’ll get a clear error about `OPENAI_API_KEY`.

## Same pattern for later generators

Challenge, follow-up, trail, and audio-script generators will follow: **`prompts/` → `generators/` → `parsers/` + `validations/`** and types in `content-generation.ts`.
