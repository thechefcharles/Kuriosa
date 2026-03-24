# XP, Badges & Daily Multiplier Overhaul

Design document for the quiz-first XP system, shared daily multiplier, and curiosity-journey badge architecture.

---

## 1. New XP System

### Base XP by difficulty (correct answer only)

| Difficulty   | XP  |
|-------------|-----|
| Beginner/Easy | 10 |
| Intermediate | 20 |
| Advanced     | 30 |
| Expert       | 40 |

### Wrong answer

- **5 XP** participation (consolation)
- Answer is revealed; optional retry for learning only
- Retry gives **no extra XP** (no farming)

### Bonus question

- **+10 XP** flat when answered correctly
- No multiplier applied
- Wrong bonus = 0 extra XP

### Daily multiplier

- Shared per day for all users (stored in `daily_curiosity.daily_multiplier`)
- Target range: **1.2, 1.5, 1.8, 2.0, 2.5**
- Applied only when topic is today's daily feature
- Final XP = `round(base XP × multiplier)`, capped at 150 per completion

### Removed XP sources

- Lesson completion
- First-try bonus
- Listen mode
- Random spin
- Daily flat bonus
- Streak bonuses

---

## 2. Daily Multiplier Design

- **One value per calendar day** (UTC)
- **All users** get the same multiplier that day
- Stored in `daily_curiosity.daily_multiplier` (default 1.5)
- Fetched by `getDailyMultiplier(supabase, dateISO)` when processing completion

### Choosing the daily multiplier

Recommended: deterministic from date (e.g. hash of date → index into [1.2, 1.5, 1.8, 2.0, 2.5]) so it's reproducible. Alternatively:

- Cron job or seed script sets it when inserting/updating `daily_curiosity`
- Manual override via admin tool
- Random choice at daily-creation time (persist result)

---

## 3. Category XP Design

- Table: `user_category_xp` (user_id, category_id, total_xp)
- Updated whenever a topic completion earns XP (correct or wrong)
- Used for **category milestone badges** (e.g. Science Explorer at 50 XP)
- No separate category leveling UI — badges are the milestones

---

## 4. Streak Logic

### Participation streak (unchanged)

- `current_streak`, `longest_streak`
- Based on **days in a row** with any completion
- Same UTC rules as before

### Correct streak (new)

- `correct_streak` — consecutive correct main quiz answers
- `longest_correct_streak` — all-time best
- Resets to 0 on wrong answer
- Used for "On a Roll", "Locked In", etc.

---

## 5. Badge System Redesign

### A. Global XP progression

| XP   | Badge            |
|------|------------------|
| 10   | First Spark      |
| 50   | Getting Curious  |
| 150  | On the Path      |
| 400  | Deepening        |
| 1000 | In the Flow      |
| 2500 | Sharpened Mind   |
| 5000 | Curiosity Engine |
| 10000| Endless Curious  |

### B. Participation streak

| Days | Badge              |
|------|--------------------|
| 7    | Week of Curiosity  |
| 14   | Building Momentum  |
| 30   | Steady Mind        |
| 100  | Always Curious     |

### C. Correct streak

| In a row | Badge       |
|----------|-------------|
| 3        | On a Roll   |
| 5        | Locked In   |
| 10       | Unshakable  |
| 20       | Flawless Run|

### D. Category breadth

| Categories | Badge    |
|------------|----------|
| 3          | Explorer |
| 5          | Wide Mind|
| 8 (all)    | Polymath |

### E. Special

- **Lucky Spin** — hit 2.5× daily multiplier
- **Comeback Trail** — return after 7+ inactive days

---

## 6. Leaderboard / Score Decisions

- **curiosity_score** — kept for now; secondary to total XP
- **All-time leaderboard** — still uses curiosity_score as primary; total_xp as tie-breaker
- **Weekly/monthly** — XP earned in window (unchanged)

---

## 7. What Changed

| Before                          | After                                   |
|---------------------------------|-----------------------------------------|
| Lesson + challenge + bonuses    | Quiz outcome only (correct/wrong)       |
| Fixed 1.5× daily                | Shared per-day multiplier (1.2–2.5)     |
| First-try bonus                 | Removed                                 |
| No category XP                  | `user_category_xp` tracked              |
| Participation streak only       | + correct streak                        |
| Academic badge names            | Curiosity-journey names                 |
| Many XP sources                 | Single primary source (quiz) + bonus    |

---

## 8. Files Touched

- `xp-config.ts` — new constants, `getBaseXpFromDifficulty`
- `calculate-rewards.ts` — quiz-first logic
- `process-curiosity-completion.ts` — daily mult, category XP, correct streak
- `get-daily-multiplier.ts` — new helper
- `streak-utils.ts` — `calculateNextCorrectStreak`
- `badge-rules.ts` — new criteria: total_xp, correct_streak, category_xp, daily_multiplier_hit
- `evaluate-badge-eligibility.ts` — context includes totalXp, correctStreak, categoryXpBySlug
- `apply-completion-badges.ts` — passes hitLuckyMultiplier
- Migrations: `20260318120000`, `20260318120001`
