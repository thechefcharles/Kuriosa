# Core Loop Upgrade Architecture

Upgrade to the curiosity experience loop: multi-question support, retry, better feedback, and stronger completion.

---

## Multi-Question Model

### Structure

- **First question (required):** Must be answered correctly (or after retry) for completion.
- **Bonus question (optional):** Second quiz with `sort_order = 1` in `quizzes`. Grants bonus XP when correct.

### Data Model

- `LoadedCuriosityExperience.challenge` — primary quiz (sort_order 0).
- `LoadedCuriosityExperience.bonusChallenge` — optional second quiz (sort_order 1).
- Topics with a single quiz behave as before; `bonusChallenge` is `undefined`.

### Loading

`load-curiosity-experience.ts` loads up to two quizzes per topic, ordered by `sort_order`:

- First → `challenge`
- Second → `bonusChallenge`

No migration required; `quizzes` already supports multiple rows per topic.

---

## Retry Behavior

When the user answers incorrectly:

1. Show explanation and correct answer.
2. Show **Try again** as the primary action.
3. User retries the same question without XP penalty.
4. On correct after retry, completion is allowed; XP is granted as if answered correctly the first time.
5. Optional: Track `neededRetry` for future analytics (not yet persisted).

---

## XP Rules

| Grant                    | Constant              | When                                           |
|--------------------------|-----------------------|------------------------------------------------|
| Lesson                   | LESSON_COMPLETION_XP  | Lesson completed                               |
| Challenge                | CHALLENGE_COMPLETION_XP | Challenge attempted                          |
| Perfect (Q1 correct)     | PERFECT_CHALLENGE_BONUS_XP | Challenge correct                          |
| Bonus question           | BONUS_QUESTION_XP     | Bonus question attempted and correct           |
| Daily / Random / Listen  | (existing)            | (unchanged)                                    |

- Completion requires Q1 correct (including after retry).
- Bonus question is optional and does not block completion.
- No duplicate XP: each question contributes once.
- Bonus XP is only granted when the bonus question is answered correctly.

---

## Completion Logic

Completion is triggered when the user clicks **See what's next** (Continue):

1. **Required:** Q1 answered correctly (first try or after retry).
2. **Optional:** Bonus question may be attempted; result is recorded in `bonusCorrect`.
3. Payload: `challengeCorrect: true`, `bonusCorrect?: boolean`.
4. The bonus question never blocks completion; users can skip it.

---

## Extending Questions Later

To add more questions or change behavior:

1. **More than two quizzes:** Extend the loader to read further `sort_order` values and add fields (e.g. `challenge2`, `challenge3`).
2. **Different XP per question:** Add constants and adjust `calculate-rewards.ts`.
3. **Retry limits:** Add state for retry count and cap attempts before showing the correct answer and allowing continue.
4. **Analytics:** Persist `neededRetry`, `bonusAttempted`, etc. in `user_topic_history` or an analytics table.

---

## UI Flow Summary

1. **Q1:** Show question → submit → feedback (correct/wrong).
2. **Wrong:** Show explanation, lesson snippet (“From the lesson”), **Try again**, **Continue**.
3. **Correct + no bonus:** Show success → **Continue**.
4. **Correct + bonus exists:** Show success → “Want a quick bonus question?” → **Try bonus** | **Continue**.
5. **Q2 (bonus):** Same pattern; correct → **Continue** (with `bonusCorrect`); wrong → **Try again** | **Continue**.

---

## Backward Compatibility

- Topics with one quiz work unchanged.
- No DB schema changes; existing `quizzes` rows suffice.
- `bonusChallenge` is optional; all callers handle its absence.
