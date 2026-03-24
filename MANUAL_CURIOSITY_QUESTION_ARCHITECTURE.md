# Manual Curiosity Question Architecture

Phase 9.3 implements the **manual curiosity question backend**: users can ask their own question about a topic and receive a concise, topic-scoped AI answer. This is backend/service/API only — no UI yet.

---

## Overview

Given a user question tied to a topic, the system:

1. Validates and normalizes the question
2. Rate-limits the request
3. Loads topic context
4. Generates a structured AI answer (or reuses a cached one)
5. Moderates the answer
6. Persists question + answer to `ai_questions` and `ai_answers`
7. Returns a typed result for later UI integration

---

## How Manual Questions Are Normalized

- **Entry point:** `normalizeManualQuestion(questionText)` in `normalize-manual-question.ts`
- **Actions:**
  - Trim whitespace
  - Collapse repeated spaces
  - Enforce character limits (3–500 chars)
  - Reject empty or meaningless input
- **Returns:** `{ ok: true, normalized }` or `{ ok: false, error }`
- **Simple and predictable** — no complex NLP

---

## How Answers Are Generated

1. **Entry point:** `answerManualQuestion(input)` in `answer-manual-question.ts`
2. **Input:** `ManualQuestionInput` — `userId`, `topicId` or `slug`, `questionText`
3. **Flow:**
   - Normalize question
   - Load topic context via `loadTopicAIContext`
   - Enforce rate limit
   - Build cache key: `manualanswer:topic:{topicId}:question:{hash}`
   - Check `ai_cache`
   - If cached → return cached answer (no generation, no persist)
   - If not cached:
     - Generate via `generateAnswer` (topic-scoped prompt)
     - Persist to `ai_questions` and `ai_answers`
     - Store in `ai_cache`
     - Return result

---

## How Answer Caching Works

- **Key:** `manualanswer:topic:{topicId}:question:{hash}`
- **Hash:** Based on normalized question text
- **Scope:** Same topic + same normalized question → same cached answer
- **Different topics never share answers**
- **Storage:** `ai_cache` (cache_key, response JSONB)

---

## How Moderation and Fallback Work

- **Moderation:** Applied inside `generateAnswer` before returning
- **Fallbacks:** `ai-fallback-responses.ts` defines safe messages for:
  - Moderation failure
  - Generation failure
  - Rate limit exceeded
  - Timeout
- **Tone:** Curious, calm, helpful — not robotic
- **Never:** Return unsafe content; always fall back to a friendly message

---

## How Rate Limiting Is Enforced

- **Service:** `checkAIRateLimit(userId)` in `ai-rate-limit.ts`
- **Applied:** Before cache check (so we don’t bypass limits via cached answers)
- **Scope:** Per-user, in-memory
- **Defaults:** 20 requests per minute per user
- **On limit exceeded:** Return structured result with `rateLimited: true` and a friendly message

---

## How ai_questions and ai_answers Are Stored

- **ai_questions:** One row per manual question
  - `user_id`, `topic_id`, `question_text`, `source = 'manual'`
  - Persisted only on successful generation (not on cache hit)
- **ai_answers:** One row per answer
  - `question_id`, `answer_text`, `model`, `tokens_used`
  - Linked to `ai_questions`

---

## API Route

- **Path:** `POST /api/ai/manual-question`
- **Auth:** Required (Supabase session)
- **Body:** `{ questionText, topicId? }` or `{ questionText, slug? }`
- **Returns:** `ManualQuestionResult` JSON

---

## What 9.4 Will Add Next

- Manual question input UI on the curiosity page
- Answer card display
- (Future) Rabbit-hole conversational flow UI

---

## Key Files

| Purpose | File |
|---------|------|
| Main service | `answer-manual-question.ts` |
| Normalization | `normalize-manual-question.ts` |
| Answer generation | `generate-answer.ts` |
| Cache keys | `ai-cache-keys.ts` |
| Persistence | `save-ai-question.ts`, `save-ai-answer.ts` |
| Fallbacks | `ai-fallback-responses.ts` |
| Rate limit | `ai-rate-limit.ts` |
| API route | `app/api/ai/manual-question/route.ts` |
