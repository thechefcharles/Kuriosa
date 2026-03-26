# Reward Feel and Badge Personality Upgrade

Phase P1.4.1 — Refinements to XP, progression clarity, completion feedback, badges, and leaderboard copy.

---

## 1. Difficulty-based XP Multiplier

**Location:** `src/lib/progress/calculate-rewards.ts`, `xp-config.ts`

**Behavior:**
- beginner / easy: ×1.0
- intermediate: ×1.1
- advanced / expert: ×1.2

**Application:**
- Multiplier applies to base XP sources (lesson, challenge, perfect bonus, bonus question, daily, random, listen).
- Each component is rounded to a whole number before summing.
- First-try bonus (+5 XP) is flat, not multiplied.

**Example:** Intermediate topic, lesson + challenge + perfect = 10+20+10 = 40 base → 40×1.1 = 44 XP (rounded per component).

---

## 2. First-try Correctness Bonus

**Location:** `xp-config.ts` (`FIRST_TRY_CORRECT_BONUS_XP: 5`), `calculate-rewards.ts`, challenge flow

**Rules:**
- +5 XP when the main challenge is answered correctly on the **first** submit (no retry).
- Does not apply to the bonus question.
- Does not apply after the user taps "Try again".

**Flow:**
- Challenge screen tracks `hasRetried`; `firstTryCorrect = result.isCorrect && !hasRetried`.
- Passed through `ChallengeContinueExploringButton` → API → `processCuriosityCompletion` → `calculateRewards`.
- Shown in breakdown as "First-try correct" when earned.

---

## 3. Dynamic "This Mattered" Completion Line

**Location:** `src/lib/progress/completion-matters-line.ts`, `completion-celebration-card.tsx`

**Behavior:**
- One short contextual line per completion.
- Priority: level up > streak growth > first-try bonus > curiosity score up > daily pick > random spin > "getting closer to next level".
- Kept minimal; one line only.

**Examples:**
- "You leveled up."
- "Your streak is still growing."
- "That first-try answer gave you a small boost."
- "This topic strengthened your curiosity score."
- "You're getting closer to your next level."

---

## 4. Level Progress Clarity

**Changes:**
- **Completion celebration:** "One more curiosity could do it." when `xpToNextLevel <= 50` and user did not level up.
- **Progress hero:** "You're getting close." when `nextLevelXP <= 50`.
- API now returns `xpToNextLevel` for the completion response.

**Threshold:** 50 XP or less to next level = "close."

---

## 5. Curiosity Score Directional Cues

**Location:** `progress-hero-card.tsx`

**Expanded help (?) content:**
- Core explanation unchanged.
- Added bullets:
  - "Explore more categories to grow this."
  - "Accuracy and variety both help."
  - "Streaks add momentum."

---

## 6. Personality Badges

**New badges (migration `20260330120000_personality_badges.sql`):**

| Slug | Name | Criteria |
|------|------|----------|
| curious-switch | Curious Switch | 3 different categories in one day |
| comeback-trail | Comeback Trail | Returned after 5+ days away |
| deep-diver | Deep Diver | 3 intermediate/advanced topics in a row |

**Criteria logic:**
- **categories_in_one_day:** Max distinct categories completed on any single UTC calendar day.
- **comeback_gap:** `last_active_date` is 5+ days before completion date.
- **advanced_in_row:** Longest run of intermediate/advanced/expert topics when ordered by `completed_at` desc.

---

## 7. Badge Unlock Feel

**Changes:**
- Header: "New badges unlocked" (was "New badge(s)").
- Badge name: `font-semibold`.
- Description: Block below name, clearer separation.

---

## 8. Leaderboard Clarity Copy

**Location:** `leaderboard-screen.tsx`

**Window copy:**
- Weekly: "Based on XP earned this week."
- Monthly: "Based on XP earned this month."
- All-time: "Based on curiosity score — depth, breadth, and consistency."

---

## 9. Centralization

- All reward logic in `calculate-rewards.ts` and `xp-config.ts`.
- Badge logic in `badge-rules.ts` and `evaluate-badge-eligibility.ts`.
- UI consumes view models; no reward math in components.
