# Phase 6.2 — Real progress engine

## Implemented

- **`processCuriosityCompletion`** — single server entry that:
  - Validates topic id + slug
  - Upserts / claims **`user_topic_history`** with **`rewards_granted`** so each user/topic gets **at most one XP grant**
  - On first grant: **`calculateRewards`**, **`getLevelFromXP`**, **`calculateNextStreak`**, **`calculateCuriosityScore`**, then updates **`profiles`**
  - On repeat: metadata-only history update, **0 XP**
  - Handles race (duplicate API calls) and profile failure (revert claim for retry)
- **`POST /api/progress/complete-curiosity`** — thin authenticated wrapper
- **`useRecordCuriosityCompletion`** — calls the API (no reward logic in the hook UI layer)
- **`ChallengeContinueExploringButton`** — passes `slug` for validation
- Types: **`CuriosityCompletionPayload`** (incl. `slug`), **`CompleteCuriosityClientPayload`**, **`ProgressUpdateResult`**
- Migration: **`rewards_granted`** on **`user_topic_history`**; backfill for existing completions
- Docs: **`COMPLETION_PROGRESS_PROCESSOR.md`**
- Example: **`npm run progress:complete-example`** (service role + env vars)

## Setup

1. Run Supabase migration `20260319130000_phase62_rewards_granted.sql`.
2. No extra env for the app route beyond normal Supabase auth.

## Next (6.3)

- Badge evaluation after completion (no badge logic in 6.2).
