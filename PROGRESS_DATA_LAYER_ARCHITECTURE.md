# Progress data layer (Phase 6.4)

## Purpose

The app reads gamification state through **small services** that return **typed view models** (`src/types/progress-view.ts`). React Query hooks wrap those services; UI (and the temporary `/progress` panel) consumes hooks only.

## Services (`src/lib/services/progress/`)

| File | Reads | Returns |
|------|--------|---------|
| `get-user-progress-summary.ts` | `profiles` (XP, score, streaks) | `UserProgressSummary` — level bar uses **`level-config`** (same curve as server) |
| `get-user-badges.ts` | `user_badges` + `badges` | `UserBadgeView[]` (newest first) |
| `get-user-profile-progress.ts` | `profiles` | `UserProfileProgressView` (identity + summary) |
| `get-user-progress-stats.ts` | rewarded `user_topic_history` + badges list | `ProgressStatsView` (counts + recent unlocks) |

Shared aggregation for rewarded history lives in **`read/progress-read-helpers.ts`** (`fetchRewardedHistoryAggregate`).

## Hooks (`src/hooks/queries/`)

| Hook | Service | Query key |
|------|---------|-----------|
| `useAuthUserId` | `auth.getUser()` | `['auth','session','userId']` |
| `useUserProgressSummary` | `getUserProgressSummary` | `progressQueryKeys.summary(userId)` |
| `useUserBadges` | `getUserBadges` | `progressQueryKeys.badges(userId)` |
| `useUserProgressStats` | `getUserProgressStats` | `progressQueryKeys.stats(userId)` |
| `useUserProfileProgress` | `getUserProfileProgress` | `progressQueryKeys.profileProgress(userId)` |

Guests: hooks stay **disabled** until `userId` exists; **Progress** / **Profile** show a sign-in prompt.

## Cache invalidation

After a successful **`POST /api/progress/complete-curiosity`** (`useRecordCuriosityCompletion` **onSuccess**), **`invalidateProgressQueries(queryClient, userId)`** runs. That refetches summary, badges, stats, and profile-progress for that user.

## UI (6.5)

**Progress** and **Profile** consume these hooks. See **`PROGRESS_UI_ARCHITECTURE.md`**.

## Next

Product can add read paths only when new metrics ship.
