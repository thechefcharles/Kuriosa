# Public Profile Architecture

Phase 10.5 — Public profiles, privacy controls, and lightweight comparison.

## Overview

Users can view public profiles of others, control their own visibility, and mentally compare curiosity stats. The system is privacy-first: private profiles show a friendly message only.

## How Public Profiles Work

### Route

- `/profile/[userId]` — Public profile page

### Data Flow

1. Client requests `/api/social/profile/[userId]`
2. API uses `getPublicProfile` (service role) — enforces `is_public_profile`
3. If private: returns 403, UI shows "This profile is private"
4. If public: returns profile + badges + recent topics
5. `recordProfileView(viewerId, viewedId)` is called fire-and-forget when a signed-in user views another's profile

### Profile Content (when public)

- **Header:** Display name, avatar (or initials), bio
- **Stats:** Curiosity score, level, topics explored, badges count
- **Badges:** Grid of earned badges
- **Topics:** Recently explored topics (up to 5)

### Comparison (lightweight)

When the viewer is signed in and viewing someone else's profile, stats that exceed the viewer's are subtly highlighted. No persistent friend graph — comparison is visual only.

## How Privacy Is Enforced

### Data Layer

- `getPublicProfile` checks `isProfileVisible` → `is_public_profile = true`
- Returns `{ ok: false, error: "Profile is private" }` when private
- Never exposes private profile data

### UI Layer

- Private profiles render `ProfilePrivate` — "This profile is private"
- No fallback to partial data
- Profile links from leaderboard/feed always navigate; private profiles show the message

## How Profile Data Is Fetched Safely

- API uses `getSupabaseServiceRoleClient` to bypass RLS for reading profiles
- Privacy is enforced in application logic via `isProfileVisible`
- Badges and recent topics are only fetched after confirming profile is public

## Profile Links

| Source        | Behavior                                           |
|---------------|----------------------------------------------------|
| Leaderboard   | Row links to `/profile/[userId]` — leaderboard users are public |
| Activity feed | User name links to `/profile/[userId]` — may be private |
| Profile page  | "View public profile" links to own `/profile/[userId]` |

## What Is NOT Included

- Messaging
- Notifications
- Friend graph / follow system
- Persistent "compare with" relationships
- Profile view counts UI (analytics are recorded but not displayed)
