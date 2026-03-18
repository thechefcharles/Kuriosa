# Progress system architecture (Phase 6)

## Scope of 6.1

This phase adds **types**, **constants**, and **pure functions** only. Nothing writes to Supabase yet. **6.2** will apply rewards when a curiosity is completed.

## XP (`xp-config.ts` + `calculate-rewards.ts`)

| Grant | Constant | When (in calculation) |
|-------|----------|------------------------|
| Lesson | `LESSON_COMPLETION_XP` (10) | `lessonCompleted` |
| Challenge | `CHALLENGE_COMPLETION_XP` (20) | `challengeAttempted` |
| Perfect | `PERFECT_CHALLENGE_BONUS_XP` (10) | Attempted + correct |
| Daily | `DAILY_COMPLETION_BONUS_XP` (5) | `wasDailyFeature` |
| Random | `RANDOM_COMPLETION_BONUS_XP` (5) | `wasRandomSpin` |
| Listen | `LISTEN_MODE_BONUS_XP` (3) | `usedListenMode` + lesson completed |

**`calculateRewards(event)`** returns `xpEarned`, `breakdown`, and `isPerfect`.

*Topic draft `rewards.xpAward` in the CMS is separate — it does not drive user XP grants.*

## Levels (`level-config.ts`)

- XP to advance from level **L** → **L+1**: `100 × L^1.35` (rounded), minimum 1.
- **`getLevelFromXP(totalXp)`** — current level (starts at 1 at 0 XP).
- **`getXPForNextLevel(totalXp)`** — XP still needed to level up.

## Streaks (`streak-utils.ts`)

- **UTC calendar days**.
- **`calculateNextStreak(current, lastActivityDate, now)`**:
  - Same day as last activity → streak unchanged, `countedToday: false`.
  - Yesterday → increment.
  - Gap or first time → streak `1`.

## Curiosity Score (`curiosity-score.ts`)

Simple weighted sum (rounded):

- Topics completed × 12  
- Accuracy ratio (0–1) × 40  
- Distinct categories × 8  
- Streak length × 3  

Will evolve; values are centralized in one function.

## Database (6.1 migration)

- **`user_topic_history.challenge_correct`** (boolean, nullable; backfilled from `quiz_score ≥ 100`).
- **UNIQUE (`user_id`, `topic_id`)** after removing duplicate rows (keeps earliest row).

**`profiles`** already has `total_xp`, `current_level`, `curiosity_score`, streak fields, **`last_active_date`**.

## What 6.2 will do

- On completion: compute **`calculateRewards`**, update **`profiles`**, **`user_topic_history`** (including **`challenge_correct`**, **`xp_earned`**), streaks, and optionally **curiosity_score**.
