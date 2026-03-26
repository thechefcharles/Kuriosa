# Social UI Architecture

Phase 10.4 — Leaderboard and activity feed UI surfaces.

## Overview

The social layer provides lightweight, curiosity-driven browsing: leaderboards and community activity. The tone is celebratory and inspiring, not competitive or stressful.

## Routes

| Route | Purpose |
|-------|---------|
| `/leaderboard` | Community hub — leaderboard + recent activity feed |

This is a combined page: leaderboard on top, activity feed below. No separate `/social` route for MVP.

## Leaderboard Browsing

1. **Window tabs:** Weekly, This Month, All Time — switch via segmented control
2. **User rank card:** Shows signed-in user's rank (or encouraging copy if unranked/unsigned)
3. **Top explorers list:** Ranked entries with display name, score, optional topics/level
4. **"You" indicator:** Current user's row is highlighted

Data comes from `useLeaderboard(window)` and `useUserLeaderboardPosition(window)` — no ranking logic in components.

## Activity Feed Browsing

1. **Recent activity section:** Human-readable lines, e.g. "Alex explored the physics of lightning."
2. **Relative timestamps:** "just now", "5m ago", "2h ago", etc.
3. **Topic links:** Completed/shared topics link to the curiosity page
4. **Event types:** topic_completed, topic_shared, badge_unlocked, level_up

Data comes from `useActivityFeed()` — no feed query logic in components.

## Current User Position

- **Signed in:** `UserRankCard` shows rank, score, total explorers
- **Not ranked:** Encouraging copy to explore and earn a place
- **Signed out:** Prompt to sign in to see rank

## Empty / Error States

| State | Handling |
|-------|----------|
| Empty leaderboard | "No rankings yet" — be the first |
| User not ranked | "Not ranked yet" — explore to earn your place |
| Empty feed | "No activity yet" — when people explore, it shows here |
| Signed out | "Sign in to see your rank" |
| Query failure | Curiosity-friendly error message, no raw dumps |

## Components

| Component | Responsibility |
|-----------|----------------|
| `LeaderboardScreen` | Page orchestration, loads data, renders tabs + rank + list |
| `LeaderboardWindowTabs` | Weekly/monthly/all-time switch |
| `LeaderboardList` | Renders leaderboard rows |
| `LeaderboardRow` | Rank, display name, score, "you" indicator |
| `UserRankCard` | Current user's rank or unranked/signed-out copy |
| `ActivityFeed` | Fetches and renders feed |
| `ActivityFeedItem` | Single activity line + relative time |
| `ActivityFeedEmpty` | Empty feed state |

## Design Principles

- **Mobile-first:** Readable, scrollable, touch-friendly
- **Calm hierarchy:** Soft gradients, legible rankings
- **No toxic vibes:** No aggressive "top performer" styling, no casino scoreboard feel
- **Celebratory but calm:** Violet accents, gentle highlights

## What 10.5 Will Add Next

- Public profile page UI (when user taps a leaderboard row or activity item)
- Privacy settings UI
- Notifications (if planned)
- Optional: polish and animations
