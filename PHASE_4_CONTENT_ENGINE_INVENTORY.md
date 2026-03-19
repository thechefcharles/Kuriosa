# Phase 4 — Content Engine Inventory

This document summarizes what Phase 4 built and what Phase 5 UI can rely on.

## Canonical content model

- **Type**: `src/types/curiosity-experience.ts`
- **Validation**: `src/lib/validations/curiosity-experience.ts`
- Sections: identity, discoveryCard, taxonomy, lesson, audio, challenge, rewards, followups, trails, progressionHooks, moderation, analytics.

## AI generation layers (prompts → generators → parsers → Zod)

### Topic ideas (4.2)
- Prompts: `src/lib/ai/prompts/topic-idea-prompts.ts`
- Generator: `src/lib/ai/generators/generate-topic-ideas.ts`
- Parser: `src/lib/ai/parsers/topic-idea-parser.ts`
- Validation: `src/lib/validations/topic-idea.ts`
- Example: `npm run ai:topic-ideas`

### Lessons (4.3)
- Prompts: `src/lib/ai/prompts/lesson-prompts.ts`
- Generator: `src/lib/ai/generators/generate-lesson.ts`
- Parser: `src/lib/ai/parsers/lesson-parser.ts`
- Validation: `src/lib/validations/generated-lesson.ts`
- Example: `npm run ai:lesson`

### Challenges (4.4)
- Prompts: `src/lib/ai/prompts/challenge-prompts.ts`
- Generator: `src/lib/ai/generators/generate-challenge.ts`
- Parser: `src/lib/ai/parsers/challenge-parser.ts`
- Validation: `src/lib/validations/generated-challenge.ts`
- Example: `npm run ai:challenge`

### Follow-ups (4.5)
- Prompts: `src/lib/ai/prompts/followup-prompts.ts`
- Generator: `src/lib/ai/generators/generate-followups.ts`
- Parser: `src/lib/ai/parsers/followup-parser.ts`
- Validation: `src/lib/validations/generated-followups.ts`
- Example: `npm run ai:followups`

### Trails (4.6)
- Prompts: `src/lib/ai/prompts/trail-prompts.ts`
- Generator: `src/lib/ai/generators/generate-trails.ts`
- Parser: `src/lib/ai/parsers/trail-parser.ts`
- Validation: `src/lib/validations/generated-trails.ts`
- Slug helpers: `src/lib/services/content/normalize-trail-candidate.ts`
- Example: `npm run ai:trails`

### Audio scripts (4.7)
- Prompts: `src/lib/ai/prompts/audio-prompts.ts`
- Generator: `src/lib/ai/generators/generate-audio-script.ts`
- Parser: `src/lib/ai/parsers/audio-parser.ts`
- Validation: `src/lib/validations/generated-audio.ts`
- TTS prep helper: `src/lib/services/content/prepare-audio-for-tts.ts`
- Example: `npm run ai:audio`

## Draft assembly (4.8)

- Builder: `src/lib/services/content/build-curiosity-experience-draft.ts`
- Identity + slug: `src/lib/services/content/ensure-curiosity-identity.ts`, `src/lib/services/content/slugify-curiosity.ts`
- Draft validation: `src/lib/validations/assembled-curiosity-draft.ts`
- Example (no API): `npm run ai:assemble-draft`

## Persistence to Supabase (4.9)

- Service role client: `src/lib/supabase/supabase-service-client.ts`
- Persist service: `src/lib/services/content/persist-curiosity-experience-draft.ts`
- Mapping helpers: `src/lib/services/content/map-draft-to-*.ts`
- Migration: `supabase/migrations/20250318120000_add_quiz_memory_recall_hints.sql`
- Example: `npm run persist:draft`

## Internal preview + workflow (4.10)

- Preview loader: `src/lib/services/content/load-curiosity-preview.ts`
- Internal page: `/internal/content-preview/[slug]`
- Workflow actions: `src/lib/services/internal/curiosity-workflow.ts`
- Safeguards: `src/lib/services/internal/internal-content-workflow-guard.ts`
- Env: `INTERNAL_CONTENT_WORKFLOW_ALLOWLIST_EMAILS`

## Phase 4 seeding (4.11)

- Seed topics: `src/lib/content/seeds/phase-4-seed-topics.ts`
- Runner: `src/lib/content/seeds/run-phase-4-seed.ts` (`npm run seed:phase4`)
- Verification: `src/lib/content/seeds/run-phase-4-seed-verification.ts` (`npm run seed:verify`)
- Seed plan: `PHASE_4_SEED_PLAN.md`

