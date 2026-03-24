# Environment Setup

## Required Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role — **server-only**; content persistence (Phase 4.9). Never expose to client. |
| `OPENAI_API_KEY` | OpenAI API key |
| `INTERNAL_CONTENT_WORKFLOW_ALLOWLIST_EMAILS` | Comma-separated developer emails allowed to access internal preview + publish/reject endpoints (Phase 4.10). Server-only. |

## Optional — Share links (Phase 10.2)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | App base URL for share links (e.g. `https://yourdomain.com`). Falls back to `localhost:3005` in dev. |

## Optional — Phase 8 audio Storage

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_AUDIO_BUCKET` | Supabase Storage bucket for narration files (default: `curiosity-audio`). See `AUDIO_SYSTEM_ARCHITECTURE.md`. |

## Optional — automated TTS (`npm run audio:tts-upload`)

| Variable | Description |
|----------|-------------|
| `TTS_PROVIDER` | `openai` (default) or `elevenlabs`. |
| `OPENAI_TTS_VOICE` | `alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer` (OpenAI). |
| `OPENAI_TTS_MODEL` | `tts-1` or `tts-1-hd`. |
| `ELEVENLABS_API_KEY` | Required if `TTS_PROVIDER=elevenlabs`. |
| `ELEVENLABS_VOICE_ID` | Voice ID from ElevenLabs. |
| `ELEVENLABS_MODEL` | e.g. `eleven_multilingual_v2`. |
| `AUDIO_GENERATION_PROVIDER` | `openai` (default) or `elevenlabs` for **`generateAudioFromScript`** / **`audio:generate-example`**. |

See **`TTS_NARRATION_PIPELINE.md`** and **`AUDIO_GENERATION_AND_COMPLETION_ARCHITECTURE.md`**.

### Developer: one topic → Listen Mode

1. **Generate + persist (recommended):** `npm run audio:generate-example` (or `audio:tts-upload` for a slug) with API keys set → script uploads to Storage and can call `saveGeneratedAudioMetadata` so `topics.audio_url` is set. See **`PHASE_8_AUDIO_SYSTEM_INVENTORY.md`** § Workflow.
2. **Verify:** Open `/curiosity/<slug>` → toggle **Listen** → audio should play; **Read** remains the primary fallback if URL is missing or fails.

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

**Phase 9 AI (curiosity engine)**: `npm run ai:topic-followups -- --slug=why-sky-blue` — get or generate topic follow-ups (persists to ai_followups). `npm run ai:rabbit-holes -- --slug=why-sky-blue` — rabbit-hole suggestions (cached). Requires migrations `20260325120000_phase91_ai_engine.sql`, `20260325120001_phase92_ai_followups_unique.sql`. See **`GUIDED_CURIOSITY_EXPLORATION_ARCHITECTURE.md`**.

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

---

## Quick Start — Full App Verification

Get Kuriosa running end-to-end in under 5 minutes.

### 1. Prerequisites

- Supabase project (migrations applied: `supabase db push`)
- `.env.local` with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`

### 2. Seed topics

**Option A — Ten demo topics (fast, no API):**  
Open Supabase Dashboard → SQL Editor → paste and run `supabase/seeds/ten-demo-curiosities.sql`

**Option B — AI-generated content:**  
```bash
npm run seed:phase4
```

### 3. Set today's daily curiosity

```bash
npm run seed:daily
```

Or run `supabase/seeds/seed-daily-curiosity.sql` in the SQL Editor.

### 4. (Optional) Generate audio for Listen Mode

```bash
npm run audio:generate-example -- --slug=why-sky-blue
```

Requires `OPENAI_API_KEY`. Listen Mode depends on `topics.audio_url` being set.

### 5. Run the app

```bash
npm run dev
```

Open `http://localhost:3005`. Sign in → Home → Today's curiosity → full loop.

### 6. Verify key routes

- `/` → Enter Kuriosa → sign in
- `/home` → daily curiosity card
- `/curiosity/<slug>` → lesson, Read/Listen toggle, challenge
- `/challenge/<slug>` → answer → See what's next
- `/progress` → XP, level, streak
- `/discover` → categories, search, featured

### Build issues

If `npx tsc --noEmit` fails with `.next` type errors:

```bash
rm -rf .next && npm run build
```

---

## Troubleshooting: Supabase 401 "Failed to retrieve project's postgrest config"

This error usually means Supabase cannot authenticate your app. Check these:

### 1. **Project paused (free tier)**

Free-tier Supabase projects pause after inactivity. In [Supabase Dashboard](https://supabase.com/dashboard), check if the project shows "Paused" and **Restore project** if needed.

### 2. **Environment variables on Vercel**

If deploying to Vercel, ensure these are set in **Project → Settings → Environment Variables**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Values must match the **same** Supabase project (Settings → API). Redeploy after changing env vars.

### 3. **Keys from the correct project**

URL and keys must come from the same project. In Supabase: **Project Settings → API** → copy Project URL, anon key, and service_role key. Avoid mixing keys from different projects.

### 4. **Rotated or invalid keys**

If you regenerated keys in the dashboard, update all env vars (local and Vercel) with the new values.
