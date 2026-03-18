# Phase 4 Handoff to Phase 5 (UI)

Phase 4 built the **content engine** and internal tooling. Phase 5 can now focus on the user-facing curiosity loop using real, persisted content.

## What Phase 4 completed

- Canonical `CuriosityExperience` type + Zod validation
- AI generators for: topic ideas, lessons, challenges, follow-ups, trails, audio scripts
- Draft assembly into canonical `CuriosityExperience`
- Persistence of canonical drafts into normalized Supabase tables
- Internal preview + workflow transitions (review/publish/reject/archive)
- Curated seed workflow for multi-category content population

## What real content exists in the database

After running the seed script, Supabase should contain:

- `topics` (upserted by slug)
- `topic_tags`
- `topic_followups`
- `quizzes` and `quiz_options`
- `topic_trails` (only for resolved targets; unresolved reported)

## What Phase 5 UI can rely on

- `topics.slug` is stable and is the primary lookup key for navigation.
- `topics.lesson_text`, `hook_text`, `estimated_minutes`, `difficulty_level`, `subcategory` are populated for seeded topics.
- Each seeded topic has at least one quiz row + options.
- Follow-ups are available in `topic_followups` ordered by `sort_order`.
- Trails exist when the destination topic has already been persisted; otherwise they can be omitted gracefully.

## What should not be casually changed before Phase 5

- `CuriosityExperience` field names and the mapping assumptions into normalized tables
- `topics.slug` semantics and slugify rules
- The persistence upsert-by-slug and “replace dependent rows” behavior
- Internal workflow allowlist guard (keep internal tools internal)

## Next phase

Phase 5 builds:

- Curiosity reading pages that render the real persisted content
- Challenge UI that consumes `quizzes` + `quiz_options`
- Discover/home experiences backed by real topic inventory

