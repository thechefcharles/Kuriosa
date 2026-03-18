# Progress UI (Phase 6.5)

## Progress screen (`/progress`)

**`ProgressDashboard`** composes data from **6.4 hooks only** (`useUserProgressSummary`, `useUserProgressStats`, `useUserBadges`). Subcomponents:

| Component | Role |
|-----------|------|
| **ProgressHeroCard** | Level, total XP, curiosity score, level bar + XP to next |
| **StreakCard** | Current / longest streak + short motivational copy |
| **StatGrid** | Topics, categories, badges, random completions, perfect challenges |
| **BadgeGrid** / **BadgeCard** | Earned badges with initials/URL icon fallback |

No XP or level math in UI — all numbers come from typed view models.

## Profile screen (`/profile`)

Server still checks auth and redirects guests. **`ProfileProgressHub`** (client) uses **`useUserProfileProgress`** and **`useUserBadges`**: avatar or initial, display name, level chip, score, streak, thin level bar, and up to four **recent** badges with link to full **Progress** page.

## Badge presentation

**BadgeCard** shows earned state, name, optional description (dashboard), date, and a gradient tile with **initials** or **http(s) icon** URL if present. Empty **BadgeGrid** uses encouraging copy.

## Completion celebration

1. **`ChallengeContinueExploringButton`** — on successful API response with **new XP** and/or **new badges**, **`stashCompletionCelebration`** writes to **sessionStorage** (includes **timestamp**).
2. User navigates to **`/curiosity/[slug]#whats-next`**.
3. **`CompletionCelebrationHost`** runs **`consumeCompletionCelebration(slug)`**: validates shape, enforces **~15 min TTL**, clears bad data. Matching slug removes storage and shows the card. **Refresh after consume** does not replay.

Repeat completions (no XP, no new badges) do not stash — no empty celebration.

## What 6.6 might polish

- Motion / micro-interactions, sound-off haptics copy, A/B celebration copy, analytics on dismiss, deeper integration tests.
