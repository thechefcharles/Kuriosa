# Reward and Progression Polish

Phase P1.4 — Completion experience, level curve, badges, curiosity score clarity, and micro-feedback.

---

## XP Changes

No changes to XP amounts. Current values remain:

| Source | XP |
|--------|-----|
| Lesson completion | 10 |
| Challenge completion | 20 |
| Perfect run bonus | 10 |
| Bonus question | 10 |
| Daily feature | 5 |
| Random spin | 5 |
| Listen mode | 3 |

**Max per topic:** ~50 (lesson + challenge + perfect + bonus) plus situational bonuses (daily, random, listen).

---

## Level Curve Decisions

**Previous:** `100 × L^1.35`

**Updated:** `100 × L^1.30`

The exponent was reduced from 1.35 to 1.30 to slightly smooth mid-level progression and reduce stagnation. Early levels stay fast; levels 5–15 require slightly less cumulative XP per tier.

| Level | XP to advance (before) | XP to advance (after) |
|-------|------------------------|------------------------|
| 1 → 2 | 100 | 100 |
| 2 → 3 | 234 | 246 |
| 5 → 6 | 669 | 699 |
| 10 → 11 | 1,778 | 1,995 |

---

## Badge System Improvements

### Renamed Badges (more distinctive, less generic)

| Slug | Before | After |
|------|--------|-------|
| first-step | First Step | First Curiosity |
| curious-mind | Curious Mind | Curiosity Seeker |
| explorer | Explorer | Trail Blazer |
| week-warrior | Week Warrior | Week of Wonder |
| dedicated | Dedicated | Steady Flame |
| category-scout | Category Scout | Category Explorer |
| challenge-accepted | Challenge Accepted | Quiz Starter |
| quiz-champion | Quiz Champion | Quiz Ace |

### Descriptions Updated

- **First Curiosity** — "Completed your very first lesson"
- **Curiosity Seeker** — "Completed 5 lessons"
- **Trail Blazer** — "Completed 10 lessons"
- **Week of Wonder** — "7-day streak — curiosity every day"
- **Steady Flame** — "30-day streak — dedication pays off"
- **Category Explorer** — "Explored 3 different categories"
- **Quiz Starter** — "Completed your first quiz challenge"
- **Quiz Ace** — "Scored 100% on 5 quizzes"
- **Random Rover** — "Completed 5 discoveries from the random spin"
- **Science Regular** — "Completed 5 topics in Science"

Slugs unchanged for compatibility with `user_badges`.

---

## Completion UX Changes

### Success Copy

- **Headline:** "You earned it" → "Nice work"
- **Subline:** "Here's what changed." → "Here's what you earned."

### XP Breakdown

- Added `breakdown` to `CompletionCelebrationPayload`
- Completion card now shows per-source XP (lesson, challenge, perfect run, bonus question, daily feature, spin discovery, listen mode)
- Bonus sources (perfect, bonus question, daily, random, listen) highlighted in accent color

### Streak Feedback

- Copy: "X day streak — keep it going"

### Badge Display

- Badges in completion card now show description (why earned)
- Format: `Badge Name — description`

---

## Curiosity Score Clarity

Added a toggleable explanation in the progress hero:

- **What contributes:** Topics completed, quiz accuracy, variety of categories, streak
- **Why it matters:** "A simple way to see your learning journey — not a competition"
- **Interaction:** Click the help icon (?) next to curiosity score to expand/collapse

---

## Micro-Feedback During Flow

### Correct Answer (main challenge)

- Existing: "Nice — you've got it."
- Added: "Earn XP when you see what's next" (subtle reinforcement)

### Bonus Completion

- When user completes bonus and gets it right: "Bonus complete — +10 XP" (emerald accent)

---

## Tone Alignment

- **Curious, calm, rewarding, non-competitive**
- Avoided: aggressive gamification, loud animations, pressure-based mechanics
- Copy remains supportive, not gamey
