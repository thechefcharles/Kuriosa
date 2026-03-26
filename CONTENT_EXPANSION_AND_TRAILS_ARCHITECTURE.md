# Content Expansion and Trails Architecture

Phase P1.3 — Content inventory, difficulty calibration, and trail seeding.

---

## How Topics Were Expanded

### Before (Ten Demo + Phase 4)

- **10 topics** in `ten-demo-curiosities.sql`: Science (4), History (2), Nature (2), Technology (2), Culture (1)
- All **beginner**, 4–5 min
- **No trails**, **no followups**, **no bonus questions**
- Phase 4 seed (AI-generated) can add up to 25 more, but requires `npm run seed:phase4` and API keys

### After (Content Expansion Migration)

- **+20 new topics** in `20260328120000_content_expansion_trails.sql`
- **30 total** published topics with ten-demo + expansion (or more if Phase 4 was run)

### New Topic Distribution

| Category      | New Topics |
|---------------|------------|
| Science       | 5 (why-sunset-red, how-rainbows-form, why-ice-floats, lightning-hotter-than-sun, what-is-ball-lightning) |
| History       | 2 (roman-concrete-lasts, library-alexandria) |
| Technology    | 5 (how-barcodes-work, why-computers-binary, software-bug-origin, how-gps-works) |
| Biology/Nature| 4 (how-bees-make-honey, how-spiders-walk-walls, why-whales-sing, how-trees-communicate) |
| Space         | 3 (dark-side-moon, astronauts-grow-taller-space, black-hole-event-horizon) |
| Psychology    | 2 (why-yawn-contagious, why-cant-tickle-self) |
| Philosophy    | 1 (what-is-paradox) |
| Culture       | 1 (untranslatable-words) |

---

## Difficulty Calibration

### Rules (Post-Refinement)

- **Beginner:** Simple, accessible, obvious payoff. 3–5 min. Straightforward quiz.
- **Intermediate:** Richer or more nuanced. 5–6 min. Trickier distractors.
- **Advanced:** Denser or conceptually tricky. 6–8 min.

### Distribution (Refinement Target: ~50% / ~35% / ~15%)

| Difficulty  | Count | Example |
|-------------|-------|---------|
| Beginner    | 15    | why-sky-blue, why-sunset-red, how-rainbows-form, why-ice-floats, do-trees-sleep |
| Intermediate| 10    | great-pyramid-age, lightning-hotter-than-sun, library-alexandria, how-gps-works |
| Advanced    | 5     | black-hole-event-horizon, roman-concrete-lasts, how-trees-communicate |

### Lesson Depth by Difficulty

- Beginner: ~150–220 words, one clear idea
- Intermediate: ~220–300 words, nuance or multiple angles
- Advanced: ~250–350 words, denser concepts

### estimatedMinutes Ranges

- Beginner: 3–5
- Intermediate: 5–6
- Advanced: 6–8

---

## How Trails Were Seeded

### Design Principles

- **Meaningful connections:** Trails link related concepts, not random topics
- **Multi-step chains:** Some paths form sequences (e.g., sky → sunset → rainbow)
- **Bidirectional where useful:** e.g., why-sunset-red ↔ why-sky-blue

### Trail Density

**Every topic has at least 1 outgoing trail** — no dead ends. Most have 2+.

### Trail Chains

1. **Sky / light**
   - why-sky-blue → why-sunset-red
   - why-sky-blue → how-rainbows-form
   - why-sunset-red → why-sky-blue
   - why-ice-floats → why-sky-blue

2. **Lightning**
   - lightning-hotter-than-sun → what-is-ball-lightning

3. **Tech**
   - what-is-qr-code → how-barcodes-work
   - why-computers-binary → software-bug-origin
   - how-gps-works → black-hole-event-horizon (relativity link)

4. **Honey / nature**
   - honey-lasts-forever → how-bees-make-honey
   - do-trees-sleep → how-trees-communicate

5. **History**
   - great-pyramid-age → roman-concrete-lasts

6. **Space**
   - dark-side-moon → astronauts-grow-taller-space
   - astronauts-grow-taller-space → black-hole-event-horizon

7. **Culture**
   - break-a-leg-theatre → untranslatable-words

---

## Categories Now Represented

| Slug            | Source      | Topics (approx) |
|-----------------|------------|------------------|
| science         | Core       | 6+ |
| history         | Core       | 4+ |
| nature          | Core       | 4+ |
| technology      | Core       | 6+ |
| culture         | Core       | 2+ |
| psychology      | Reference  | 2+ |
| space           | Reference  | 3+ |
| biology         | Reference  | 4+ |
| philosophy      | Reference  | 1+ |
| finance-economics | Reference | 0 (Phase 4) |

**Prerequisite:** Run `20250307130001_seed_reference_data.sql` (and optionally `20250318121000_seed_additional_phase4_categories.sql`) before the content expansion migration so Psychology, Space, Biology, Philosophy exist.

---

## How This Supports Discovery and Learning Depth

1. **Discover:** More topics per category; richer grids and search
2. **Category pages:** Each category has multiple topics; no empty states
3. **What’s next:** Trails give intentional “explore next” links after the challenge
4. **Challenge flow:** Bonus questions on selected topics add variety
5. **Progress:** More completions possible; streaks and badges feel more achievable
6. **AI exploration:** Followups and trails feed guided questions and rabbit-hole suggestions

---

## Bonus Questions

**Coverage:** 50–70% of topics (19 of 30 after refinement).

Topics with a **bonus quiz** (sort_order = 1):

- why-sky-blue, why-sunset-red, how-rainbows-form, why-ice-floats
- what-is-qr-code, how-barcodes-work, software-bug-origin
- lightning-hotter-than-sun, what-is-ball-lightning
- great-pyramid-age, do-trees-sleep, how-caffeine-works, printing-press-gutenberg
- why-cats-purr, cloud-computing-simple, honey-lasts-forever
- how-bees-make-honey, how-spiders-walk-walls
- dark-side-moon, why-yawn-contagious, why-cant-tickle-self

Bonus questions extend learning (not trivial repeats) and grant +10 XP when correct.

---

## Followups

Followups were added for ten-demo topics that had none:

- why-sky-blue
- great-pyramid-age
- do-trees-sleep
- what-is-qr-code
- break-a-leg-theatre

These support the “What’s next?” section and AI-guided exploration.

---

## Rabbit-Hole Alignment

AI rabbit-hole suggestions (Phase 9) are aligned with real topics:

1. **Prompt:** Available Kuriosa topic titles are passed to the AI; it prefers suggesting these when relevant.
2. **Post-processing:** Suggestion titles are matched to topics (normalized string comparison).
3. **UI:** When a match exists, `topicSlug` is set; tapping opens `/curiosity/{slug}` instead of asking the AI.

**Result:** Rabbit holes lead to actual content when possible, not only to AI-generated answers.
**Cache:** Existing cached suggestions still get post-processing; new generations benefit from the prompt hint.

---

## Extending Content Later

1. **Add topics:** Use the same INSERT pattern; reference categories by slug
2. **Add trails:** `INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)` with slug lookups
3. **Add bonus quizzes:** Insert a second row in `quizzes` with `sort_order = 1`
4. **Add followups:** Insert into `topic_followups` with `topic_id` from slug lookup
