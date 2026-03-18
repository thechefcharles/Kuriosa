# Home screen architecture

## Purpose

The **Home** route (`/home`) is the first real user-facing surface in Phase 5. It answers: *“What should I explore right now?”* with **today’s featured curiosity** and light entry points to the rest of the app.

## Route and layout

| Piece | Location |
|-------|----------|
| Route | `src/app/(app)/home/page.tsx` |
| App chrome | `(app)/layout.tsx` → `AppShell` (top bar + bottom nav) |

The page itself is a thin server wrapper that renders **`HomeScreen`** (a client component).

## How daily curiosity loads

1. **`HomeScreen`** (`src/components/home/home-screen.tsx`) calls **`useDailyCuriosity()`** from Phase 5.1.
2. That hook runs **`getDailyCuriosity`** against Supabase (browser client, user must be signed in per RLS).
3. When data exists, **`DailyCuriosityCard`** receives **`daily.data.experience`** plus optional **`theme`** from the `daily_curiosity` row.

No database logic lives in the card—only display props.

## Main components

| Component | Role |
|-----------|------|
| **`HomeScreen`** | Layout, hero copy, wires hook to loading / error / empty / card states. |
| **`DailyCuriosityCard`** | Title, hook, time, difficulty, category, CTA → **`/curiosity/[slug]`**. |
| **`DailyCuriosityCardSkeleton`** | Loading placeholder for the card. |
| **`HomeDailyEmpty`** / **`HomeDailyError`** | Friendly empty and error copy for the daily block. |
| **`DifficultyLabel`** | Small pill for difficulty level. |

Supporting UI on Home:

- **Feed my curiosity** — disabled button, placeholder for a future “surprise me” flow (Phase 5.3+).
- **Browse Discover** — link to **`/discover`**.

## What’s complete vs placeholder

| Done (5.2) | Placeholder / later |
|------------|---------------------|
| Home layout, hero, daily card, CTA to curiosity route | Full **lesson** page UI (5.x) |
| Loading / empty / error for daily | **Challenge** UI |
| Discover link | **Feed my curiosity** behavior (e.g. random spin) |
| | Progress / personalization |

## What 5.3 will likely add

- Behavior for **Feed my curiosity** (e.g. random or guided discovery).
- Possibly richer **Discover** beyond the dev-oriented surface.

## Files to read first

- `PHASE_5_DATA_LOADING.md` — how `useDailyCuriosity` and `LoadedCuriosityExperience` work.
- `src/lib/constants/routes.ts` — `ROUTES.curiosity(slug)`.
