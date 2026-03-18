# Phase 5 — Core UX inventory

Beginner-friendly map of everything shipped in Phase 5 (prompts 5.1–5.8).

## Data loading (5.1)

- **`LoadedCuriosityExperience`** — topic + tags + follow-ups + quiz + trails; **`challenge`** optional.
- **Services**: `loadCuriosityExperience`, `getDailyCuriosity`, `getRandomCuriosity`.
- **Hooks**: `useDailyCuriosity`, `useRandomCuriosity`, `useCuriosityExperience`.
- **Query keys**: `src/lib/query/query-keys.ts`.

## Home (5.2)

- **`/home`** — hero, **Today’s curiosity** card (`useDailyCuriosity`), **Take the challenge** path via daily slug.
- **Components**: `HomeScreen`, `DailyCuriosityCard`, shared loading/empty/error.

## Feed my curiosity (5.3)

- **Random** published topic → **`/curiosity/[slug]`**.
- **`FeedMyCuriosityButton`** + **`useFeedRandomCuriosity`** mutation.
- Repeat avoidance + optional difficulty pills.
- Sets **session discovery context** (`was_random_spin`) for completion (5.8).

## Curiosity lesson page (5.4)

- **`/curiosity/[slug]`** — Read / Listen toggle, lesson typography, **`#whats-next`** region.
- **Components**: `CuriosityExperienceScreen`, header, lesson content, mode toggle, next-step CTA to challenge.

## Listen mode + audio (5.5)

- **`AudioPlayer`** — play/pause, ±10s, scrubber, times, errors.
- **`AUDIO_PLAYER_ARCHITECTURE.md`**.

## Challenge (5.6)

- **`/challenge/[slug]`** — multiple choice / logic / reasoning / memory recall.
- **Validation**: `validate-challenge-answer.ts`.
- **Feedback** + **Try again** + **Continue exploring** (records completion in 5.8).

## Post-challenge exploration (5.7)

- **`#whats-next`** — follow-up Q&A (expand answers), **trail cards** → other curiosities.
- **`POST_CHALLENGE_EXPLORATION_ARCHITECTURE.md`**.

## Completion + polish (5.8)

- **Trigger**: User taps **Continue exploring** after submitting the challenge → **`user_topic_history`** upsert (same user + topic).
- **Fields**: `completed_at`, `mode_used` (`read` / `listen` / `read_listen`), `quiz_score` (100 correct / 0 incorrect), `xp_earned` (0), `was_daily_feature`, `was_random_spin`.
- **Session**: How they opened the topic (daily card, random spin, browse/trail) + whether they used Listen.
- **Failure**: User still navigates to **`#whats-next`**; subtle “didn’t sync” copy if save fails.
- **Polish**: Friendlier **ErrorState**, Discover **Open curiosity** links, post-challenge copy.

## Loading / error patterns

- **Home / Discover / Curiosity / Challenge**: React Query loading; **ErrorState** + **EmptyState** where relevant.
- Auth required for content (RLS).

## Not in Phase 5

- XP, streaks, badges, Progress screen UI, personalization, AI ask-a-question, global audio player.
