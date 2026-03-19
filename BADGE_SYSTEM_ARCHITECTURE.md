# Badge system (Phase 6.3)

## What lives in the database

- **`badges`** — each row is a definition: `slug`, `name`, `description`, **`criteria_type`**, **`criteria_value`** (threshold or structured string).
- **`user_badges`** — one row per user per badge earned. **`UNIQUE (user_id, badge_id)`** prevents duplicate unlocks.

## How criteria work

Interpretation is **centralized** in **`src/lib/progress/badge-rules.ts`**. Supported `criteria_type` values include:

| Type | `criteria_value` | Meaning |
|------|------------------|---------|
| `lessons_completed` | e.g. `1`, `5`, `10` | Count of rewarded topic completions (`rewards_granted`) ≥ N |
| `streak` | e.g. `7`, `30` | `current_streak` or `longest_streak` ≥ N |
| `categories_explored` | e.g. `3` | Distinct categories among rewarded completions ≥ N |
| `quizzes_completed` | e.g. `1` | Rewarded rows with a recorded challenge answer ≥ N |
| `quiz_perfect_scores` | e.g. `5` | Rewarded rows with `challenge_correct = true` ≥ N |
| `random_completions` | e.g. `5` | Rewarded rows with `was_random_spin = true` ≥ N |
| `category_completions` | e.g. `science:5` | Rewarded completions in category slug `science` ≥ 5 |

Unknown `criteria_type` values are **ignored** until code support is added.

## Eligibility evaluation

**`evaluateBadgeEligibility(supabase, userId)`** (`evaluate-badge-eligibility.ts`):

1. Loads all badge definitions.
2. Loads existing `user_badges` for the user.
3. Builds a **`BadgeEvaluationContext`** from **`profiles`** + **`user_topic_history`** (rewarded rows only) + topic/category joins.
4. For each definition with a supported type, runs **`isBadgeEligible`** from `badge-rules.ts`.
5. Returns badges that pass the rule **and** are not already unlocked.

## Unlock persistence

**`unlockBadges(supabase, userId, eligible[])`** (`unlock-badges.ts`) inserts into **`user_badges`**. Duplicate key (**23505**) is treated as **already unlocked** and skipped. Inserts are **idempotent**.

## Hook into completions

After a **new rewarded completion** (XP granted), **`processCuriosityCompletion`** calls **`applyCompletionBadgeUnlocks`**, which runs evaluation then unlock. **Repeat completions** (same topic, no new XP) **do not** run badge evaluation (saves work; stats unchanged for that path).

The API response includes **`unlockedBadges`**, **`badgeEvaluationRan`**, and any **`warnings`** (e.g. evaluation DB error).

## What comes later (6.4 / 6.5)

- **6.4+** — Badge gallery on profile / progress surfaces.
- **6.5+** — Completion celebration using **`unlockedBadges`** from the completion result.

No UI is built in 6.3; types and fields are ready for those prompts.
