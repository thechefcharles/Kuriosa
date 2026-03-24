# Guided Curiosity Exploration Architecture

Phase 9.2 implements the **guided topic AI layer**: AI-generated follow-up questions and rabbit-hole suggestions tied to a topic. This system stays topic-focused, not generic chatbot-style.

---

## Overview

Given a topic, the system can:

1. Generate AI follow-up questions (4–6 short questions)
2. Persist them in `ai_followups` and reuse on next request
3. Generate rabbit-hole suggestions (3–5 related curiosity directions)
4. Cache topic-driven outputs in `ai_cache`
5. Expose a single service facade for later UI integration

---

## How Topic Follow-Ups Are Generated

1. **Entry point:** `getTopicFollowups({ slug })` or `getTopicFollowups({ topicId })`
2. **Check storage:** Query `ai_followups` for `topic_id`
3. **If found:** Return stored questions
4. **If not found:**
   - Load topic context via `loadTopicAIContext`
   - Call `generateFollowups` (prompt → OpenAI → parse → moderation)
   - Persist via `saveTopicFollowups` into `ai_followups`
   - Return questions

**Deterministic:** Same topic always returns the same stored set until regenerated. No duplicate rows per topic (UNIQUE on `topic_id`).

---

## How ai_followups Is Used

- **Table:** `ai_followups` (topic_id, questions JSONB)
- **One row per topic** — upsert by `topic_id`
- **Canonical store** — preferred over regenerating
- **Migration:** `20260325120001_phase92_ai_followups_unique.sql` adds UNIQUE(topic_id)

---

## How Rabbit-Hole Suggestions Are Generated/Cached

- **No dedicated table** — uses `ai_cache`
- **Cache keys:**
  - `rabbitholes:topic:{topicId}` — topic-only
  - `rabbitholes:topic:{topicId}:question:{hash}` — when a question triggered the request
- **Entry point:** `getTopicRabbitHoles({ slug }, { questionText? })`
- **Flow:** Check cache → on miss, load context, call `generateRabbitHoles`, store in cache, return

---

## How Topic Context Is Loaded

**Central loader:** `loadTopicAIContext({ topicId } | { slug })`

Returns `TopicAIContext`:
- topicId, slug, title
- categoryName, categorySlug, subcategory
- hookText, lessonExcerpt (trimmed), tags

Used by:
- `getTopicFollowups`
- `getTopicRabbitHoles`
- `getGuidedTopicExploration`
- (future) answer generation

---

## Why Topic-Focused, Not Generic Chatbot

- **Scope:** One topic at a time. No open-ended conversation.
- **Data:** Uses lesson text, hook, category — topic-specific.
- **Outputs:** Follow-up questions and rabbit holes are about *that* topic.
- **Caching:** Keyed by topic (and optional question). Reusable.
- **ai_questions:** Reserved for user-asked questions later — not auto-populated from generated suggestions.

---

## What 9.3 Will Add Next

- API routes for guided exploration
- UI integration (follow-up cards, rabbit-hole links)
- Manual question input and answer display
- Persistence of user-asked questions to `ai_questions`

---

## Key Files

| Service | File |
|---------|------|
| Topic context | `load-topic-ai-context.ts` |
| Follow-ups | `get-topic-followups.ts`, `save-topic-followups.ts` |
| Rabbit holes | `get-topic-rabbit-holes.ts` |
| Facade | `get-guided-topic-exploration.ts` |
| Cache keys | `ai-cache-keys.ts` |
