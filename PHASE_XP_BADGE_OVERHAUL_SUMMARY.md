# Phase: XP & Badge Overhaul — Summary

## Summary of Changes

1. **XP model** — Quiz-first: correct = difficulty XP × daily multiplier; wrong = 5 XP; bonus correct = +10.
2. **Daily multiplier** — Added `daily_curiosity.daily_multiplier`; shared per day.
3. **Category XP** — New `user_category_xp` table; XP tracked per category.
4. **Correct streak** — `profiles.correct_streak`, `longest_correct_streak`.
5. **Badges** — New criteria (total_xp, correct_streak, category_xp, daily_multiplier_hit); new names.
6. **Removed** — Lesson XP, first-try bonus, listen bonus, random bonus, daily flat bonus.

## Migrations to Run

```bash
supabase db push
# or apply: 20260318120000_xp_badge_overhaul.sql, 20260318120001_xp_badge_overhaul_badges.sql
```

## Manual Steps

1. Run migrations.
2. Backfill `daily_curiosity.daily_multiplier` for existing rows (default 1.5).
3. Optional: backfill `user_category_xp` from `user_topic_history` + topics (see processor logic).
4. Set daily multiplier for new daily rows (seed/cron/admin).

## Verify Locally

1. Complete a topic (correct) — expect difficulty XP × 1.5 (or today's multiplier).
2. Complete a topic (wrong) — expect 5 XP.
3. Daily challenge — verify multiplier from `daily_curiosity`.
4. Badge unlocks — check `user_badges` after meeting criteria.

## Notes

- `curiosity_score` still computed; leaderboard unchanged for now.
- Retry gives no extra XP; client can still offer retry for learning.
