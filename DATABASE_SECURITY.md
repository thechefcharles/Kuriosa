# Database Security

## Overview

Kuriosa uses Postgres Row-Level Security (RLS) to ensure users can only access their own data and that content tables are read-only for the app.

## Private Tables (User-Owned)

These tables are protected so users can only access their own rows:

| Table | Access |
|-------|--------|
| `profiles` | SELECT, UPDATE own row only (INSERT via trigger) |
| `user_topic_history` | SELECT, INSERT, UPDATE, DELETE own rows only |
| `user_followup_questions` | SELECT, INSERT, UPDATE, DELETE own rows only |
| `user_badges` | SELECT, INSERT, UPDATE, DELETE own rows only |

### How It Works

- Policies use `auth.uid() = user_id` (or `auth.uid() = id` for profiles) to restrict access.
- Anonymous users cannot read or write any of these tables.
- Authenticated users can only see and modify rows where `user_id` or `id` matches their auth user ID.

## Content / Reference Tables

These tables allow **authenticated read only** (no app writes):

| Table | Access |
|-------|--------|
| `categories` | SELECT (authenticated) |
| `topics` | SELECT (authenticated) |
| `topic_tags` | SELECT (authenticated) |
| `topic_followups` | SELECT (authenticated) |
| `topic_trails` | SELECT (authenticated) |
| `quizzes` | SELECT (authenticated) |
| `quiz_options` | SELECT (authenticated) |
| `daily_curiosity` | SELECT (authenticated) |
| `badges` | SELECT (authenticated) |

### Design Decision

Content is readable only by **authenticated** users. This keeps the app simple and secure: you must sign in to browse categories, topics, badges, etc. The landing page stays public, but app content requires auth.

## Migrations and Seeds

- Migrations and seed data run with database owner privileges and **bypass RLS**.
- The profile bootstrapping trigger runs with `SECURITY DEFINER` and bypasses RLS when inserting new profiles.

## Verifying Policies

1. In Supabase Dashboard → **Authentication** → **Policies**, you can see RLS policies per table.
2. Test authenticated access: sign in, visit `/profile` — you should see profile data and category/badge counts.
3. Test anonymous restriction: sign out, try to access protected app routes — you should be redirected to sign-in before any DB access.

## What Phase 3.3 Changed

- Enabled RLS on all 13 tables
- Added user-owned policies for profiles, user_topic_history, user_followup_questions, user_badges
- Added authenticated-read policies for categories, topics, topic_tags, topic_followups, topic_trails, quizzes, quiz_options, daily_curiosity, badges
- No anonymous access to private or content tables
- No app writes to content tables (inserts come from migrations only)
