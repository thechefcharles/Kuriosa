# Phase 5.2 summary — Home screen & daily curiosity entry

## What this prompt implemented

- **Real Home screen** at `/home`: curiosity-first hero, “Today’s curiosity” section, and light “What’s next?” actions.
- **`DailyCuriosityCard`**: title, hook, category, time, difficulty pill, **Start experience** → `/curiosity/[slug]`.
- **Loading skeleton**, **empty state** (no `daily_curiosity` row), **error state** for daily load failures.
- **Feed my curiosity** — disabled placeholder for 5.3+.
- **Browse Discover** — navigates to `/discover`.
- **`HOME_SCREEN_ARCHITECTURE.md`** — how Home fits together.

## Home screen foundation now exists

- Client **`HomeScreen`** owns **`useDailyCuriosity()`** and state branching.
- Presentational pieces live under **`components/curiosity/`** and **`components/home/`**.
- **`EmptyState`** supports optional **`icon`** and **`className`** for reuse.

## Next prompt (5.3)

- Implement **Feed my curiosity** (or equivalent discovery entry).
- Tighten **Discover** for real browsing if spec requires.

## Manual setup before 5.3

1. Seed or insert **`daily_curiosity`** for **today’s UTC date** with a valid **`topic_id`** to see the full card on Home.
2. Ensure the topic is readable when signed in.
3. Click **Start experience** and confirm navigation to **`/curiosity/[slug]`** (lesson UI may still be minimal).
