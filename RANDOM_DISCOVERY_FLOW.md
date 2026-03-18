# Random discovery (“Feed my curiosity”)

## What it does

On **Home**, **Feed my curiosity** picks a **random published topic**, loads it as a **`LoadedCuriosityExperience`**, then **navigates to** `/curiosity/[slug]`. It’s meant to feel like a small moment of surprise—not a full recommendation engine.

## Components & hooks

| Piece | Location |
|-------|----------|
| UI | `src/components/curiosity/feed-my-curiosity-button.tsx` |
| Data action | `useFeedRandomCuriosity()` in `src/hooks/mutations/useFeedRandomCuriosity.ts` |
| Server logic | `getRandomCuriosity()` in `src/lib/services/content/get-random-curiosity.ts` |

The button **does not** talk to Supabase directly. It calls the mutation, which uses **`getRandomCuriosity`** (same rules as Phase 5.1: featured preference, optional filters, `excludeSlug`).

## Repeat avoidance (simple)

1. **Session storage** key **`kuriosa_last_random_slug`** stores the slug of the last topic opened via this flow.
2. On each click, **`excludeSlug`** is:
   - **last random slug** if one exists this session → avoids picking the same topic again when other topics exist.
   - otherwise **today’s daily topic slug** (when Home has daily data) → first spin is less likely to duplicate the big daily card.
3. If only one (or zero) topics match, **`getRandomCuriosity`** may **fall back** and repeat—by design, to avoid a dead end.

## Difficulty filter

A compact row of pills: **All**, **Beginner**, **Intermediate**, **Advanced**. Values are passed as **`difficulty_level`** on the topic row (`beginner` / `intermediate` / `advanced`). Your seed data must use the same strings for filtering to return results.

## States

| State | Behavior |
|-------|----------|
| Idle | Button enabled; pills can change filter. |
| Loading | Button disabled; spinner + “Finding something fascinating…”. |
| Success | Navigate away (slug written to session storage). |
| No matches | Friendly message (e.g. wrong difficulty filter). |
| Network error | Message + **Try again** link. |

## What we are not building yet

- No personalization, scoring, or category-based random feeds.
- No long history of seen topics (only last random + first-spin daily dodge).
- No extra analytics events beyond whatever the app already does globally.

## Future phases could add

- Stronger “already seen” tracking (per user).
- More filter dimensions (category, length).
- Haptic / animation polish.
