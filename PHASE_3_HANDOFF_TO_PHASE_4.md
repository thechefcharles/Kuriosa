# Phase 3 Handoff to Phase 4

## What Phase 3 Completed

- **Database schema** — 13 tables for profiles, categories, topics, quizzes, user history, badges, etc.
- **Auth** — Sign up, sign in, sign out with Supabase Auth; session handling via middleware.
- **Profile bootstrapping** — Automatic profile row creation on signup (trigger).
- **RLS** — All tables protected; user-owned data is private; content is authenticated read-only.
- **Seed data** — Categories and badges; topics and quizzes not yet seeded.
- **Service layer** — getCurrentProfile, getCategories, getBadges, getDailyCuriosity, getTopicBySlug.

## Infrastructure Phase 4 Can Rely On

- **Auth** — Use `getCurrentUser()` or `getCurrentProfile()` from `src/lib/services/user/auth.ts` in server components/actions.
- **Supabase client** — Use `createSupabaseServerClient()` for server-side queries; use `createSupabaseBrowserClient()` for client.
- **Protected routes** — Middleware redirects unauthenticated users from `/home`, `/discover`, `/progress`, `/profile`, `/curiosity/*`, `/challenge/*`.
- **RLS** — Queries run with the user's session; RLS enforces row-level access automatically.

## Assumptions

- Content tables (categories, topics, quizzes, etc.) require authentication to read.
- Profile `id` = `auth.users.id`; profile is created by trigger on signup.
- Migrations have been applied; Supabase project is linked and env vars set.

## Do Not Casually Change in Phase 4

- **RLS policies** — Changing policies can break access or open security gaps. Add new policies, don't remove or relax existing ones without review.
- **Profile trigger** — Removing or altering it can break new-user signup.
- **Auth actions** — signUp, signIn, signOut are used by auth pages; extend, don't replace.
- **Middleware route protection** — Adding new app routes that need auth should be added to the `isAppProtected` check.

## Content Generation and the Schema

Phase 4 will add content generation. The current schema supports:

- **topics** — `lesson_text`, `hook_text`, `surprising_fact`, `real_world_relevance`, `status` (draft/published)
- **quizzes** — `quiz_type`, `question_text`, `explanation_text`; link to **quiz_options**
- **topic_followups** — Predefined Q&A per topic
- **daily_curiosity** — One topic per date; requires a topic row to exist

Content generation should:

1. Insert into `topics` with `status = 'draft'` (or `published` if ready).
2. Insert into `quizzes` and `quiz_options` for each topic.
3. Insert into `topic_followups` if needed.
4. Insert into `daily_curiosity` for featured dates (requires existing topic_id).

All inserts use the Supabase client; RLS allows no app writes to content tables. Use the **service role** or a backend/admin path for content writes, or add explicit RLS policies for a trusted "content creator" role if needed. (Phase 4 will define this.)
