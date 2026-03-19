# CuriosityExperience Content Model

## What Is a CuriosityExperience?

A **CuriosityExperience** is Kuriosa's canonical content object. It represents one curiosity topic—lesson, challenge, follow-ups, trails—in a form ready for the frontend to display. Every curiosity a user encounters is built from this structure.

## Why a Canonical Content Object?

- **Validation**: Zod schemas ensure AI-generated or migrated content is well-formed.
- **Consistency**: The same shape is used for display, caching, and analytics.
- **Normalized → assembled**: Database tables store content in normalized form (topics, quizzes, quiz_options, etc.). The app assembles that into a CuriosityExperience when serving a page.

## Major Sections

| Section | Purpose |
|---------|---------|
| **identity** | id, slug, title—core identifiers |
| **discoveryCard** | Hook question, short summary, estimated minutes—for browse/feeds |
| **taxonomy** | Category, subcategory, difficulty, tags |
| **lesson** | Main lesson text, surprising fact, real-world relevance |
| **audio** | Optional narration URL, transcript, duration |
| **challenge** | Quiz question, options, explanation |
| **rewards** | XP award, level hint |
| **followups** | Suggested follow-up Q&A |
| **trails** | Related topic recommendations |
| **progressionHooks** | Badges, next trail slugs |
| **moderation** | Review status, notes |
| **analytics** | Source type, generated-at, version |

## Connection to Database Tables

| CuriosityExperience section | Database source |
|-----------------------------|-----------------|
| identity, discoveryCard, lesson | topics |
| taxonomy | topics + categories + topic_tags |
| challenge | quizzes + quiz_options |
| followups | topic_followups |
| trails | topic_trails (joined with topics) |
| audio | topics.audio_url (and future transcript storage) |
| rewards | Derived / config |

## AI Generation Pipeline (Future)

The pipeline will produce intermediate types (`GeneratedLessonContent`, `GeneratedChallengeContent`, etc.) and assemble them into a `GeneratedCuriosityExperienceDraft`. After validation with Zod, it becomes a `CuriosityExperience` ready for storage and display.

## Frontend Consumption

The frontend receives a CuriosityExperience (e.g. from an API or server component). It renders the lesson, challenge, follow-ups, and trails without needing to know about the normalized DB schema.

## Files

- **Types**: `src/types/curiosity-experience.ts`
- **Generation types**: `src/types/content-generation.ts`
- **Zod schemas**: `src/lib/validations/curiosity-experience.ts`
- **Parse helpers**: `src/lib/validations/parse-curiosity-experience.ts`
- **Assembly placeholder**: `src/lib/services/content/assemble-curiosity-experience.ts`
- **Example fixture**: `src/lib/content/example-curiosity-experience.ts`
