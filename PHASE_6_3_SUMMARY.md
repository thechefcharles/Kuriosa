# Phase 6.3 — Badge foundation & unlock logic

## Implemented

- **`badge-rules.ts`** — Single place that maps `criteria_type` / `criteria_value` → pass/fail using **`BadgeEvaluationContext`**.
- **`evaluate-badge-eligibility.ts`** — Loads definitions, unlocked set, aggregates from profile + rewarded history + categories; returns **`BadgeEligibilityResult`**.
- **`unlock-badges.ts`** — Idempotent inserts into **`user_badges`** (handles **23505**).
- **`apply-completion-badges.ts`** — Thin wrapper: evaluate → unlock.
- **`processCuriosityCompletion`** — After a successful **first-time XP grant**, runs badge flow; result includes **`unlockedBadges`**, **`badgeEvaluationRan`**.
- **`src/types/progress.ts`** — **`UnlockedBadgeResult`**; **`ProgressUpdateSuccess`** extended; re-exports **`BadgeEligibilityResult`**.
- Migration **`20260321120000_phase63_badges_random_category.sql`** — **`random-rover`**, **`science-regular`** badges.
- **`BADGE_SYSTEM_ARCHITECTURE.md`**, **`run-badge-evaluation-example.ts`**, **`npm run progress:badges-example`**.

## Setup

1. Apply new migration (plus existing badge seeds from Phase 3.3).
2. Completing a curiosity via **`POST /api/progress/complete-curiosity`** after a **new** topic reward runs badge evaluation.

## Next (6.4)

- Badge display on profile / progress UI (not in 6.3).
