# Social Layer Architecture

Phase 10 introduces a **social foundation** for Kuriosa: public profiles, privacy controls, and activity events. This layer supports future leaderboards, feeds, and sharing—without building those UIs yet.

---

## Social Philosophy

Kuriosa’s social layer is designed to be:

- **Curiosity-driven** — Sharing and discovery center on curiosity, not competition
- **Non-toxic** — Privacy controls let users control visibility
- **Lightweight** — No heavy friend graph yet; scalable for later phases

---

## Profile System

**Extended fields (Phase 10.1):**

| Field | Type | Purpose |
|-------|------|---------|
| `display_name` | text | 2–40 chars (existing, now constrained) |
| `avatar_url` | text | Optional (existing) |
| `bio` | text | Optional short bio |
| `is_public_profile` | boolean | Profile page visible to others (default true) |
| `allow_activity_feed` | boolean | Events shown in feed (default true) |
| `allow_leaderboard` | boolean | Include in leaderboards (default true) |

**Services:**

- `getPublicProfile` — Returns profile when `is_public_profile` is true; otherwise restricted
- `updateProfileSettings` — Updates display name, avatar, bio, privacy flags
- `getProfilePrivacy` — Returns privacy settings for the current user

---

## Privacy Model

Privacy is enforced at the data layer:

| Flag | Effect |
|------|--------|
| `is_public_profile = false` | `getPublicProfile` returns error/restricted |
| `allow_activity_feed = false` | User’s events are excluded from `getActivityEvents` |
| `allow_leaderboard = false` | User excluded from future leaderboard queries |

**Helper:** `isProfileVisible(supabase, userId)` — Returns whether a profile can be shown publicly.

---

## Activity Event System

**Table:** `activity_events`

| Column | Purpose |
|--------|---------|
| `user_id` | Owner of the event |
| `type` | e.g. `topic_completed`, `badge_unlocked`, `level_up` |
| `topic_id` | Optional; for topic-related events |
| `metadata` | Optional JSONB for extra context |
| `created_at` | Event timestamp |

**Event types recorded:**

- `topic_completed` — Curiosity topic finished (with topic slug in metadata)
- `badge_unlocked` — Badge earned (badge id/slug in metadata)
- `level_up` — Level increased (levelBefore, levelAfter in metadata)

**Services:**

- `recordActivityEvent` — Fire-and-forget insert; failures do not affect user flow
- `getActivityEvents` — Fetches recent events; filters out users with `allow_activity_feed = false`

**Integration:** Activity is recorded from `processCuriosityCompletion` (topic completion, badge unlocks, level-ups).

---

## How This Supports Future Features

| Feature | Data support |
|---------|--------------|
| **Leaderboards** | `allow_leaderboard`, `curiosity_score`, `level` in profiles |
| **Activity feed** | `activity_events` + `allow_activity_feed` filter |
| **Sharing** | `getPublicProfile` for shared profile URLs |
| **Profile pages** | `getPublicProfile` when `is_public_profile` is true |

---

## What 10.2 Will Implement Next

- Profile page UI (public view)
- Activity feed UI
- Leaderboard UI
- API routes for profiles and feed
