# Phase 6 → Phase 7 handoff

## What Phase 6 completed

- **Server-validated** curiosity completion: XP, level, streak, curiosity score, **`user_topic_history`**, **`profiles`**.
- **Badges**: centralized rules, idempotent unlocks, tied to completion.
- **Client data layer**: typed progress views + React Query + invalidation on completion.
- **UX**: Progress dashboard, Profile progress hub, completion celebration (lightweight).

Phase 7 (discovery / exploration) can assume:

1. **Completing** a curiosity through the challenge flow **updates progress** reliably for signed-in users.
2. **`/progress`** and **`/profile`** reflect **total XP, level, streak, score, badges, topic counts** from the same DB truth.
3. **Repeat completion** on the same topic does **not** re-grant XP or duplicate badges.
4. **Daily streak** logic is **UTC day–based**; don’t “fix” streaks client-side without changing **`calculateNextStreak`** and the processor together.

## What Phase 7 can rely on

- **Topic discovery** (daily, random, categories) can pass **`wasDailyFeature` / `wasRandomSpin`** into completion — bonuses already in **`calculateRewards`**.
- **Navigation** after challenge → curiosity **`#whats-next`** is the natural place for follow-up UX; celebration already lands there.
- **Progress hooks** can power future discovery CTAs (“one more topic to level up”) without new backend reads beyond existing services.

## What not to change casually

- **`processCuriosityCompletion`** claim order (history before profile).
- **`rewards_granted`** semantics.
- **`badge-rules.ts`** criteria mapping without matching **DB seeds**.
- **Level curve** in **`level-config.ts`** without migrating user expectations.

## Suggested Phase 7 focus

- Richer **Discover** experience, trails, category browsing — **without** duplicating completion or reward logic on the client.
