# Phase 10.3 Summary — Leaderboard Backend & Data Layer

## What Was Implemented

### 1. Leaderboard Model and Types (`src/types/leaderboard.ts`)

- `LeaderboardWindow`: `'weekly' | 'monthly' | 'all_time'`
- `LeaderboardEntryView`: userId, displayName, avatarUrl, rank, score, curiosityScore, totalXp, level, topicsExplored, isCurrentUser
- `LeaderboardSummaryView`: window, entries, totalEligible, windowStart, windowEnd
- `UserLeaderboardPosition`: window, rank, score, totalEligible, entry (or null)

### 2. Window Helpers (`src/lib/services/social/leaderboard-window.ts`)

- `getLeaderboardWindowRange(window, refDate?)`: Returns `{ start, end }` in UTC
- Weekly: ISO week (Monday–Sunday)
- Monthly: Calendar month (1st–last day)
- All-time: Epoch to refDate
- All logic uses UTC consistently

### 3. Leaderboard Read Services

- **`get-leaderboard.ts`**: `getLeaderboard(window, options)` — returns ranked entries, respects `allow_leaderboard`, supports pagination
- **`get-user-leaderboard-position.ts`**: `getUserLeaderboardPosition(window, { currentUserId })` — returns user's rank or null

### 4. Weekly / Monthly Aggregation

- Aggregates from `user_topic_history` where `rewards_granted = true` and `completed_at` in window
- Score = sum of `xp_earned`
- Tie-break: completion count

### 5. All-Time Aggregation

- Uses `profiles.curiosity_score`, `profiles.total_xp`, and topics-explored count
- Sort: curiosity_score desc → total_xp desc → topics explored desc → display name

### 6. Privacy and Eligibility

- Only includes users with `is_public_profile = true` and `allow_leaderboard = true`
- No private users leaked into leaderboard data

### 7. API Routes

- `GET /api/social/leaderboard?window=...&limit=...&offset=...`
- `GET /api/social/leaderboard/position?window=...` (requires auth)

### 8. Query Keys and Hooks

- `leaderboardQueryKeys` in `src/lib/query/query-keys.ts`
- `useLeaderboard(window, options)` — thin wrapper, typed output
- `useUserLeaderboardPosition(window)` — handles signed-out state

### 9. Developer Example Script

- `src/lib/services/social/examples/run-leaderboard-example.ts`
- Package script: `npm run social:leaderboard-example`
- Logs top weekly / monthly / all-time results; optionally user position with `TEST_USER_ID`

### 10. Documentation

- `LEADERBOARD_DATA_ARCHITECTURE.md` — windows, ranking logic, privacy, services, hooks

## What Is NOT Built Yet

- Leaderboard screen UI
- Weekly / monthly / all-time tabs in the app
- Activity feed UI
- Public profile UI
- Notifications
- Materialized views or background jobs for rankings

## What 10.4 Will Add Next

- Leaderboard screen UI
- Tabs for weekly / monthly / all-time
- Display of top explorers and user position
- Curiosity-driven, inspiring presentation (no harsh competition)
