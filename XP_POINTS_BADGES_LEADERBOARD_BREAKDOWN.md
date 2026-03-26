# XP, Points, Badges & Leaderboard — Complete Breakdown

A detailed guide to how Kuriosa's gamification and social systems work.

---

## 1. XP (Experience Points)

### What It Is
**XP** is the primary numeric currency for progress. There is **no separate "points"** system — XP is the only tracked numeric reward.

### How XP Is Earned

XP is granted **once per topic per user** — when you complete a curiosity for the first time and it counts as a "rewarded completion." Replaying the same topic does **not** grant more XP.

| Source | XP Amount | Condition |
|--------|-----------|-----------|
| **Lesson** | 10 | Lesson completed |
| **Challenge** | 20 | Challenge attempted (regardless of correctness) |
| **Perfect run bonus** | 10 | Challenge answered correctly |
| **Bonus question** | 10 | Bonus (second) question answered correctly |
| **Daily feature bonus** | 5 | Topic was today's daily pick |
| **Random spin bonus** | 5 | Topic was chosen via "Feed my curiosity" |
| **Listen mode bonus** | 3 | Used audio/narration (read_listen or listen only) |

**Config:** `src/lib/progress/xp-config.ts`

**Max per topic:** ~63 XP (lesson + challenge + perfect + bonus question + daily + random + listen)

### Where XP Lives

- **`profiles.total_xp`** — lifetime total, used for level
- **`user_topic_history.xp_earned`** — XP granted for that specific completion (only when `rewards_granted = true`)

### First vs Repeat Completions

- **First completion (rewards_granted = false → true):** Full XP calculated, added to profile, history row updated
- **Repeat completion (rewards_granted already true):** No new XP; only metadata updated (visit time, quiz result, modes). Completion celebration shows "Saved" instead of XP breakdown.

---

## 2. Levels

### How Levels Work

Level is **derived from total XP** — not stored as a separate progression table.

| Level | Cumulative XP needed |
|-------|----------------------|
| 1 | 0 (start) |
| 2 | 100 |
| 3 | ~235 |
| 4+ | Grows with formula |

**Formula:** `BASE_XP_PER_TIER * level^1.30` per tier. Level 1 → 2 = 100 XP, then each tier requires more.

**Config:** `src/lib/progress/level-config.ts`

- `getLevelFromXP(totalXp)` — returns current level
- `xpRequiredToAdvanceFromLevel(level)` — XP needed for that tier
- `getXPForNextLevel(totalXp)` — XP remaining to next level

### Where Level Is Shown

- Progress page hero card
- Level progress bar (XP into current level / XP required)
- Completion celebration ("Level up! Now level X")
- Public profile stats

---

## 3. Curiosity Score

### What It Is

A **composite score** (0+) that reflects overall engagement quality — not just raw XP. Used for **all-time leaderboard ranking** and profile display.

### Formula

```
score = (topicsCompleted × 12) + (accuracyRatio × 40) + (distinctCategories × 8) + (streakLength × 3)
```

- **topicsCompleted** — count of rewarded completions
- **accuracyRatio** — 0–1, correct challenges / attempted challenges
- **distinctCategories** — number of unique categories explored
- **streakLength** — current streak (not longest)

**Config:** `src/lib/progress/curiosity-score.ts`

### Where It Lives

- **`profiles.curiosity_score`** — updated on each new rewarded completion

---

## 4. Streaks

### Rules

- **UTC calendar days** — activity on the same UTC day does not increment streak
- **Yesterday → today** — if last activity was yesterday, streak +1
- **Gap** — if last activity was 2+ days ago, streak resets to 1

### Fields

- **`profiles.current_streak`** — active streak
- **`profiles.longest_streak`** — all-time best
- **`profiles.last_active_date`** — UTC date string (YYYY-MM-DD)

**Logic:** `src/lib/progress/streak-utils.ts`

### Badge Eligibility

Both `current_streak` and `longest_streak` can satisfy streak badges (e.g. "7-day streak" if either ≥ 7).

---

## 5. Badges

### What They Are

Achievement-style unlocks. Each badge has:

- **slug** — stable identifier
- **name** — display name
- **description** — optional
- **criteria_type** — what to measure
- **criteria_value** — threshold or structured string

### Criteria Types

| Type | criteria_value | Meaning |
|------|----------------|---------|
| `lessons_completed` | e.g. `1`, `5`, `10` | Rewarded completions ≥ N |
| `streak` | e.g. `7`, `30` | current_streak or longest_streak ≥ N |
| `categories_explored` | e.g. `3` | Distinct categories ≥ N |
| `quizzes_completed` | e.g. `1` | Completions with challenge answered ≥ N |
| `quiz_perfect_scores` | e.g. `5` | Completions with challenge_correct = true ≥ N |
| `random_completions` | e.g. `5` | Completions with was_random_spin ≥ N |
| `category_completions` | e.g. `science:5` | Completions in category `science` ≥ 5 |

**Logic:** `src/lib/progress/badge-rules.ts`

### Seed Badges (from migrations)

| Slug | Name | Criteria |
|------|------|----------|
| first-step | First Curiosity | 1 lesson |
| curious-mind | Curiosity Seeker | 5 lessons |
| explorer | Trail Blazer | 10 lessons |
| week-warrior | Week of Wonder | 7-day streak |
| dedicated | Steady Flame | 30-day streak |
| category-scout | Category Explorer | 3 categories |
| challenge-accepted | Quiz Starter | 1 quiz completed |
| quiz-champion | Quiz Ace | 5 perfect quizzes |
| random-rover | Random Rover | 5 random spin completions |
| science-regular | Science Regular | 5 Science topics |

### Unlock Flow

1. User completes a curiosity → XP granted (first time)
2. `processCuriosityCompletion` calls `applyCompletionBadgeUnlocks`
3. `evaluateBadgeEligibility` builds context (topics, streak, categories, etc.) and checks each badge definition
4. `unlockBadges` inserts into `user_badges` for newly eligible badges
5. Response includes `unlockedBadges` for celebration UI

**Tables:** `badges` (definitions), `user_badges` (user_id, badge_id, earned_at)

**Important:** Badge evaluation runs **only on new rewarded completions**. Replays do not trigger it.

---

## 6. Leaderboard

### Windows

| Window | Period | Score |
|--------|--------|-------|
| **Weekly** | Mon 00:00 UTC – Sun 23:59 UTC | Sum of `xp_earned` in window |
| **Monthly** | 1st 00:00 UTC – last day 23:59 UTC | Sum of `xp_earned` in window |
| **All-time** | Epoch → now | `curiosity_score` (primary), then total_xp, topics explored |

### Eligibility

User must have:

- `profiles.is_public_profile = true`
- `profiles.allow_leaderboard = true`

For weekly/monthly: at least one rewarded completion in the window.  
For all-time: at least one of curiosity_score > 0, total_xp > 0, or topics explored > 0.

### Ranking

- **Weekly/Monthly:** Sort by XP earned in window descending; tie-break by completion count
- **All-time:** Sort by curiosity_score, then total_xp, then topics explored, then display name

### APIs

- `GET /api/social/leaderboard?window=weekly` — ranked list
- `GET /api/social/leaderboard/position?window=weekly` — current user's rank (requires auth)

**Files:** `src/lib/services/social/get-leaderboard.ts`, `leaderboard-window.ts`

---

## 7. Session Arc (UI-Only)

### Session Completion Count

- **sessionStorage** — counts completions in the current browser session (date-scoped)
- Incremented when `wasCountedAsNewCompletion` is true
- Used in completion celebration: "You're on a roll" (2nd) or "X curiosities explored today" (3+)

**Not persisted** — resets when tab closes or date changes.

**File:** `src/lib/progress/session-completion-tracker.ts`

---

## 8. Completion Flow (End-to-End)

1. User finishes challenge → taps **See what's next**
2. `ChallengeContinueExploringButton` calls `useRecordCuriosityCompletion` → `POST /api/progress/complete-curiosity`
3. Payload: `topicId`, `slug`, `modeUsed`, `challengeCorrect`, `bonusCorrect`, `wasDailyFeature`, `wasRandomSpin`
4. API runs `processCuriosityCompletion`:
   - Checks if topic already rewarded
   - If not: calculates XP, updates history (rewards_granted, xp_earned), updates profile (total_xp, level, curiosity_score, streak), runs badge evaluation, records activity events
   - If yes: updates history metadata only
5. Response includes: `xpEarned`, `levelBefore/After`, `streakBefore/After`, `curiosityScoreBefore/After`, `breakdown`, `unlockedBadges`
6. Client stashes celebration in `completion-celebration-storage` and navigates to curiosity page
7. `CompletionCelebrationHost` reads stash and shows `CompletionCelebrationCard`

---

## 9. Activity Events

On completion, `recordActivityEvent` is called (fire-and-forget) for:

- `topic_completed` — always
- `level_up` — when level increased
- `badge_unlocked` — for each new badge

**Table:** `activity_events` — used for activity feed and analytics.

---

## 10. Key Files Reference

| Area | Files |
|------|-------|
| XP amounts | `xp-config.ts` |
| Level curve | `level-config.ts` |
| Reward calc | `calculate-rewards.ts` |
| Curiosity score | `curiosity-score.ts` |
| Streaks | `streak-utils.ts` |
| Badge rules | `badge-rules.ts` |
| Badge eval | `evaluate-badge-eligibility.ts` |
| Badge unlock | `unlock-badges.ts`, `apply-completion-badges.ts` |
| Completion processor | `process-curiosity-completion.ts` |
| Leaderboard | `get-leaderboard.ts`, `leaderboard-window.ts` |
| API | `complete-curiosity/route.ts` |
| UI | `completion-celebration-card.tsx`, `progress-hero-card.tsx`, `leaderboard-screen.tsx`, `profile-stats.tsx` |

---

## 11. What "Points" Means

There is **no separate points system**. When the UI says "points" or "score":

- **XP** — the numeric reward per completion
- **Curiosity score** — composite for all-time leaderboard and profile
- **Leaderboard score** — weekly/monthly = XP in window; all-time = curiosity score

---

## 12. Privacy & Visibility

- **Leaderboard:** Only users with `allow_leaderboard = true` and `is_public_profile = true` appear
- **Public profile:** Shows curiosity score, level, topics explored, badges — if profile is public
- **Activity feed:** Driven by `activity_events`; respects `allow_activity_feed`
