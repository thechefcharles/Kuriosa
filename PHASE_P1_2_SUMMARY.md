# Phase P1.2 — Core Loop Upgrade Summary

## Overview

Upgrade to the core curiosity experience loop: optional bonus question, retry on wrong answers, improved feedback, and stronger completion moment.

---

## 1. Summary of Changes

### Core Loop Enhancements

- **Optional second (bonus) question:** Topics can have up to two quizzes; the second is optional and grants +10 XP when correct.
- **Retry after wrong answer:** Users can retry the same question without penalty; XP is granted when they eventually get it right.
- **Improved wrong-answer feedback:** Shows a “From the lesson” snippet to reinforce learning.
- **Stronger completion moment:** Updated copy (“Nice — you've got it.”, “That's one more curiosity unlocked.”).

### Data & Types

- `LoadedCuriosityExperience.bonusChallenge` — optional second quiz.
- `CompletionEventInput.bonusCorrect` — whether the bonus question was correct.
- `RewardBreakdown.bonusQuestionXp` — bonus XP in breakdown.

### UI Components

- **ChallengeBonusOffer:** “Want a quick bonus question?” with Try bonus | Continue.
- **ChallengeFeedback:** Lesson snippet on wrong answers; Try again primary; optional bonus/continue slot.
- **ChallengeScreen:** Multi-question flow (Q1 → feedback → optional bonus offer → Q2 → feedback → Continue).

---

## 2. Files Created or Modified

### Created

- `src/components/challenge/challenge-bonus-offer.tsx` — bonus question offer UI.
- `CORE_LOOP_UPGRADE_ARCHITECTURE.md` — architecture documentation.
- `PHASE_P1_2_SUMMARY.md` — this file.

### Modified

- `src/types/curiosity-experience.ts` — `bonusChallenge` on `LoadedCuriosityExperience`.
- `src/types/progress.ts` — `bonusCorrect` on completion payloads; `bonusQuestionXp` in `RewardBreakdown`.
- `src/lib/services/content/load-curiosity-experience.ts` — load up to two quizzes, map to `challenge` and `bonusChallenge`.
- `src/lib/progress/xp-config.ts` — `BONUS_QUESTION_XP: 10`.
- `src/lib/progress/calculate-rewards.ts` — add `bonusQuestionXp` when `bonusCorrect`.
- `src/app/api/progress/complete-curiosity/route.ts` — accept `bonusCorrect`.
- `src/lib/services/progress/process-curiosity-completion.ts` — forward `bonusCorrect`.
- `src/components/challenge/challenge-feedback.tsx` — lesson snippet, Try again primary, bonus/continue slot, stronger copy.
- `src/components/challenge/challenge-continue-exploring-button.tsx` — pass `bonusCorrect` to completion.
- `src/components/challenge/challenge-screen.tsx` — multi-question flow with bonus offer and Q2.

---

## 3. System Design Decisions

- **Bonus is optional:** Users can skip; completion is not blocked.
- **Retry is unpenalized:** Same XP whether correct on first try or after retry.
- **Lesson snippet:** First ~180 chars of lesson text; reinforces wrong-answer feedback.
- **No DB migration:** Uses existing `quizzes` and `sort_order`; second quiz → bonus.

---

## 4. Manual Steps for Developer

1. **Add bonus question to a topic:** Insert a second row in `quizzes` with `sort_order = 1` for the topic.
2. **Verify locally:** Complete a topic with one quiz (unchanged). Complete a topic with two quizzes (bonus offer, Q2, bonus XP).
3. **Environment:** No new env vars.

---

## 5. Verify Locally

1. **Single-question topic:** Complete Q1 → feedback → Continue. No bonus offer.
2. **Two-question topic:** Complete Q1 → “Want a quick bonus question?” → Try bonus → Q2 → feedback → Continue.
3. **Wrong answer:** See explanation, lesson snippet, Try again. Retry → correct → Continue.
4. **XP:** Bonus question correct → +10 in breakdown; skip bonus → no bonus XP.

---

## 6. Notes / Risks

- **Empty bonus quiz:** Loader adds fallback option if needed; recall-type bonus supported.
- **Future analytics:** `neededRetry` not yet persisted; can be added to `user_topic_history` later.

---

## 7. Suggested Git Commit Message

```
feat: core loop upgrade — bonus question, retry, better feedback

- Optional second (bonus) question with +10 XP
- Retry after wrong answer (no penalty)
- "From the lesson" snippet on wrong answers
- Stronger completion copy
- Multi-question flow in challenge screen
- Backward compatible; no DB migration
```
