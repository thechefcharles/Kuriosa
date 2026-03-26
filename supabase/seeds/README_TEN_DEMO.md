# Ten demo curiosities

## What you get

10 **published** topics with a short lesson + **multiple-choice challenge** each. They are flagged **`is_random_featured = true`** so random spin prefers them when present.

**Content expansion:** After ten-demo, run migrations to add 20 more topics, trails, bonus questions, and followups. See `20260328120000_content_expansion_trails.sql` and `CONTENT_EXPANSION_AND_TRAILS_ARCHITECTURE.md`.

| # | Slug | Title |
|---|------|--------|
| 1 | `why-sky-blue` | Why is the sky blue? |
| 2 | `great-pyramid-age` | How old is the Great Pyramid? |
| 3 | `do-trees-sleep` | Do trees sleep? |
| 4 | `what-is-qr-code` | What is a QR code? |
| 5 | `break-a-leg-theatre` | Why do actors say "break a leg"? |
| 6 | `how-caffeine-works` | How does caffeine wake you up? |
| 7 | `printing-press-gutenberg` | Who gets credit for the printing press? |
| 8 | `why-cats-purr` | Why do cats purr? |
| 9 | `cloud-computing-simple` | What is cloud computing (simply)? |
| 10 | `honey-lasts-forever` | Why can honey last for thousands of years? |

## How to load into Supabase

1. Open **Supabase Dashboard** → your project → **SQL Editor**.
2. Paste the full contents of **`ten-demo-curiosities.sql`**.
3. Click **Run**.

**Requirement:** `categories` must already include `science`, `history`, `nature`, `technology`, `culture` (default Kuriosa migrations).

Re-running the script is safe: existing slugs are skipped (`ON CONFLICT` / `NOT EXISTS`).

**Then set today's daily pick:** `npm run seed:daily` (or run `supabase/seeds/seed-daily-curiosity.sql` in SQL Editor).

## Optional: set today’s daily curiosity

After the seed, pick one topic for **Home → Today’s curiosity** (UTC date):

```sql
INSERT INTO daily_curiosity (date, topic_id, theme)
SELECT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::date, id, 'Demo pack'
FROM topics WHERE slug = 'why-sky-blue' LIMIT 1
ON CONFLICT (date) DO UPDATE SET topic_id = EXCLUDED.topic_id, theme = EXCLUDED.theme;
```

Then open **`/curiosity/why-sky-blue`** (or use **Feed my curiosity** on Home).
