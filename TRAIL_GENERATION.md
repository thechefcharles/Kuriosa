# Trail generation (Phase 4.6)

## What it does

**`generateTrails(options)`** produces **curiosity trails**—suggested **next topics** after someone finishes a lesson, each with a **reason** and **display order**. Outputs are **candidates only**: no DB lookup, no ranking against live inventory yet.

Structured **JSON** → parse → **Zod** validation.

## Files involved

| File | Role |
|------|------|
| `src/lib/ai/prompts/trail-prompts.ts` | System + user messages |
| `src/lib/ai/generators/generate-trails.ts` | `generateTrails(options)` |
| `src/lib/ai/parsers/trail-parser.ts` | Safe JSON + validation |
| `src/lib/validations/generated-trails.ts` | Per-trail schema, count 2–6, sortOrder rules |
| `src/types/content-generation.ts` | `GeneratedTrailRequestOptions`, `GeneratedTrailItem`, `GeneratedTrailContent` |
| `src/lib/services/content/normalize-trail-candidate.ts` | Slug/title helpers + **`trailItemToCuriosityTrail()`** |
| `src/lib/ai/examples/run-trail-generation-example.ts` | **`npm run ai:trails`** |

## Prompt building

Inputs: **current topic title**, **category**, optional **subcategory**, **difficulty**, **tags**, **lesson text**, optional **existing topic library context** (plain text), **audience**, **desiredCount** (clamped **2–6**, default **4**). The model returns **`{ trails: [...] }`** with **exact length** and **sortOrder** `1…n` each once.

## Validation

- **title**, **reasonText** length bounds  
- **sortOrder** unique **1..n**  
- Optional **slugCandidate**: lowercase **kebab-case** only  
- Optional **relationshipType** / **confidenceHint** enums  

## CuriosityExperience & DB (later)

| Generated | `CuriosityTrail` |
|-----------|------------------|
| `title` | `toTopicTitle` |
| `reasonText` | `reasonText` |
| `sortOrder` | `sortOrder` |
| slug | `toTopicSlug` via **`resolveTrailSlugCandidate()`** or **`trailItemToCuriosityTrail()`** |

Persistence: match or create **topics** by slug/title, then **`topic_trails`** (from_topic → to_topic).

## Run the example

```bash
npm run ai:trails
```

Needs **`OPENAI_API_KEY`** in `.env.local`. Expect two runs (octopus: 4 trails, lightning: 3).

## Next phases

Audio scripts (4.7+), recommendation/matching against real topics, and **`topic_trails`** writes use the same **prompts → generator → parser → Zod** pattern.
