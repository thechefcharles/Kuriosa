# Phase 3.2 Summary

## What This Prompt Implemented

- **Supabase auth utilities** — Middleware client for session refresh, existing browser/server clients
- **Middleware** — Session refresh + protected routes; unauthenticated users redirected to `/auth/sign-in`
- **Auth pages** — `/auth/sign-in`, `/auth/sign-up` with minimal forms
- **Auth actions** — signUp, signIn, signOut (server actions)
- **Profile bootstrapping** — Database trigger `on_auth_user_created` inserts into `profiles` on signup
- **Current-user helpers** — getCurrentUser, getCurrentSession, getCurrentProfile in `lib/services/user/auth.ts`
- **Auth status UI** — TopBar shows email + Sign out, or Sign in link
- **Documentation** — AUTH_SETUP.md, ENVIRONMENT_SETUP updates

## Auth Foundation Now Exists

- Sign up, sign in, sign out
- Protected app routes (home, discover, progress, profile)
- Profile creation on signup via trigger
- Session handling via middleware

## Profile Bootstrapping

A trigger runs `AFTER INSERT ON auth.users` and inserts into `public.profiles` with the new user's id. Uses `ON CONFLICT (id) DO NOTHING` to avoid duplicates.

## What Remains in Phase 3

- RLS (Row Level Security)
- App queries using real data
- Optional: password reset, email confirmation

## Manual Setup Before 3.3

1. Apply migration: `supabase db push` (or run `20250307120002_create_profile_trigger.sql`)
2. In Supabase Dashboard → Auth → URL Configuration: set Site URL and Redirect URLs
3. (Optional) Disable email confirmation for faster local testing
