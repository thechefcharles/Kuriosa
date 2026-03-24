# Phase P1.3 — Content Expansion and Trails Summary

## Overview

Content inventory expansion, difficulty calibration, and trail seeding to make Kuriosa feel richer, smarter, and more alive.

---

## 1. Summary of Changes

### Content Inventory

- **20 new topics** added via migration
- Spread across Science, History, Technology, Nature/Biology, Space, Psychology, Philosophy, Culture
- Each with lesson, hook, surprising fact, real-world relevance, quiz, and difficulty

### Difficulty Calibration

- **Beginner (13):** 4–5 min, simple concepts, clear payoff
- **Intermediate (6):** 5–6 min, richer nuance, trickier distractors
- **Advanced (1):** 7 min, denser concepts (e.g., black hole event horizon)

### Trail Seeding

- **14+ trail links** between topics
- Themed chains: sky/light, lightning, tech, honey, history, space, culture
- "What's next?" feels intentional

### Bonus Questions

- 4 topics now have a bonus (sort_order = 1) quiz: why-sky-blue, what-is-qr-code, lightning-hotter-than-sun, how-bees-make-honey

### Followups

- 5 ten-demo topics received their first followups for discovery and AI exploration

---

## 2. Content Inventory Changes

| Before     | After            |
|-----------|------------------|
| 10 topics | 30 topics        |
| All beginner | Beginner, intermediate, advanced |
| No trails | 14+ trail links  |
| No followups (ten-demo) | Followups on 5 demo topics |
| No bonus questions | 4 topics with bonus |

---

## 3. Difficulty Calibration Decisions

- **Beginner:** High accessibility; lesson under 220 words; quiz with one clearly correct answer
- **Intermediate:** More depth; lesson 220–300 words; plausible distractors
- **Advanced:** Conceptually heavier; lesson 250–350 words; requires focus

Estimated minutes: 4 (beginner) → 5–6 (intermediate) → 7 (advanced).

---

## 4. Trail Seeding Decisions

- **Sky/light:** why-sky-blue ↔ why-sunset-red, how-rainbows-form; why-ice-floats → why-sky-blue
- **Lightning:** lightning-hotter-than-sun → what-is-ball-lightning
- **Tech:** QR → barcodes; binary → software bug; GPS → black holes (relativity)
- **Nature:** honey → bees; trees-sleep → trees-communicate
- **History:** pyramid → roman concrete
- **Space:** dark-side-moon → astronauts → black holes
- **Culture:** break-a-leg → untranslatable-words

---

## 5. Files Created or Modified

### Created

- `supabase/migrations/20260328120000_content_expansion_trails.sql` — topics, quizzes, options, followups, trails
- `CONTENT_EXPANSION_AND_TRAILS_ARCHITECTURE.md`
- `PHASE_P1_3_SUMMARY.md`

### Modified

- `supabase/seeds/README_TEN_DEMO.md` — note about content expansion migration (see below)

---

## 6. Manual Steps for Developer

1. **Run migrations:** `supabase db push` (includes content expansion)
2. **Prerequisites:** Ten-demo and reference migrations must have run (categories: science, history, nature, technology, culture, psychology, space, biology, philosophy)
3. **Daily pick:** `npm run seed:daily` (or run seed-daily-curiosity.sql)

---

## 7. Verify Locally

1. **Home:** Featured/random topics load; variety in difficulties
2. **Discover:** Search and category grids show new topics
3. **Category pages:** Multiple topics per category
4. **Curiosity → Challenge:** Bonus offer on why-sky-blue, what-is-qr-code, lightning-hotter-than-sun, how-bees-make-honey
5. **What's next:** Trail cards appear after challenge
6. **Followups:** Guided Q&A visible on demo topics
7. **Progress:** Completions recorded; XP and streaks update

---

## 8. Notes / Risks

- **Category order:** Psychology, Space, Biology, Philosophy come from `20250307130001_seed_reference_data.sql`. Run it before content expansion.
- **Idempotency:** Migration uses `ON CONFLICT` and `NOT EXISTS`; safe to re-run.
- **Phase 4 overlap:** If `npm run seed:phase4` was run, some titles may overlap (e.g. "Why is lightning hotter than the sun?"). Slugs differ (phase-4 uses slug-from-title). Both can coexist.

---

## 9. Suggested Git Commit Message

```
feat: content expansion, difficulty calibration, and trail seeding

- 20 new topics across Science, History, Tech, Nature, Space, Psychology, Philosophy, Culture
- Difficulty spread: beginner, intermediate, advanced
- 14+ topic trails for intentional exploration
- Bonus questions on 4 topics
- Followups for ten-demo topics
```
