# Phase P1.5 — Flow Tightening and Home Loop Summary

## Overview

Product polish pass focused on the Kuriosa core journey: Home → Curiosity → Challenge → What's next → Return. No new features; structural, copy, and state-presentation improvements only.

---

## 1. Summary of Changes

### Challenge flow continuity

- Curiosity CTA: "Lock it in" / "One quick question before what's next."
- Challenge step framing: "Step 2 of 3" (main), "Step 3" (bonus)
- Return copy: "Takes you back to your next paths."

### Bonus question hierarchy

- Bonus clearly optional: compact box, divider, then primary "See what's next"
- Reduced CTA competition

### What's next gating

- Pre-challenge: teaser only — "Finish the quick challenge to unlock what's next."
- Post-challenge: full exploration (trails, Browse, Go deeper)
- Uses `useCompletedTopicIds` + celebration `onConsumed` for completion signal

### Completion meaning

- Added fallback line: "You explored something new today." when no stronger signal
- Existing dynamic lines preserved (level up, streak, first-try, etc.)

### Home loop

- Dynamic header based on session completions + daily completion
- States: Start / 1 curiosity today / Ready for another? / You're on a roll
- Secondary strip: "Prefer a surprise?" vs "Try a surprise" based on completions

---

## 2. Challenge Continuity Improvements

| Location | Before | After |
|----------|--------|-------|
| Next-step eyebrow | Next | Next step |
| Next-step title | Ready for the challenge? | Lock it in |
| Next-step supporting | One quick question to lock in... | One quick question before what's next. |
| Challenge header | Quick challenge | Step 2 of 3 · {title} |
| Challenge subcopy | One question — see how much stuck. | One question — then we'll show you what's next. |
| Feedback hint | Saves your visit and scrolls... | Takes you back to your next paths. |

---

## 3. What's Next Gating / Hierarchy

- **Gating:** Full exploration only after challenge completion
- **Teaser:** Compact card, "Finish the quick challenge to unlock what's next."
- **Hierarchy:** Primary = next trail, Secondary = Browse more / second trail, Tertiary = Go deeper (collapsed)

---

## 4. Completion Feedback Improvements

- Fallback meaning line: "You explored something new today."
- XP breakdown and existing dynamic lines unchanged

---

## 5. Home Loop Improvements

| Session completions | Daily done? | Header title |
|--------------------|-------------|--------------|
| 0 | — | Start with today's pick. |
| 1 | No | 1 curiosity explored today |
| 1 | Yes | Ready for another? |
| 2+ | — | You're on a roll |

- Secondary strip: "Try a surprise" when 1+ completions
- Session-based count; daily completion from DB

---

## 6. Copy / UX Decisions

- Fewer words, more momentum
- "Path" language over "screen" language
- Avoid school/test tone
- Light, calm, curious, rewarding

---

## 7. Files Created or Modified

**Created**

- `src/hooks/queries/useCompletedTopicIds.ts`
- `FLOW_CONTINUITY_AND_HOME_LOOP_POLISH.md`
- `PHASE_P1_5_FLOW_AND_HOME_SUMMARY.md`

**Modified**

- `src/components/curiosity/next-step-callout.tsx`
- `src/components/challenge/challenge-screen.tsx`
- `src/components/challenge/challenge-feedback.tsx`
- `src/components/challenge/challenge-bonus-offer.tsx`
- `src/components/curiosity/post-challenge-exploration.tsx`
- `src/components/curiosity/curiosity-experience-screen.tsx`
- `src/components/curiosity/completion-celebration-host.tsx`
- `src/components/home/home-screen.tsx`
- `src/lib/progress/completion-matters-line.ts`
- `src/lib/query/query-keys.ts`
- `src/lib/query/invalidate-progress-queries.ts`

---

## 8. Manual Steps

None. All changes are code-only; no migrations, env vars, or manual setup.

---

## 9. Verify Locally

1. **Challenge continuity:** Open curiosity page → check "Lock it in" CTA → go to challenge → check "Step 2 of 3" → complete → verify return copy
2. **Bonus hierarchy:** On a topic with bonus, get main correct → verify bonus is secondary, "See what's next" primary
3. **What's next gating:** Before challenge, scroll to What's next → see teaser only. Complete challenge → see full exploration
4. **Home loop:** Complete 0, 1, 2+ curiosities → return to Home → verify header copy changes
5. **Completion meaning:** Complete a curiosity → check celebration for dynamic line or "You explored something new today."

---

## 10. Notes / Risks

- Session completion count resets on new calendar day (sessionStorage). Users who complete late at night and return next day will see "Start with today's pick." — acceptable.
- `useCompletedTopicIds` adds one query on curiosity page; enabled only when user is signed in.
- No new backend systems; uses existing `user_topic_history` and session utilities.

---

## 11. Suggested Commit Message

```
feat(flow): tighten curiosity→challenge→what's next flow and add home loop

- Challenge CTA: Lock it in, step framing (2 of 3)
- Bonus hierarchy: optional bonus, primary See what's next
- What's next gating: teaser before challenge, full after
- useCompletedTopicIds hook + celebration onConsumed
- Home loop: dynamic header (Start/Ready for another?/On a roll)
- Completion fallback line: You explored something new today.
```
