# Phase 5 — Frontend content loading

This document explains how the app loads curiosity content for the user-facing experience after Phase 4’s normalized persistence.

## Big picture

1. **Postgres** stores topics, tags, follow-ups, quizzes, trails, and the daily feature row.
2. **Services** (in `src/lib/services/content/`) run Supabase queries and map rows into one object shape.
3. **React Query hooks** (in `src/hooks/queries/`) call those services on the client so UI can show loading, error, and data states.

You must be **signed in** to read content tables (RLS: authenticated read only).

## Main types

- **`LoadedCuriosityExperience`** (`src/types/curiosity-experience.ts`) — same as the canonical `CuriosityExperience`, except **`challenge` is optional** when a topic has no quiz yet. Everything else (lesson, trails, follow-ups, audio) is filled in with safe defaults where needed.

## Services

| File | Role |
|------|------|
| `load-curiosity-experience.ts` | Load **one topic** by **slug** or **topic id**. Fetches topic, category, tags, follow-ups, first quiz + options, trails (with target titles). |
| `get-daily-curiosity.ts` | Reads **`daily_curiosity`** for **today (UTC date)** → loads that topic via the loader above. Returns **`null`** if there is no row for that date or the topic is missing. |
| `get-random-curiosity.ts` | Picks a **random published** topic (prefers `is_random_featured = true`). Optional **difficulty** filter and **excludeSlug**. Returns **`null`** if nothing matches. |
| `load-curiosity-preview.ts` | Internal preview: same loader + **server** Supabase client (cookies). |

## React Query hooks

| Hook | Query key helper | Returns |
|------|------------------|---------|
| `useDailyCuriosity(dateISO?)` | `curiosityQueryKeys.daily(...)` | `DailyCuriosityResult \| null` (null = no daily row) |
| `useRandomCuriosity({ difficultyLevel?, excludeSlug? })` | `curiosityQueryKeys.random(...)` | `LoadedCuriosityExperience \| null` |
| `useCuriosityExperience(slug)` | `curiosityQueryKeys.bySlug(slug)` | `LoadedCuriosityExperience \| null` |

Keys live in **`src/lib/query/query-keys.ts`**.

## Optional / missing data

- **No daily row** → `getDailyCuriosity` returns `null`; UI should show an empty state.
- **No quiz** → `challenge` is omitted; lesson and discovery card still load.
- **No follow-ups / trails / audio** → empty arrays or omitted `audio`; no throws.
- **Invalid or empty audio URL** → `audio` omitted.

## Temporary dev surface

**`/discover`** (app shell) calls `useDailyCuriosity` and `useRandomCuriosity` with minimal debug lines. Replace this in later prompts with real Discover UI.

## Shared UI primitives

- `LoadingState`, `ErrorState`, `EmptyState` under `src/components/shared/` for consistent loading / error / empty UX.

## What 5.2+ can rely on

- Use **`useCuriosityExperience(slug)`** on lesson routes.
- Use **`useDailyCuriosity()`** on Home when you build it.
- Use **`useRandomCuriosity()`** for “surprise me” flows.
- Always branch on **`data.challenge`** before rendering the challenge UI.
