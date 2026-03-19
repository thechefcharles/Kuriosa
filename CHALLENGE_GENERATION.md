# Challenge generation (Phase 4.4)

## What it does

**`generateChallenge(options)`** asks OpenAI for a **primary** quiz (main post-lesson check) plus a **bonus** question, based on your topic and **lesson text or summary**. The response is **structured JSON**, then parsed and validated with **Zod**. Nothing is written to the database yet.

## Files involved

| File | Role |
|------|------|
| `src/lib/ai/prompts/challenge-prompts.ts` | Builds system + user messages |
| `src/lib/ai/generators/generate-challenge.ts` | `generateChallenge(options)` |
| `src/lib/ai/parsers/challenge-parser.ts` | Safe JSON parse + validation |
| `src/lib/validations/generated-challenge.ts` | Schemas for primary + bonus |
| `src/types/content-generation.ts` | `GeneratedChallengeRequestOptions`, `GeneratedPrimaryQuiz`, `GeneratedBonusQuestion`, `GeneratedChallengeContent`, `primaryQuizToCuriosityOptions()` |
| `src/lib/ai/examples/run-challenge-generation-example.ts` | Local demo |

## Supported quiz types (now)

- **multiple_choice** — four options, ids `a`–`d`, exactly one `correctOptionId`
- **logic** — same shape as multiple_choice (reasoning-style stem)
- **memory_recall** — primary: `correctAnswer`; bonus: `acceptedAnswers[]`

Types like **math**, **pattern**, **probability** are noted in prompts for later; they are not generated yet.

## How validation works

- **Primary (MC / logic)**: exactly **four** options, ids **a, b, c, d** each once; **exactly one** matches `correctOptionId`
- **Primary (memory_recall)**: `correctAnswer` required; no options
- **Bonus (memory_recall)**: `acceptedAnswers` (1–8 strings)
- **Bonus (MC / logic)**: same four-option rules as primary
- Optional **`primaryXpAward`** / **`bonusXpAward`** for future rewards assembly

## Mapping to CuriosityExperience

- **Primary** maps to `CuriosityChallenge`: `questionText`, `quizType`, `options` via **`primaryQuizToCuriosityOptions(primary)`** (empty options for memory_recall until you add a freeform UX in assembly).
- **Bonus** is extra content for a second challenge row or “bonus XP” flow later—not yet a second `CuriosityChallenge` in the canonical single-challenge shape; store the pack as-is until assembly defines it.

## Run the example

```bash
npm run ai:challenge
```

Requires **`OPENAI_API_KEY`** in `.env.local`. You should see two topics (octopus + lightning), each with primary + bonus logged.

## Pattern for 4.5+

Same stack as topic ideas and lessons: **prompts → generator → parser + validations**. Follow-ups, trails, and audio scripts will mirror this.
