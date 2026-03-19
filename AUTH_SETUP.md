# Auth Setup

## How Auth Works in Kuriosa

- **Supabase Auth** handles sign up, sign in, and sign out.
- **Session** is stored in cookies and refreshed by middleware on each request.
- **Profile bootstrapping**: When a user signs up, a database trigger creates a matching row in `profiles`.
- **Protected routes**: `/home`, `/discover`, `/progress`, `/profile`, `/curiosity/*`, `/challenge/*` require authentication. Unauthenticated users are redirected to `/auth/sign-in`.

## Routes

| Route | Purpose |
|-------|---------|
| `/auth/sign-in` | Sign in with email/password |
| `/auth/sign-up` | Create account |
| `/` | Landing (public) |
| `/home`, `/discover`, `/progress`, `/profile`, `/curiosity/[slug]`, `/challenge/[slug]` | App pages (protected) |

## Profile Bootstrapping

A database trigger `on_auth_user_created` runs when a row is inserted into `auth.users`. It inserts a matching row into `public.profiles` with defaults. Migration: `20250307120002_create_profile_trigger.sql`.

## Supabase Dashboard Settings

1. **Authentication → Providers → Email**
   - Enable Email provider
   - (Optional) Disable "Confirm email" for faster local testing

2. **Authentication → URL Configuration**
   - **Site URL**: `http://localhost:3005` (or your production URL)
   - **Redirect URLs**: Add `http://localhost:3005/**` and production `https://your-domain.com/**`

## Run Migrations

Apply all migrations (schema, seed, profile trigger, RLS):

```bash
supabase db push
```

Or run each migration file manually in Supabase SQL Editor. See `SUPABASE_MIGRATIONS.md` for the full list.

## Testing Locally

1. Run `npm run dev`
2. Go to `/` and click "Enter Kuriosa"
3. You’ll be redirected to `/auth/sign-in` (not logged in)
4. Click "Sign up", create an account with email/password
5. After signup you’ll land on `/home`
6. In Supabase Table Editor, check `profiles` for your new row
7. Click "Sign out" in the top bar to sign out
8. Visit `/home` again — you’ll be redirected to sign-in
