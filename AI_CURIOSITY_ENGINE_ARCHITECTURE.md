# AI Curiosity Engine Architecture

Phase 9 introduces an AI-powered curiosity engine for guided exploration and user-driven questions. This document describes the foundation layer (9.1).

---

## Overview

The AI engine supports:

- **Follow-up question generation** — Suggested questions a learner might ask after a topic
- **Manual question answering** — Answers to user-typed questions about a topic
- **Rabbit-hole suggestions** — Related curiosity topics to explore next
- **Caching** — Reduces cost and latency for repeated requests
- **Moderation** — Safety checks on AI output
- **Rate limiting** — Basic per-user throttling

---

## Database Tables

| Table | Purpose |
|-------|---------|
| `ai_questions` | User or system-generated questions tied to a topic. `source`: `followup` \| `manual`. `user_id` nullable for system. |
| `ai_answers` | AI-generated answers. Links to `ai_questions`. Stores `model`, `tokens_used`. |
| `ai_followups` | Cached AI-generated follow-up questions per topic. `questions` is JSONB array of strings. |
| `ai_cache` | Generic key-value cache for any AI response. `cache_key` unique, `response` JSONB. |

All tables have RLS enabled; authenticated users can SELECT. Writes use service role (bypasses RLS).

---

## Prompt Architecture

Prompts live in `src/lib/ai/prompts/`:

- **followup-prompt.ts** — `buildFollowupPrompt(input)` → 4–6 short questions, JSON array
- **answer-prompt.ts** — `buildAnswerPrompt(input)` → 150–250 words, structured text
- **rabbit-hole-prompt.ts** — `buildRabbitHolePrompt(input)` → 3–5 suggestions, JSON array

Each prompt enforces:

- Curiosity-driven, educational, concise tone
- No fluff, disclaimers, or unsafe content
- Strict output format (JSON arrays or plain text)

---

## Request Pipeline

```
Input → Rate limit check → Cache lookup (if cacheable)
  → Prompt builder → AI client (OpenAI) → Parser
  → Moderation → Store in cache (if cacheable) → Return
```

1. **Rate limit** — Per-user, in-memory. 20 req/min default. Skip for system calls.
2. **Cache** — Followups and rabbit holes use `ai_cache`. Answers are not cached (per-question).
3. **Prompt** — Centralized builders produce strings only. No API calls.
4. **AI client** — `runAICompletion()` in `ai-client.ts`. Single entry point for OpenAI. Model: gpt-4o-mini. 30s timeout.
5. **Parser** — `parseStringArray()` for JSON arrays, `parseText()` for answers.
6. **Moderation** — OpenAI Moderation API. If unsafe, caller gets error.

---

## Moderation Strategy

- All AI text is checked via `moderateAIResponse()` before returning.
- Uses OpenAI Moderation endpoint.
- On API failure, returns `isSafe: false` (fail closed).
- Caller should show a generic fallback message when moderation fails.

---

## Rate Limiting Strategy

- In-memory, per-user. Resets on server restart.
- 20 requests per minute per user (configurable).
- `checkAIRateLimit(userId)` returns `{ allowed: boolean }`.
- Manual answers always require userId. Followups/rabbit holes can be system-initiated (no userId → skip limit).

---

## Why Caching Matters

- **Cost** — Fewer OpenAI calls for repeated or similar requests.
- **Latency** — Cached responses return instantly.
- **Stability** — Same input → same output (for followups, rabbit holes).

Answers are not cached; each question is unique. Followups and rabbit holes are keyed by topic (and optional question) and cached in `ai_cache`.

---

## What 9.2 Will Add

- API routes for followups, answers, rabbit holes
- Persistence of questions/answers to `ai_questions` / `ai_answers`
- UI integration (Ask a question, suggested follow-ups, rabbit-hole links)
- Hooks and React Query wiring

---

## Test

```bash
npm run ai:curiosity-followups
```

Runs `generateFollowups()` for a sample topic. Requires migration and env vars.

## Key Files

| Area | Files |
|------|-------|
| Types | `src/types/ai.ts` |
| Prompts | `src/lib/ai/prompts/followup-prompt.ts`, `answer-prompt.ts`, `rabbit-hole-prompt.ts` |
| AI client | `src/lib/ai/ai-client.ts` |
| Parser | `src/lib/ai/parse-ai-response.ts` |
| Services | `src/lib/services/ai/` — `generate-followups.ts`, `generate-answer.ts`, `generate-rabbit-holes.ts`, `get-or-set-ai-cache.ts`, `moderate-ai-response.ts`, `ai-rate-limit.ts` |
