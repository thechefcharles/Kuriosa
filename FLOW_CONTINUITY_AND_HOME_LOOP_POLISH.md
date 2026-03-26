# Flow Continuity and Home Loop Polish

## Overview

This document describes the product polish pass that tightens the Kuriosa core flow: Home → Curiosity → Challenge → What's next → Return. The goal is a more continuous, guided, path-like experience without adding new features.

---

## 1. Challenge Continuity Improvements

### Framing copy

- **Curiosity page (next-step callout):**
  - Eyebrow: "Next step" (was "Next")
  - Title: "Lock it in" (was "Ready for the challenge?")
  - Supporting: "One quick question before what's next."

- **Challenge page:**
  - Step framing: "Step 2 of 3" for main challenge, "Step 3" for bonus
  - Subcopy: "One question — then we'll show you what's next." (was "One question — see how much stuck.")

### Return language

- Challenge feedback: "Takes you back to your next paths." (was "Saves your visit and scrolls to what's next.")
- Completion celebration remains dismissible with "Got it" — user stays on page at What's next section.

### What was not changed

- No route changes
- No modal challenge
- Challenge remains a separate page (`/challenge/[slug]`)

---

## 2. What's Next Gating

### Pre-challenge state

Before the user completes the challenge for a topic:

- The What's next section shows a **compact teaser card** only
- Copy: "What's next?" / "Finish the quick challenge to unlock what's next."
- No trails, no Browse more, no AI block — reduces choices too early

### Post-challenge state

After completion (from DB or just-consumed celebration):

- Full What's next experience is revealed
- Celebration card (if just completed)
- Share card
- Post-challenge exploration: primary trail, secondary, Go deeper collapsible

### How completion is determined

- **Persisted:** `useCompletedTopicIds()` checks `user_topic_history` (rewards_granted)
- **Session:** When user lands from completion redirect, `CompletionCelebrationHost` consumes stashed payload and calls `onConsumed()` — parent sets `hasJustCompleted` so we show full What's next immediately even before DB refetch
- Completion mutation invalidates `progressQueryKeys.completedTopicIds` and `curiosityQueryKeys.daily` so data stays fresh

---

## 3. Primary / Secondary / Tertiary Hierarchy

### Post-challenge structure

| Tier | Content |
|------|---------|
| **Primary** | Next curiosity (first trail card) |
| **Secondary** | Second trail or "Browse more" |
| **Tertiary** | "Go deeper" collapsible — followups, AI block, extra trails |

### Layout changes

- Bonus offer is clearly secondary: compact box, "Try bonus" as outline button, divider, then dominant "See what's next"
- Primary trail labeled "Next curiosity"
- Secondary actions use lighter styling

---

## 4. Bonus Question Hierarchy

### Before

- "Try bonus" and "See what's next" felt like competing CTAs

### After

- Main success feedback: "Nice — you've got it."
- Optional bonus: "Want a quick bonus?" + [Try bonus] in a lighter box
- Divider
- Primary: [See what's next] — visually dominant, full-width area

---

## 5. Completion Feedback Improvements

### "Meaning" line

- `getCompletionMattersLine()` already returns one contextual line (level up, streak, first-try, etc.)
- Added fallback: "You explored something new today." when `wasCountedAsNewCompletion` but no other strong signal
- Shown in completion celebration card; complements XP breakdown, does not replace it

---

## 6. Home Loop

### Purpose

Home answers three questions:

1. What should I do now?
2. What did I already do today?
3. Why come back?

### States and copy

| State | Eyebrow | Title |
|-------|---------|-------|
| No completions today | Today's curiosity | Start with today's pick. |
| 1 completion (not daily) | Today's curiosity | 1 curiosity explored today |
| 1 completion (daily done) | Today's curiosity | Ready for another? |
| 2+ completions | Today's curiosity | You're on a roll |

### Secondary strip

- Before any completion: "Prefer a surprise?"
- After 1+ completions: "Try a surprise"

### Data sources

- **Session:** `getSessionCompletionCount()` — counts completions this session (today, sessionStorage)
- **Persisted:** `daily.data.isCompleted` from `getDailyCuriosity` — whether today's featured topic is done

### Assumptions

- Session completion count is session-based only (resets on new day; no server persistence of "completions today")
- `isCompleted` for daily comes from `user_topic_history` (persisted)
- Home remains one dominant action: the daily card (or its "Review" state)

---

## 7. Assumptions: Session vs Persisted

| Signal | Source | Persisted? |
|--------|--------|------------|
| Session completion count | `session-completion-tracker` (sessionStorage) | No — resets on new calendar day |
| Daily is completed | `user_topic_history` via `getDailyCuriosity` | Yes |
| Topic completed (What's next gating) | `user_topic_history` via `getCompletedTopicIds` | Yes |
| Just-completed (celebration) | `completion-celebration-storage` (sessionStorage, ~15 min TTL) | No — consumed once |

---

## 8. Files Modified

- `src/components/curiosity/next-step-callout.tsx` — CTA copy
- `src/components/challenge/challenge-screen.tsx` — step framing
- `src/components/challenge/challenge-feedback.tsx` — return copy, bonus layout
- `src/components/challenge/challenge-bonus-offer.tsx` — hierarchy
- `src/components/curiosity/post-challenge-exploration.tsx` — gating, teaser
- `src/components/curiosity/curiosity-experience-screen.tsx` — `hasCompletedChallenge` logic
- `src/components/curiosity/completion-celebration-host.tsx` — `onConsumed` callback
- `src/components/home/home-screen.tsx` — home loop states
- `src/lib/progress/completion-matters-line.ts` — fallback meaning line
- `src/lib/query/query-keys.ts` — `completedTopicIds`
- `src/lib/query/invalidate-progress-queries.ts` — invalidate completed + daily
- `src/hooks/queries/useCompletedTopicIds.ts` — new hook
