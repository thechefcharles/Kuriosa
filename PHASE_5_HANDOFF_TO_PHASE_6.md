# Phase 5 → Phase 6 handoff

## What Phase 5 completed

End-to-end **curiosity loop** (authenticated):

1. **Home** — daily feature + random discovery entry points.  
2. **Lesson** — Read / Listen + audio player.  
3. **Challenge** — one primary quiz + feedback.  
4. **Post-challenge** — follow-ups + trails.  
5. **Completion** — row in **`user_topic_history`** when the user taps **Continue exploring** after answering.

## What Phase 6 can rely on

| Asset | Use |
|-------|-----|
| **`user_topic_history`** | Per-user, per-topic visits: `completed_at`, `quiz_score`, `mode_used`, `was_daily_feature`, `was_random_spin`, `xp_earned` (currently 0). |
| **Session discovery flags** | Accurate when entering from **daily card**, **Feed my curiosity**, or **browse** (Discover / trails). Direct URL opens = neither flag. |
| **Stable routes** | `/home`, `/discover`, `/curiosity/[slug]`, `/challenge/[slug]`. |

## Completion semantics (do not break casually)

- **Recorded once per Continue tap** (updates same user+topic row if present).  
- **Not** tied to XP yet — safe to add **`xp_earned`** and profile rollups in Phase 6.  
- **`quiz_score`** 100/0 is a simple correct/incorrect flag for the last Continue.

## What to avoid before Phase 6

- Removing **`user_topic_history`** columns without migration plan.  
- Moving completion trigger without updating this doc and any analytics that depend on it.  
- Assuming **`user_id`** in history is anything other than **`auth.users.id`** / **`profiles.id`**.

## Suggested Phase 6 focus

- **Progress** screen reading **`user_topic_history`**.  
- **XP / streaks / badges** derived from completions.  
- Optional: server-side completion for tamper resistance.
