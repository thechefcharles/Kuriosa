# Environment Setup

## Required Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role — **server-only**; content persistence (Phase 4.9). Never expose to client. |
| `OPENAI_API_KEY` | OpenAI API key |
| `INTERNAL_CONTENT_WORKFLOW_ALLOWLIST_EMAILS` | Comma-separated developer emails allowed to access internal preview + publish/reject endpoints (Phase 4.10). Server-only. |

## Optional Variables (Analytics & Monitoring)

| Variable | Description | Client / Server |
|----------|-------------|-----------------|
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project API key | Client (safe) |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog API host (e.g. `https://us.i.posthog.com`) | Client (safe) |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN for client error monitoring | Client (safe) |
| `SENTRY_DSN` | Sentry DSN for server; falls back to `NEXT_PUBLIC_SENTRY_DSN` if unset | Server |

### What PostHog Is Used For

PostHog provides product analytics: page views, user actions, feature usage, and (optionally) session recordings. It helps understand how users interact with Kuriosa.

### What Sentry Is Used For

Sentry captures runtime errors (client and server), stack traces, and helps debug production issues. No analytics or user tracking—just error monitoring.

### Where to Get These Values

**PostHog**

1. Go to [posthog.com](https://posthog.com) and sign in or create an account
2. Create or open a project
3. **Project Settings** → **Project API Key** → copy to `NEXT_PUBLIC_POSTHOG_KEY`
4. Use `https://us.i.posthog.com` (US) or `https://eu.i.posthog.com` (EU) for `NEXT_PUBLIC_POSTHOG_HOST`

**Sentry**

1. Go to [sentry.io](https://sentry.io) and sign in or create an account
2. Create or open a project (choose Next.js)
3. **Project Settings** → **Client Keys (DSN)** → copy the DSN
4. Use the same DSN for `NEXT_PUBLIC_SENTRY_DSN` and (optionally) `SENTRY_DSN`

## How to Obtain (Core)

### Supabase

1. Go to [supabase.com](https://supabase.com) and sign in
2. Open your project (or create one)
3. **Project Settings** (gear) → **API**
4. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
5. Copy **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### OpenAI

1. Go to [platform.openai.com](https://platform.openai.com)
2. **API keys** → Create new secret key
3. Copy the key → `OPENAI_API_KEY`

**Usage**: `OPENAI_API_KEY` is used **server-side only** for AI content generation (topic ideas, lessons, quizzes, etc.). Never expose it to the client. The app throws a clear error if the key is missing when AI features are invoked.

**Local checks**: `npm run ai:topic-ideas` (4.2), `npm run ai:lesson` (4.3), `npm run ai:challenge` (4.4), `npm run ai:followups` (4.5), `npm run ai:trails` (4.6), and `npm run ai:audio` (4.7) load `.env.local` and call OpenAI—run only on your machine, not in client bundles.

**Assembly demo (no API)**: `npm run ai:assemble-draft` (4.8) builds and validates a **CuriosityExperience** from fixture inputs.

**Persistence demo (4.9)**: `npm run persist:draft` writes the octopus fixture to Supabase using **`SUPABASE_SERVICE_ROLE_KEY`**.

**Progress engine demo (6.2)**: `npm run progress:complete-example` runs `processCuriosityCompletion` against real data. Set **`PHASE6_DEMO_USER_ID`**, **`PHASE6_DEMO_TOPIC_ID`**, **`PHASE6_DEMO_TOPIC_SLUG`** (must match the topic row). Requires migration `20260319130000_phase62_rewards_granted.sql`. Mutates DB — use a test user. See **`COMPLETION_PROGRESS_PROCESSOR.md`**.

**Badge evaluation demo (6.3)**: `npm run progress:badges-example` with **`PHASE6_DEMO_USER_ID`**. Optional **`PHASE6_BADGE_UNLOCK=1`** persists eligible badges (service role). See **`BADGE_SYSTEM_ARCHITECTURE.md`**.

**Phase 6 E2E (manual)**: Sign in → complete one curiosity (challenge → Continue) → check **`/progress`** and celebration on **`#whats-next`**. Repeat same topic: no extra XP. See **`PHASE_6_PROGRESS_SYSTEM_INVENTORY.md`**.

## Auth Redirect URLs (Supabase Dashboard)

For email confirmation and OAuth (if added later), configure in **Authentication → URL Configuration**:

- **Site URL**: `http://localhost:3005` (development) or your production URL
- **Redirect URLs**: Add `http://localhost:3005/**` and your production URL with `/**`

## Setup Steps

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Edit `.env.local` and replace placeholders with your values
3. Restart the dev server after changes
