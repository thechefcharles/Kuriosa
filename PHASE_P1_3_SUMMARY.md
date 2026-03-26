# Phase P1.3 — Content Expansion and Trails Summary

## Overview

Content inventory expansion, difficulty calibration, trail seeding, and a refinement pass to make Kuriosa feel richer, smarter, and more alive.

---

## 1. Summary of Changes

### Content Inventory

- **20 new topics** added via migration
- Spread across Science, History, Technology, Nature/Biology, Space, Psychology, Philosophy, Culture
- Each with lesson, hook, surprising fact, real-world relevance, quiz, and difficulty

### Difficulty Calibration (Refinement Pass)

- **~50% beginner (15):** 3–5 min, simple concepts, clear payoff
- **~35% intermediate (10):** 5–6 min, richer nuance, trickier distractors
- **~15% advanced (5):** 6–8 min, denser concepts

### Trail Seeding

- **Every topic has 1+ outgoing trail** — no dead ends
- 30+ trail links; multi-step chains (e.g., sky → sunset → rainbow → sky)
- "What's next?" feels intentional

### Bonus Questions (Refinement Pass)

- **19 topics** (50–70% coverage) have a bonus quiz
- Bonus questions extend learning, not trivial repeats
- +10 XP when correct

### Rabbit-Hole Alignment (Refinement Pass)

- AI suggestions prefer real topic titles when relevant
- Post-processing matches suggestions to topics
- When matched, tapping opens the topic (no AI call)

---

## 2. Content Inventory Changes

| Before     | After            |
|-----------|------------------|
| 10 topics | 30 topics        |
| All beginner | ~50% beginner, ~35% intermediate, ~15% advanced |
| No trails | 30+ trail links; every topic has 1+ outgoing |
| No followups (ten-demo) | Followups on 5 demo topics |
| No bonus questions | 19 topics with bonus (50–70%) |

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
- `supabase/migrations/20260328130000_content_refinement_pass.sql` — difficulty rebalance, bonus expansion, trail density
- `CONTENT_EXPANSION_AND_TRAILS_ARCHITECTURE.md`
- `PHASE_P1_3_SUMMARY.md`

### Modified

- `supabase/seeds/README_TEN_DEMO.md` — note about content expansion migration
- `src/types/ai.ts` — `topicSlug` on `TopicRabbitHoleItem`; `availableTopicTitles` on rabbit-hole input
- `src/lib/ai/prompts/rabbit-hole-prompt.ts` — include available topics when provided
- `src/lib/services/ai/get-topic-rabbit-holes.ts` — fetch topics, pass to prompt, match suggestions
- `src/components/ai/ai-exploration-block.tsx` — navigate to topic when `topicSlug` present

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
feat: content refinement — difficulty rebalance, bonus coverage, trail density, rabbit-hole alignment

- ~50/35/15% beginner/intermediate/advanced
- 19 topics with bonus questions (50–70% coverage)
- Every topic has 1+ outgoing trail
- Rabbit holes aligned with real topics (prompt + matching + link)
- estimatedMinutes: 3–5 / 5–6 / 6–8
```
