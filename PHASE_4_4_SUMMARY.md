# Phase 4.4 Summary

## What this prompt implemented

- **Challenge prompts** — `challenge-prompts.ts` with topic, category, difficulty, lesson context, desired types, tags, audience.
- **Types** — `GeneratedQuizOption`, `GeneratedPrimaryQuiz`, `GeneratedBonusQuestion`, `GeneratedChallengeRequestOptions`, `GeneratedChallengeContent`, plus `primaryQuizToCuriosityOptions()`.
- **Zod** — `generated-challenge.ts` (primary/bonus unions, four-option rules, memory_recall fields, XP hints).
- **Parser** — `challenge-parser.ts`.
- **Generator** — `generate-challenge.ts` → `generateChallenge(options)`.
- **Example** — `run-challenge-generation-example.ts`, `npm run ai:challenge`.
- **Docs** — `CHALLENGE_GENERATION.md`.

## Challenge generation foundation now exists

- One API call returns a **typed, validated** `{ primary, bonus, primaryXpAward?, bonusXpAward? }` aligned with post-lesson quiz + bonus recall/MC.
- Matches the **4.2 / 4.3** folder pattern.

## What remains in Phase 4

- Follow-up generation, trails, audio scripts
- Full `CuriosityExperience` assembly (including how bonus + memory_recall map to DB)
- DB writes, admin UI, public routes

## Manual setup before 4.5

1. `OPENAI_API_KEY` in `.env.local`
2. Run `npm run ai:challenge` to confirm validation passes end-to-end
