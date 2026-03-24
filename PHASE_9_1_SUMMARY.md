# Phase 9.1 Summary — AI Curiosity Engine Foundation

## What Was Built

- **Database schema** — `ai_questions`, `ai_answers`, `ai_followups`, `ai_cache` with indexes and RLS
- **TypeScript types** — `AIQuestion`, `AIAnswer`, `AIFollowupSet`, `AICacheEntry`, input types
- **Prompt library** — `buildFollowupPrompt`, `buildAnswerPrompt`, `buildRabbitHolePrompt` (no API calls)
- **AI client** — `runAICompletion()` — centralized OpenAI wrapper with timeout, error handling, model/temperature control
- **Parsers** — `parseStringArray()`, `parseText()` for safe JSON and text extraction
- **Cache helper** — `getOrSetAICache()` — check `ai_cache`, run generator on miss, upsert
- **Moderation** — `moderateAIResponse()` — OpenAI Moderation API, fail-closed
- **Rate limiting** — `checkAIRateLimit()` — per-user, in-memory, 20/min
- **Service scaffolding** — `generateFollowups`, `generateAnswer`, `generateRabbitHoles` — wired to prompts, AI client, parser, cache, moderation, rate limit

## What Is NOT Built Yet

- UI components or hooks
- API routes
- Persistence of questions/answers to `ai_questions` / `ai_answers`
- Full generation flows (e.g. storing answers after generation)
- Redis or persistent rate limiting

## What 9.2 Will Add

- API routes for followups, answers, rabbit holes
- DB persistence for questions and answers
- UI integration
- React Query hooks

## Setup

1. Run migration: `supabase db push`
2. Ensure `OPENAI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`

## Test

```bash
npm run ai:curiosity-followups
```

Generates follow-up questions for "Why is the sky blue?" and caches in `ai_cache`. Requires migration applied first.
