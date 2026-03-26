# Kuriosa — Get Running in Under 5 Minutes

Local development setup for a working curiosity loop.

## Prerequisites

- Node 18+
- Supabase project (create at [supabase.com](https://supabase.com))
- `.env.local` with: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`

## Steps

### 1. Install and configure

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your keys
```

### 2. Apply migrations

```bash
supabase db push
```

(Or run migrations manually in Supabase SQL Editor.)

### 3. Seed topics

**Fast path (no API):** Supabase Dashboard → SQL Editor → paste and run `supabase/seeds/ten-demo-curiosities.sql`

**Full path (AI):** `npm run seed:phase4`

### 4. Set today's daily pick

```bash
npm run seed:daily
```

### 5. (Optional) Add audio for Listen Mode

```bash
npm run audio:generate-example -- --slug=why-sky-blue
```

### 6. Run

```bash
npm run dev
```

Open `http://localhost:3005` → sign in → Home → Today's curiosity → read → challenge → continue.

## Troubleshooting

- **Home empty?** Run `npm run seed:daily` after seeding topics.
- **Listen disabled?** Generate audio: `npm run audio:generate-example -- --slug=<slug>`
- **TypeScript errors?** `rm -rf .next && npm run build`

See **ENVIRONMENT_SETUP.md** for full configuration.
