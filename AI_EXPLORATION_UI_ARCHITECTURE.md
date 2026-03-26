# AI Exploration UI Architecture

Phase 9.4 implements the **user-facing AI curiosity experience** on the curiosity page. Users can explore topics through guided AI follow-ups, ask their own questions, view answers, and continue via rabbit-hole suggestions. This is topic-focused—not a generic chatbot.

---

## Overview

Given a curiosity topic, users can:

1. See guided AI follow-up questions (4–6 cards)
2. Tap a guided question to view an AI-generated answer
3. Ask their own manual curiosity question
4. Receive a concise AI answer
5. Continue through rabbit-hole suggestions
6. Do all of this inside the post-challenge exploration area (`#whats-next`)

---

## How Guided AI Follow-Ups Are Shown

- **Source:** `useGuidedTopicExploration` fetches from `/api/ai/topic-exploration?slug=…`
- **Display:** `AIFollowupSection` renders `AIFollowupCard` components
- **Labels:** Lightweight labels such as "Ask AI next", "Go deeper", "Curious about…"
- **Interaction:** Tapping a card expands it and triggers an answer request via `useAskManualQuestion`
- **Auth:** Signed-out users see "Sign in to ask questions and get AI answers" when expanding a card

---

## How Manual Question Input Works

- **Component:** `ManualQuestionBox`
- **Placeholder:** "Ask something about [topic]…" or "Sign in to ask questions about this topic" when signed out
- **Constraints:** 3–500 characters, character counter visible
- **Submit:** "Ask" button; when signed out, "Sign in to ask" redirects to sign-in with `?redirect=…`
- **Loading:** "Asking…" with spinner during request

---

## How Answer Display Works

- **Guided follow-ups:** Answer appears inline inside the expanded card
- **Manual / rabbit-hole:** Answer appears in a shared area below the input
- **Components:**
  - `AIAnswerCard` — question heading + answer text
  - `AIAnswerLoading` — "Thinking about that…"
  - `AIAnswerError` — friendly error + "Try again" (disabled when rate-limited)

---

## How Rabbit-Hole Continuation Works

- **Source:** Same `useGuidedTopicExploration` data; `rabbitHoles` array
- **Display:** `RabbitHoleSection` with `RabbitHoleCard` components
- **Interaction:** Tapping a card sends its `title` as the question text to the manual-question API
- **Result:** Answer shows in the shared answer area; rabbit-hole suggestions stay visible
- **Flow:** Topic-scoped—all questions stay on the current topic

---

## Where This Fits on the Curiosity Page

- **Location:** `#whats-next` (post-challenge exploration)
- **Order:** Static follow-ups → AI "Go deeper with AI" section → topic trails
- **Dry state:** When no static follow-ups or trails exist, the AI section still appears first
- **Layout:** Preserves existing exploration structure; adds AI block between follow-ups and trails

---

## Signed-In vs Signed-Out Behavior

| Feature | Signed out | Signed in |
|--------|------------|-----------|
| Guided follow-up cards | Shown | Shown |
| Rabbit-hole suggestions | Shown | Shown |
| Expand guided card | "Sign in to ask" message | Answer loads |
| Manual question input | Disabled, "Sign in to ask" button | Enabled |
| Rabbit-hole tap | — | Triggers answer request |

---

## Key Files

| Purpose | File |
|---------|------|
| Topic exploration API | `app/api/ai/topic-exploration/route.ts` |
| Manual question API | `app/api/ai/manual-question/route.ts` (9.3) |
| Guided exploration hook | `hooks/queries/useGuidedTopicExploration.ts` |
| Manual question hook | `hooks/mutations/useAskManualQuestion.ts` |
| AI exploration block | `components/ai/ai-exploration-block.tsx` |
| Follow-up cards | `components/ai/ai-followup-section.tsx`, `ai-followup-card.tsx` |
| Manual input | `components/ai/manual-question-box.tsx` |
| Answer display | `components/ai/ai-answer-card.tsx`, `ai-answer-loading.tsx`, `ai-answer-error.tsx` |
| Rabbit holes | `components/ai/rabbit-hole-section.tsx`, `rabbit-hole-card.tsx` |
| Integration | `components/curiosity/post-challenge-exploration.tsx` |

---

## What 9.5 Will Finalize Next

- Phase 9 analytics and closeout work
- Any polish or edge-case handling
- (Future) Cross-topic conversational memory, if desired
