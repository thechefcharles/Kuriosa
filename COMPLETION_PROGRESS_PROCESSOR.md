# Curiosity completion → progress (Phase 6.2)

This doc explains what happens when a learner finishes the curiosity loop (challenge screen → **Continue exploring**).

## End-to-end flow

1. The user answers the challenge and taps **Continue exploring**.
2. The app calls **`POST /api/progress/complete-curiosity`** with topic id, slug, mode flags, and whether the answer was correct. The session cookie identifies the user.
3. The API runs **`processCuriosityCompletion`** (server-side) with a Supabase client bound to that user (RLS applies).

## Tables updated

### `user_topic_history` (one row per user + topic)

- **Unique key:** `(user_id, topic_id)`.
- **First time this topic earns XP:** a row may be inserted with `rewards_granted = false`, then updated in one step to `rewards_granted = true`, with `xp_earned`, `completed_at`, `mode_used`, `challenge_correct`, daily/random flags, etc.
- **Already rewarded (`rewards_granted = true`):** only metadata is refreshed (e.g. latest visit time, quiz result, modes). **No extra XP.**

### `profiles`

On the **first rewarded completion** for that topic, the profile is updated:

- `total_xp` — increases by the XP from centralized **`calculateRewards`**
- `current_level` — from **`getLevelFromXP`**
- `curiosity_score` — from **`calculateCuriosityScore`** (topics with rewards, accuracy, categories, streak)
- `current_streak` / `longest_streak` — from **`calculateNextStreak`** (UTC calendar days)
- `last_active_date` — UTC date string for the completion day

Repeat visits to an already-rewarded topic do **not** change these profile fields.

## Duplicate completions & races

| Situation | Behavior |
|-----------|----------|
| Same topic again after XP already granted | History row updated only; **0 XP**; response includes a warning. |
| Double-click / two tabs calling the API | Only one request “claims” the row (`rewards_granted` false → true). The other sees no claim and applies metadata-only path. |
| Same UTC day, second **new** topic | Streak does **not** increment again (`calculateNextStreak`); XP still granted for the new topic. |
| Profile update fails after history was claimed | `rewards_granted` and `xp_earned` are reverted on that row so the user can **retry** safely. |

## Phase 5 migrations

Rows that already had `completed_at` when migration `20260319130000_phase62_rewards_granted.sql` ran were marked **`rewards_granted = true`**. Those users do **not** get a retroactive XP lump when they hit Continue again.

## What Phase 6.3 will add

- **Badges** — evaluated after a successful completion (not part of this processor yet).

## Key code

- Processor: `src/lib/services/progress/process-curiosity-completion.ts`
- API: `src/app/api/progress/complete-curiosity/route.ts`
- Types: `src/types/progress.ts` (`CuriosityCompletionPayload`, `ProgressUpdateResult`)
