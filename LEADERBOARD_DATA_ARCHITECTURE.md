# Leaderboard Data Architecture

Phase 10.3 — Backend and data layer for Kuriosa leaderboards.

## Overview

Leaderboards rank users by their curiosity-driven activity. The system supports three time windows: **weekly**, **monthly**, and **all-time**. Rankings are deterministic, privacy-aware, and computed from existing progress data.

## Leaderboard Windows

Defined in `src/lib/services/social/leaderboard-window.ts`:

| Window   | Start                                   | End                                     |
|----------|-----------------------------------------|-----------------------------------------|
| Weekly   | Monday 00:00 UTC (ISO week)             | Sunday 23:59:59 UTC                     |
| Monthly  | 1st of month 00:00 UTC                  | Last day of month 23:59:59 UTC          |
| All-time | Epoch                                   | Reference date (default: now)           |

All date logic uses UTC for consistency.

## How Rankings Are Calculated

### Weekly / Monthly

- **Source:** `user_topic_history` rows where:
  - `rewards_granted = true`
  - `completed_at` within the window
- **Score:** Sum of `xp_earned` for completions in the window
- **Tie-break:** Completion count (more completions wins)

### All-Time

- **Source:** `profiles` (curiosity_score, total_xp) + `user_topic_history` (topics explored count)
- **Sort order:**
  1. `curiosity_score` descending
  2. `total_xp` descending
  3. Topics explored count descending
  4. Display name (or userId) ascending for final tie-break

### Eligibility

Only users who meet **all** of the following appear on leaderboards:

- `profiles.is_public_profile = true`
- `profiles.allow_leaderboard = true`
- (For weekly/monthly) At least one rewarded completion in the window
- (For all-time) At least one of: curiosity_score > 0, total_xp > 0, or topics explored > 0

## Privacy Enforcement

- Profiles with `allow_leaderboard = false` are **never** included
- Profiles with `is_public_profile = false` are **never** included
- No private user data is exposed
- Display names can be null; UI can show fallbacks (e.g. "Explorer")

## Services

| Service                         | File                                             | Purpose                                |
|---------------------------------|--------------------------------------------------|----------------------------------------|
| `getLeaderboard(window, opts)`  | `src/lib/services/social/get-leaderboard.ts`     | Returns ranked entries for a window    |
| `getUserLeaderboardPosition()`  | `src/lib/services/social/get-user-leaderboard-position.ts` | User's rank in a window   |
| Window helpers                  | `src/lib/services/social/leaderboard-window.ts`  | Resolve window start/end in UTC        |

## API Routes

| Route                              | Method | Auth    | Description                    |
|------------------------------------|--------|---------|--------------------------------|
| `/api/social/leaderboard`          | GET    | Optional| Leaderboard list (window, limit, offset) |
| `/api/social/leaderboard/position` | GET    | Required| Current user's position        |

## React Query Hooks

| Hook                           | Query Key                          | Description                  |
|--------------------------------|------------------------------------|------------------------------|
| `useLeaderboard(window, opts)` | `["leaderboard", "list", window]`  | Fetch leaderboard entries    |
| `useUserLeaderboardPosition(window)` | `["leaderboard", "position", window]` | Fetch current user's rank |

Hooks are thin wrappers around the API; they handle signed-out state where appropriate.

## What 10.4 Will Build Next

- Leaderboard screen UI
- Weekly / monthly / all-time tabs
- Display of top explorers and user position
- (No activity feed UI, no public profile UI, no notifications in this phase)

## Example Script

Run leaderboard queries from the command line:

```bash
npm run social:leaderboard-example
```

Optionally set `TEST_USER_ID` in `.env.local` to test user position lookup.
