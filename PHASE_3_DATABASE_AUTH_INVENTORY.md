# Phase 3 Database & Auth Inventory

## Tables

| Table | Purpose | RLS |
|-------|---------|-----|
| profiles | User identity and progress | SELECT, UPDATE own row |
| categories | Curiosity categories | SELECT (authenticated) |
| topics | Curiosity lessons | SELECT (authenticated) |
| topic_tags | Topic tags | SELECT (authenticated) |
| topic_followups | Predefined follow-up Q&A | SELECT (authenticated) |
| topic_trails | Topic recommendations | SELECT (authenticated) |
| quizzes | Challenge questions | SELECT (authenticated) |
| quiz_options | Quiz answers | SELECT (authenticated) |
| daily_curiosity | Daily featured topic | SELECT (authenticated) |
| user_topic_history | User completion tracking | ALL (own rows) |
| user_followup_questions | User Q&A | ALL (own rows) |
| badges | Badge definitions | SELECT (authenticated) |
| user_badges | Badge unlocks | ALL (own rows) |

## Migrations (in order)

1. `20250307120000_create_core_schema.sql` — Tables, indexes, constraints
2. `20250307120001_seed_categories_and_badges.sql` — Initial categories and badges
3. `20250307120002_create_profile_trigger.sql` — Profile bootstrapping on signup
4. `20250307130000_enable_rls.sql` — RLS policies
5. `20250307130001_seed_reference_data.sql` — Extended categories and badges

## Auth Routes / Pages

| Route | Purpose |
|-------|---------|
| `/auth/sign-in` | Email/password sign in |
| `/auth/sign-up` | Email/password sign up |

## Protected Routes

`/home`, `/discover`, `/progress`, `/profile`, `/curiosity/[slug]`, `/challenge/[slug]` — require auth; redirect to `/auth/sign-in` if not authenticated.

## Profile Bootstrapping

Trigger `on_auth_user_created` runs `AFTER INSERT ON auth.users`, inserts into `profiles` with `id = NEW.id`. Function `handle_new_user()` uses `ON CONFLICT (id) DO NOTHING`. Migration: `20250307120002_create_profile_trigger.sql`.

## Service / Data Helpers

| Location | Function | Purpose |
|----------|----------|---------|
| `src/lib/services/user/auth.ts` | getCurrentUser | Current auth user |
| `src/lib/services/user/auth.ts` | getCurrentSession | Current session |
| `src/lib/services/user/auth.ts` | getCurrentProfile | Current user's profile row |
| `src/lib/services/categories.ts` | getCategories | All categories (authenticated) |
| `src/lib/services/badges.ts` | getBadges | All badges (authenticated) |
| `src/lib/services/content.ts` | getDailyCuriosity | Today's featured topic (null if none) |
| `src/lib/services/content.ts` | getTopicBySlug | Topic by slug (null if none) |

## Reference Data Seeded

- **Categories**: Science, History, Psychology, Space, Technology, Biology, Philosophy, Finance (plus Nature, Culture from initial seed)
- **Badges**: First Step, Curious Mind, Explorer, Week Warrior, Dedicated, Category Scout, Challenge Accepted, Quiz Champion
