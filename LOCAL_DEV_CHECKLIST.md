# Local Development Checklist

## 1. Install Dependencies

```bash
cd "/Users/admin/Desktop/Life/Coding Projects/Kuriosa"
npm install
```

## 2. Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Edit `.env.local` and add your Supabase URL and anon key
3. See `ENVIRONMENT_SETUP.md` for how to obtain these

## 3. Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3005](http://localhost:3005) in your browser.

## 4. Verify Route Navigation

- `/` — Landing page
- `/home` — App home (with bottom nav)
- `/discover`, `/progress`, `/profile` — App pages
- Bottom navigation should work between Home, Discover, Progress, Profile

## 5. Verify /api/health

1. With the dev server running, open: [http://localhost:3005/api/health](http://localhost:3005/api/health)
2. You should see JSON like:
   ```json
   {
     "status": "ok",
     "app": "Kuriosa",
     "timestamp": "2025-03-07T..."
   }
   ```

## 6. Confirm Environment Variables Are Loaded

- On the home page (`/home`), check the browser console
- If Supabase is configured: `[Kuriosa] Supabase browser client initialized`
- If env is missing: a warning will appear instead
