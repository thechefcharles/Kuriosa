# Phase 9 — AI Curiosity Engine Inventory

A practical reference for what was built in Phase 9 and how it works.

---

## AI Schema

| Table | Purpose |
|-------|---------|
| `ai_questions` | User or system questions tied to a topic. `source`: `followup` \| `manual`. |
| `ai_answers` | AI-generated answers. Links to `ai_questions`. Stores `model`, `tokens_used`. |
| `ai_followups` | One row per topic with JSONB `questions`. Canonical store for follow-up questions. |
| `ai_cache` | Generic key-value cache. `cache_key` unique, `response` JSONB. |
| `ai_interaction_events` | Lightweight analytics for AI interactions (Phase 9.5). |

**Migrations:** `20260325120000_phase91_ai_engine.sql`, `20260325120001_phase92_ai_followups_unique.sql`, `20260326120000_phase95_ai_interaction_events.sql`

---

## Prompts

| Prompt | File | Use |
|--------|------|-----|
| Follow-up questions | `answer-prompt.ts` (followup) | 4–6 short curiosity questions per topic |
| Answer | `answer-prompt.ts` | 150–250 words, topic-scoped |
| Rabbit holes | `rabbit-hole-prompts.ts` | 3–5 suggested next directions |

All prompts are topic-scoped. No generic chatbot tone.

---

## Request Pipeline

1. **Topic context** — `loadTopicAIContext` loads id, title, category, lesson excerpt, tags
2. **Normalization** — For manual questions: trim, collapse spaces, 3–500 chars
3. **Rate limit** — Per-user, in-memory, 20 req/min for answer requests
4. **Cache check** — `getOrSetAICache` with stable keys
5. **Generation** — OpenAI completion → parse → moderate
6. **Persistence** — `ai_questions`, `ai_answers` on cache miss
7. **Analytics** — `recordAIInteraction` fire-and-forget

---

## Caching

| What | Where | Key pattern |
|------|-------|-------------|
| Follow-up questions | `ai_followups` | One row per topic |
| Rabbit holes | `ai_cache` | `rabbitholes:topic:{topicId}` or `...:question:{hash}` |
| Manual/guided answers | `ai_cache` | `manualanswer:topic:{topicId}:question:{hash}` |

- Keys are deterministic. Same topic + same normalized question → same cache entry.
- No cross-topic reuse.
- `fromCache` is returned to the UI for transparency.

---

## Moderation

- **Service:** `moderateAIResponse` via OpenAI Moderation API
- **Behavior:** Fail-closed. API error → `isSafe: false`
- **Fallback:** `ai-fallback-responses.ts` provides safe copy for moderation failure

---

## Rate Limiting

- **Service:** `checkAIRateLimit(userId)`
- **Limit:** 20 requests per minute per user
- **Storage:** In-memory; resets on server restart
- **Scope:** Answer requests only (guided + manual + rabbit-hole)
- **Signed-out:** No answer requests, so no rate limit applies

---

## Guided Follow-Ups

- **Flow:** `getTopicFollowups` → check `ai_followups` → on miss, generate and persist
- **UI:** Cards with labels like "Ask AI next"; tap to load answer via manual-question API
- **Analytics:** `interactionType: guided_followup`

---

## Manual Question System

- **Flow:** Normalize → load context → rate limit → cache → generate → moderate → persist
- **API:** `POST /api/ai/manual-question` (auth required)
- **Analytics:** `interactionType: manual` or `rabbit_hole`

---

## Rabbit-Hole Exploration

- **Flow:** `getTopicRabbitHoles` → check `ai_cache` → on miss, generate and store
- **UI:** Tap suggestion → sends title as question to manual-question API
- **Analytics:** `interactionType: rabbit_hole`

---

## UI Integration

- **Location:** Post-challenge exploration (`#whats-next`)
- **Components:** `AIExplorationBlock`, `AIFollowupSection`, `ManualQuestionBox`, `AIAnswerCard`, `RabbitHoleSection`
- **Hooks:** `useGuidedTopicExploration`, `useAskManualQuestion`

---

## Analytics Signals

`ai_interaction_events` records:

- `event_type`: `guided_followup` | `manual` | `rabbit_hole`
- `from_cache`, `rate_limited`, `fallback_used`
- `question_id`, `answer_id` when persisted

Recording is non-blocking; failures do not affect UX.

---

## Edge-Case Protections

- Stale answer prevention: Ref-based check in guided follow-up `onSuccess`
- Topic change: Clear manual answer when `slug`/`topicId` changes
- Empty AI sections: Manual question box always shown; block only hides on load/error
- Fallback copy: Calm, curiosity-friendly messages for moderation, rate limit, timeout, generation failure
