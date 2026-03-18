# Challenge page architecture

## Route

- **`/challenge/[slug]`** — `src/app/(app)/challenge/[slug]/page.tsx`

The slug matches the curiosity topic (`topics.slug`). The page loads the same **`LoadedCuriosityExperience`** as the lesson view (via **`useCuriosityExperience(slug)`**).

## Screen flow

1. **Loading** → shared spinner.
2. **Error** (network / auth) → error message.
3. **Topic missing** (`null` from loader) → “Curiosity not found” + Home link.
4. **Topic exists but no `challenge`** (optional quiz omitted) → **Challenge empty state** with links back to lesson and Discover.
5. **Challenge present** → question UI → submit → **feedback** → retry or continue.

## Components

| Component | Role |
|-----------|------|
| **`ChallengeScreen`** | Orchestrates data hook, form state, submit, retry. |
| **`ChallengeCard`** | Question, type label (multiple choice / logic / memory recall / reasoning), difficulty hint. |
| **`ChallengeOptionList`** | Radio list for choice-based types. |
| **`ChallengeFeedback`** | Correct/incorrect tone, explanation, correct answer when wrong, **Try again** + **Continue**. |
| **`ChallengeEmptyState`** | No quiz on this topic. |
| **`ChallengeTopicMissing`** | Slug didn’t resolve to a topic. |

## Challenge types

| `quizType` (normalized) | UI | Validation |
|-------------------------|-----|------------|
| **`multiple_choice`**, **`logic`**, **`reasoning`** | Option list | Selected option’s **`isCorrect`**. |
| **`memory_recall`**, **`recall`** | Text area | Trim + **case-insensitive** match against **every option marked `isCorrect`** (supports multiple acceptable strings). |

Logic is treated like multiple choice in the UI; the **type label** still says “Logic”.

## Validation layer

- **`src/lib/services/challenge/validate-challenge-answer.ts`**
  - **`validateChallengeAnswer(challenge, input)`** → `{ isCorrect, explanation, correctAnswerDisplay, ... }`.
  - No DB access; pure functions, easy to test.

## Continue after the challenge

**Continue** links to **`/curiosity/[slug]#whats-next`**, where the lesson page shows **follow-up questions** (tap to reveal answers) and **trail cards** to related topics. See **`POST_CHALLENGE_EXPLORATION_ARCHITECTURE.md`**.

## Not built yet (5.7+)

- XP, streaks, persisted completion.
- Follow-up and trail UIs.
- Multi-question quizzes.
