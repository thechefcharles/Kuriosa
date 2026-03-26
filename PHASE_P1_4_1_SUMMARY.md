# Phase P1.4.1 — Reward Feel and Badge Personality Summary

## Overview

Refined the reward system so it feels more satisfying, meaningful, and slightly more dynamic — without becoming noisy or stressful.

---

## 1. Summary of Changes

### XP System
- **Difficulty multiplier:** beginner=1.0, intermediate=1.1, advanced=1.2
- **First-try bonus:** +5 XP when main challenge correct on first try (no retry)
- All breakdown values rounded to integers

### Completion Feedback
- **Dynamic "this mattered" line:** One contextual line per completion (e.g. "Your streak is still growing.", "That first-try answer gave you a small boost.")
- **Close to level:** "One more curiosity could do it." when ≤50 XP to next level
- First-try bonus shown in XP breakdown when earned

### Level / Score Clarity
- **Progress hero:** "You're getting close." when near next level
- **Curiosity score help:** Added directional tips (explore categories, accuracy, streaks)

### Badges
- **3 new personality badges:** Curious Switch, Comeback Trail, Deep Diver
- **Unlock feel:** Stronger header, clearer badge name/description hierarchy

### Leaderboard
- **Window copy:** "Based on XP earned this week/month" or "Based on curiosity score — depth, breadth, and consistency."

---

## 2. XP System Improvements

| Change | Detail |
|--------|--------|
| Difficulty multiplier | ×1.0 / ×1.1 / ×1.2 by topic difficulty |
| First-try bonus | +5 XP, main challenge only, no retry |
| Rounding | All breakdown values rounded; no decimals |

---

## 3. Completion Feedback Improvements

| Element | Change |
|---------|--------|
| Matters line | One dynamic line from `getCompletionMattersLine()` |
| Close to level | Shown when xpToNextLevel ≤ 50 |
| First-try in breakdown | "First-try correct" +5 XP when earned |

---

## 4. Level / Score Clarity Improvements

| Location | Change |
|----------|--------|
| Progress hero | "You're getting close." when nextLevelXP ≤ 50 |
| Curiosity score (?) | Bullets: explore categories, accuracy, streaks |

---

## 5. Badge System Improvements

| Badge | Criteria |
|-------|----------|
| Curious Switch | 3 categories in one day |
| Comeback Trail | 5+ days since last activity |
| Deep Diver | 3 intermediate/advanced in a row |

Badge unlock card: stronger header, clearer name/description.

---

## 6. Leaderboard Clarity Improvements

- Context line per window: XP this week/month or curiosity score for all-time.

---

## 7. Files Created or Modified

### Created
- `src/lib/progress/completion-matters-line.ts`
- `supabase/migrations/20260330120000_personality_badges.sql`
- `REWARD_FEEL_AND_BADGE_PERSONALITY_UPGRADE.md`
- `PHASE_P1_4_1_SUMMARY.md`

### Modified
- `src/lib/progress/xp-config.ts` — multiplier, first-try bonus
- `src/lib/progress/calculate-rewards.ts` — multiplier, first-try, rounding
- `src/types/progress.ts` — firstTryCorrect, difficultyLevel, firstTryBonusXp, xpToNextLevel
- `src/app/api/progress/complete-curiosity/route.ts` — firstTryCorrect
- `src/lib/services/progress/process-curiosity-completion.ts` — topic difficulty, xpToNextLevel, completedAt for badges
- `src/components/challenge/challenge-screen.tsx` — hasRetried, firstTryCorrect
- `src/components/challenge/challenge-feedback.tsx` — firstTryCorrect prop
- `src/components/challenge/challenge-continue-exploring-button.tsx` — firstTryCorrect
- `src/lib/progress/completion-celebration-storage.ts` — firstTryBonusXp, xpToNextLevel
- `src/components/progress/completion-celebration-card.tsx` — matters line, close to level, first-try, badge feel
- `src/components/progress/progress-hero-card.tsx` — curiosity tips, close to level
- `src/lib/progress/badge-rules.ts` — new criteria types
- `src/lib/services/progress/evaluate-badge-eligibility.ts` — new context fields, completedAt
- `src/lib/services/progress/apply-completion-badges.ts` — completedAt param
- `src/components/social/leaderboard-screen.tsx` — window copy

---

## 8. Manual Steps for Developer

1. **Run migration:** `supabase db push` or apply `20260330120000_personality_badges.sql`

---

## 9. Verify Locally

1. **Difficulty multiplier:** Complete an intermediate topic → breakdown shows slightly higher XP
2. **First-try bonus:** Get challenge right first try → "+5 First-try correct" in breakdown
3. **Matters line:** Complete → one contextual line (streak, level, etc.)
4. **Close to level:** When ≤50 XP to next level → "One more curiosity could do it." / "You're getting close."
5. **Curiosity score:** Progress page → click (?) → see new tips
6. **Badges:** Trigger Curious Switch (3 categories in one day), Comeback Trail (return after 5+ days), Deep Diver (3 advanced in a row)
7. **Leaderboard:** Check window copy above list

---

## 10. Notes / Risks

- **Backwards compatibility:** Stashed celebration payloads without `firstTryBonusXp` default to 0.
- **Comeback badge:** Requires `completedAtIso` passed from completion flow; applied only on new completions.
- **Advanced in row:** Uses `completed_at` order; "in a row" = consecutive by completion time.

---

## 11. Suggested Commit Message

```
feat: reward feel and badge personality (P1.4.1)

- XP: difficulty multiplier (1.0/1.1/1.2), first-try +5 bonus
- Completion: dynamic "this mattered" line, close-to-level hint
- Level/score: curiosity tips, "getting close" when near level
- Badges: Curious Switch, Comeback Trail, Deep Diver
- Badge unlock: clearer hierarchy
- Leaderboard: window copy (XP vs curiosity score)
```
