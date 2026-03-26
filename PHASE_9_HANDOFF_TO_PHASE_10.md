# Phase 9 Handoff to Phase 10

---

## What Phase 9 Completed

Phase 9 delivered the **AI Curiosity Engine**:

- Guided AI follow-up questions (4–6 per topic)
- Manual topic-scoped questions with AI answers
- Rabbit-hole suggestions for continuation
- Caching, moderation, rate limiting
- Lightweight analytics (`ai_interaction_events`)
- Full UI integration in the curiosity experience

---

## What the AI Curiosity Engine Can Do Now

1. **Load topic exploration** — Follow-ups and rabbit holes for any topic
2. **Answer questions** — Guided taps, manual input, or rabbit-hole taps
3. **Reuse answers** — Same topic + same question returns cached answer
4. **Enforce limits** — 20 answers per minute per user
5. **Record interactions** — Event types, cache/rate-limit/fallback flags

---

## Stable Assumptions

- **Topic-scoped only** — No cross-topic conversation or memory
- **Single question → single answer** — No threaded chat
- **Auth required for answers** — Guided cards visible when signed out; answers require sign-in
- **In-memory rate limit** — Resets on restart
- **Service role for writes** — `ai_questions`, `ai_answers`, `ai_cache`, `ai_interaction_events`
- **Fail-closed moderation** — Unsafe content returns fallback, never raw output

---

## What Should Not Be Casually Changed Before Phase 10

- Cache key patterns (`ai-cache-keys.ts`) — Changing them invalidates existing cache
- `ai_interaction_events` schema — Analytics consumers may depend on it
- Moderation flow — Safety relies on current fail-closed behavior
- Rate limit placement — It runs before cache to avoid bypass via cache hits

---

## What Future Phases Can Rely On

- `loadTopicAIContext` as the shared topic context loader
- `answerManualQuestion` as the central answer flow (guided, manual, rabbit-hole)
- `getOrSetAICache` for all AI response caching
- `recordAIInteraction` for analytics (fire-and-forget, non-blocking)
- `ManualQuestionResult` type for API responses
