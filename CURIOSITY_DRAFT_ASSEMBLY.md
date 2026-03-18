# CuriosityExperience draft assembly (Phase 4.8)

## What it does

**`buildCuriosityExperienceDraft(input)`** merges **topic idea**, **lesson**, **challenge pack**, **follow-ups**, **trails**, and optional **audio script** into one canonical **`CuriosityExperience`**. No database writes, no new AI calls.

## Files involved

| File | Role |
|------|------|
| `src/lib/services/content/build-curiosity-experience-draft.ts` | Main mapper |
| `src/lib/services/content/slugify-curiosity.ts` | Topic + category slugs |
| `src/lib/services/content/ensure-curiosity-identity.ts` | `draft:{slug}` id, timestamps |
| `src/lib/services/content/default-curiosity-rewards.ts` | XP / level hint |
| `src/lib/validations/assembled-curiosity-draft.ts` | **`safeValidateCuriosityExperienceDraft`**, **`validateCuriosityExperienceDraft`** |
| `src/types/content-generation.ts` | **`GeneratedCuriosityExperienceDraftInput`** |
| `src/lib/ai/examples/run-curiosity-draft-assembly-example.ts` | **`npm run ai:assemble-draft`** (fixtures, no API) |

## How pieces map

| Input | CuriosityExperience |
|-------|---------------------|
| `lesson.title` (+ slugify) | `identity` |
| `lesson` | `discoveryCard`, `lesson` (intro+body → `lessonText`) |
| `topicIdea` + `lesson` | `taxonomy` (tags merged) |
| `challenge.primary` | `challenge` (memory_recall → single correct option) |
| `challenge.bonus` | `moderation.notes` (editorial summary) |
| `followups` | `followups` (stable ids `fu-{slug}-{sortOrder}`) |
| `trails` | `trails` + `progressionHooks.nextTrailSlugs` |
| `audio` | `audio.transcript` + `durationSeconds` |
| defaults | `rewards`, `moderation.reviewStatus`, `analytics` |

## Slugging

- **`slugifyCuriositySlug(title)`** — same kebab rules as trail helpers.
- Identity id: **`draft:{slug}`** until a real topic UUID exists.

## Moderation & analytics

- **`reviewStatus`**: default **`draft`** (`draft` \| `reviewed` \| `published` \| `archived`).
- **`safetyFlags`**: array (often empty).
- **`sourceType`**: default **`ai_generated`**.
- **`analytics.version`**, **`generatedAt`**.

Canonical types updated in **`curiosity-experience.ts`**; Zod extended in **`curiosity-experience.ts`** (validations).

## Validation

1. **`curiosityExperienceSchema`** (4.1)
2. Assembled checks: slug shape, lesson length, follow-up/trail counts, required **`moderation.reviewStatus`**, **`analytics.sourceType`**, **`safetyFlags`** array.

## Run the example

```bash
npm run ai:assemble-draft
```

No **`OPENAI_API_KEY`** required. You should see **Octopus** and **Lightning** summaries plus **`Validation failed`** only if something regresses.

## Later DB persistence

Rough mapping: **topics** ← identity + discovery + lesson + taxonomy; **quizzes** + **quiz_options** ← challenge; **topic_followups** ← followups; **topic_trails** ← trails (+ resolve `to_topic_id`); **audio** column ← TTS URL when available.
