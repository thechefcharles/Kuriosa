# Phase 6 — Progress system inventory

Beginner-friendly map of everything Phase 6 built.

## 1. Reward model (6.1)

- **XP** from **`calculateRewards`** (`src/lib/progress/calculate-rewards.ts`): lesson, challenge, perfect, daily, random, listen bonuses.
- **Levels** from **`getLevelFromXP`** / **`level-config.ts`** (cumulative XP thresholds).
- **Streaks** from **`calculateNextStreak`** (`streak-utils.ts`): UTC calendar days; same day = no second bump.
- **Curiosity score** from **`calculateCuriosityScore`** after completion (topics, accuracy, categories, streak).

## 2. Completion processor (6.2)

- **`processCuriosityCompletion`** (`process-curiosity-completion.ts`): validates topic+slug, claims **one XP grant per (user, topic)** via **`rewards_granted`** on **`user_topic_history`**. Repeat visits update metadata only (no extra XP). Profile revert on failure reopens the claim for retry.
- **API:** `POST /api/progress/complete-curiosity` (session user).

## 3. Badges (6.3)

- **`badge-rules.ts`** interprets **`badges.criteria_type`** / **`criteria_value`**.
- **`evaluateBadgeEligibility`** + **`unlockBadges`** → **`user_badges`** (idempotent, unique user+badge).
- Runs after a **new** XP grant inside the processor. Result includes **`unlockedBadges`**.

## 4. Progress read layer (6.4)

- View models: **`src/types/progress-view.ts`**.
- Services: **`getUserProgressSummary`**, **`getUserBadges`**, **`getUserProfileProgress`**, **`getUserProgressStats`** (+ rewarded-history helper).
- Hooks: **`useUserProgressSummary`**, **`useUserBadges`**, **`useUserProgressStats`**, **`useUserProfileProgress`**, **`useAuthUserId`**.
- **`invalidateProgressQueries`** on successful completion.

## 5. Progress UI (6.5)

- **`/progress`**: dashboard (hero, streak, stats, badge grid).
- **`/profile`**: identity + level/score/streak + recent badges.
- No XP math in components — data from hooks only.

## 6. Completion celebration

- **sessionStorage** handoff: **`stashCompletionCelebration`** (on Continue when new XP or new badges) → **`consumeCompletionCelebration(slug)`** on **`#whats-next`**.
- **6.6:** **15-minute TTL**, strict JSON validation, malformed/expired payloads cleared. Refresh after consume = no duplicate card.

## 7. Edge-case protections (stable)

| Case | Behavior |
|------|----------|
| Same topic again | No double XP; **`rewards_granted`** gate |
| Duplicate API calls | One claim wins |
| Same day, second **new** topic | Streak unchanged second time |
| Badges | No duplicate rows (DB + evaluator) |
| Session expired | Friendly error copy (**`friendlyProgressLoadError`**) |

## 8. Key files (quick reference)

| Area | Path |
|------|------|
| Processor | `src/lib/services/progress/process-curiosity-completion.ts` |
| Badges | `src/lib/progress/badge-rules.ts`, `evaluate-badge-eligibility.ts`, `unlock-badges.ts` |
| Progress reads | `src/lib/services/progress/get-user-*.ts` |
| Hooks | `src/hooks/queries/useUser*.ts` |
| Dashboard | `src/components/progress/progress-dashboard.tsx` |
| Celebration storage | `src/lib/progress/completion-celebration-storage.ts` |
