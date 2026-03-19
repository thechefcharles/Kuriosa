# Phase 4.9 Summary

## What this prompt implemented

- **Service-role client** — `supabase-service-client.ts` (`SUPABASE_SERVICE_ROLE_KEY`).
- **Mappers** — `map-draft-to-topic-row`, `map-draft-to-followup-rows`, `map-draft-to-quiz-rows`, `map-draft-to-trail-rows`.
- **Persistence** — `persistCuriosityExperienceDraft()` with upsert-by-slug and replace-dependent-rows.
- **Migration** — `memory_recall_hints` on **quizzes**.
- **Types** — `PersistCuriosityExperienceResult`.
- **Fixture** — `octopus-assembled-draft.ts` for demos.
- **Example** — `npm run persist:draft`.
- **Docs** — `CURIOSITY_DRAFT_PERSISTENCE.md`.

## Persistence foundation now exists

- One validated draft → normalized rows for topic, tags, followups, primary quiz, trails (when targets exist).

## What remains in Phase 4

- Admin UI, publish/reject, bulk seed, TTS/audio URLs, preview routes.

## Manual setup before 4.10

1. Apply migration **`20250318120000_add_quiz_memory_recall_hints.sql`**
2. Add **`SUPABASE_SERVICE_ROLE_KEY`** to **`.env.local`**
3. Confirm **categories** exist (seed)
4. Run **`npm run persist:draft`**
