# Follow-up generation (Phase 4.5)

## What it does

**`generateFollowups(options)`** asks OpenAI for **pre-generated suggested Q&A**—questions a curious reader might ask after a lesson, each with a **short answer snippet**. This is **not** live answering of user-typed questions; that comes later.

Output is **structured JSON**, then parsed and validated with **Zod**. Nothing is saved to the database yet.

## Files involved

| File | Role |
|------|------|
| `src/lib/ai/prompts/followup-prompts.ts` | System + user messages |
| `src/lib/ai/generators/generate-followups.ts` | `generateFollowups(options)` |
| `src/lib/ai/parsers/followup-parser.ts` | Safe JSON + validation |
| `src/lib/validations/generated-followups.ts` | Item schema + count + sortOrder rules |
| `src/types/content-generation.ts` | `GeneratedFollowupRequestOptions`, `GeneratedFollowupItem`, `GeneratedFollowupContent`, `followupItemToCuriosityFields()` |
| `src/lib/ai/examples/run-followup-generation-example.ts` | Local demo |

## How prompt building works

Inputs include **topic title**, **category**, optional **subcategory**, **difficulty**, **lesson text/summary**, **tags**, **audience**, and **`desiredCount`** (3–5 items, default 4). The model must return `{ "followups": [ ... ] }` with **exactly** that many items and **sortOrder** `1` … `n` each once.

## How validation works

- Each item: **questionText**, **answerSnippet**, **difficultyLevel** (enum), **sortOrder**, optional **rationale**, **tagHints**
- Array length must match **clamped desired count** (3–5)
- **sortOrder** values must be a permutation of `1..n`
- String length bounds reject empty or runaway output

## Mapping to CuriosityExperience

| Generated | CuriosityFollowup / DB |
|-----------|-------------------------|
| `questionText` | `questionText` |
| `answerSnippet` | `answerText` (use `followupItemToCuriosityFields`) |
| `difficultyLevel` | `difficultyLevel` |
| `sortOrder` | display / `topic_followups` ordering |

Manual user questions later can reuse the same **question/answer** shape with different provenance.

## Run the example

```bash
npm run ai:followups
```

Requires **`OPENAI_API_KEY`** in `.env.local`. Expect two topics: one with **4** follow-ups, one with **3**.

## Later pipeline

Trails, audio, and live Q&A will follow the same **prompts → generator → parser → Zod** pattern.
