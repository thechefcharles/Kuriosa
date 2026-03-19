# Phase 6.1 summary — Progress foundation

## Implemented

- **Migration**: `challenge_correct` on **`user_topic_history`**, dedupe, **UNIQUE (user_id, topic_id)**.
- **`src/types/progress.ts`** — completion event, rewards, level/streak snapshots, curiosity score input.
- **`src/lib/progress/`** — `xp-config`, `level-config`, `streak-utils`, `curiosity-score`, **`calculate-rewards`** (pure), barrel **`index.ts`**.
- **`PROGRESS_SYSTEM_ARCHITECTURE.md`**.

## Not in 6.1

- No profile/history updates, no UI, no badges (6.3), no wiring of completion mutation (6.2).

## Next (6.2)

- Call **`calculateRewards`** from the completion path; persist XP, **`challenge_correct`**, streaks, **`last_active_date`**, etc.

## Setup

1. Run the new Supabase migration on your project.
2. If migration fails on UNIQUE, check for duplicate **`user_topic_history`** rows (migration deletes extras, keeping oldest).
