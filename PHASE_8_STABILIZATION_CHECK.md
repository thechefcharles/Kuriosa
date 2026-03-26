# Phase 8 Stabilization Check — Ready for Phase 9

**Date:** March 2025  
**Scope:** Pre–Phase 9 stabilization pass

---

## What Was Verified

- Seed data flow: topics (ten-demo or phase4), categories (migrations)
- `daily_curiosity` seeding: `npm run seed:daily` + SQL fallback
- Audio: optional; Listen Mode requires `topics.audio_url`
- Build: `npm run build` succeeds; `npx tsc --noEmit` may need `.next` cleared
- Full curiosity loop: Home → curiosity → challenge → completion → progress

---

## What Was Added / Fixed

### Added

- **`npm run seed:daily`** — Seeds today's `daily_curiosity` from first published topic (requires `SUPABASE_SERVICE_ROLE_KEY`)
- **`supabase/seeds/seed-daily-curiosity.sql`** — Manual SQL for daily curiosity
- **`QUICK_START.md`** — 5-minute local setup guide
- **ENVIRONMENT_SETUP.md** — "Quick Start — Full App Verification" section
- **Build fix note** — `rm -rf .next && npm run build` when TS errors from stale `.next`

### No Code Fixes Required

- No broken imports, missing exports, or null-crash risks found
- Routes, hooks, and services are wired correctly

---

## How to Seed Data

### Topics (8–10+ published)

**Option A — Ten demo (no API):**  
Supabase SQL Editor → run `supabase/seeds/ten-demo-curiosities.sql`

**Option B — AI-generated:**  
```bash
npm run seed:phase4
```

### Daily curiosity (required for Home)

```bash
npm run seed:daily
```

Or run `supabase/seeds/seed-daily-curiosity.sql` in SQL Editor.

### Audio (optional, for Listen Mode)

```bash
npm run audio:generate-example -- --slug=why-sky-blue
```

---

## Full Flow Manual Verification

1. **Home** — Daily curiosity card appears
2. **Curiosity page** — Lesson loads; Read/Listen toggle works; transcript behaves
3. **Audio (if generated)** — Plays, finishes, shows Continue CTA
4. **Challenge** — Loads; answer submission works
5. **Completion** — "See what's next" → API → XP increases; streak updates; badges may unlock
6. **Progress** — `/progress` reflects updated stats
7. **Discovery** — `/discover` loads; categories clickable; search works; suggested topics appear
8. **Build** — `npm run build` completes without errors

---

## Confirmation Checklist

- [ ] Home shows daily curiosity
- [ ] Curiosity page loads
- [ ] Challenge works
- [ ] Progress updates
- [ ] Discovery works
- [ ] Audio works (if generated)
- [ ] App builds cleanly

---

## Seeding Status (Per Environment)

| Item | Status | How to fix |
|------|--------|------------|
| Topics | Depends on seed run | `ten-demo-curiosities.sql` or `npm run seed:phase4` |
| Categories | From migrations | `supabase db push` |
| daily_curiosity | Often empty initially | `npm run seed:daily` |
| audio_url | Usually empty | `npm run audio:generate-example -- --slug=<slug>` |

---

## Ready for Phase 9?

**YES** — with the understanding that:

- A developer can clone → run migrations → seed topics → `seed:daily` → run dev → see Kuriosa working end-to-end
- Listen Mode is optional; Read is always available
- All key flows are testable without manual DB hacking once seeding is done
