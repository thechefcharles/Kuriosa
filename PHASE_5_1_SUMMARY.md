# Phase 5.1 summary — Content loading foundation

## What this prompt implemented

- **`loadCuriosityExperience`** — Single loader from normalized tables → **`LoadedCuriosityExperience`** (optional `challenge` when no quiz).
- **`getDailyCuriosity`** / **`getRandomCuriosity`** — Daily feature row + random published topic (featured preference, optional filters).
- **React Query hooks**: `useDailyCuriosity`, `useRandomCuriosity`, `useCuriosityExperience`.
- **`curiosityQueryKeys`** — Central query keys.
- **`EmptyState`** + existing **LoadingState** / **ErrorState** for UI states.
- **Discover page** — Temporary dev verification (daily + random debug output).
- **Docs**: `PHASE_5_DATA_LOADING.md` (how loading works).

## Refactors

- **`load-curiosity-preview.ts`** now delegates to **`loadCuriosityExperience`** (no duplicated assembly).
- **Internal content preview** handles missing challenge.
- **`assemble-curiosity-experience.ts`** re-exports the real loader.

## Next prompt (5.2+)

- Home / lesson / challenge **UI** on top of these hooks.
- Do not re-query raw tables from components; keep using services + hooks.

## Manual setup before 5.2

1. **Supabase**: At least one **`topics`** row with **`status = published`** (for random curiosity).
2. **Optional**: A **`daily_curiosity`** row with **`date`** = today’s UTC date (`YYYY-MM-DD`) and a valid **`topic_id`**.
3. Run the app **signed in** (RLS requires auth for content reads).
4. Open **`/discover`** to confirm daily (or empty), random, loading, and error behavior.
