# Phase 6.4 — Progress data layer (reads)

## Implemented

- **`src/types/progress-view.ts`** — `UserProgressSummary`, `UserBadgeView`, `UserStreakView`, `UserProfileProgressView`, `ProgressStatsView`.
- **Read services** — `getUserProgressSummary`, `getUserBadges`, `getUserProfileProgress`, `getUserProgressStats`, plus **`read/progress-read-helpers.ts`**.
- **`progressQueryKeys`** in `query-keys.ts`.
- **Hooks** — `useAuthUserId`, `useUserProgressSummary`, `useUserBadges`, `useUserProgressStats`, `useUserProfileProgress`.
- **`invalidateProgressQueries`** + wiring in **`useRecordCuriosityCompletion`** after successful completion.
- **`/progress`** — **`ProgressDataVerificationPanel`** (temporary dev surface).
- **`PROGRESS_DATA_LAYER_ARCHITECTURE.md`**.

## Setup

None beyond Supabase auth + existing schema. Sign in and open **`/progress`**.

## Next (6.5)

Real progress dashboard / profile UI and celebration surfaces using these hooks.
