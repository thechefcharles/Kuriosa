# Environment Setup

## Required Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `OPENAI_API_KEY` | OpenAI API key |

## How to Obtain

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

## Setup Steps

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Edit `.env.local` and replace placeholders with your values
3. Restart the dev server after changes
