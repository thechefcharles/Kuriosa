# Phase 2 Handoff to Phase 3

## What Phase 2 Completed

Phase 2 established the **Infrastructure & Project Scaffold** for Kuriosa:

- Next.js App Router, TypeScript, Tailwind, shadcn/ui
- Route structure (marketing, app, API)
- App shell, top bar, bottom navigation
- Supabase browser and server clients
- Environment configuration and validation
- API foundation (health endpoint, server utilities)
- PostHog and Sentry integration
- React Query and data layer structure (placeholders)

## What Is Ready for Phase 3

Phase 3 can now rely on:

- **Routing** — All placeholder routes exist and compile
- **Layout** — AppShell, PageContainer, PageHeader, Section
- **Supabase** — Clients ready for queries; add schema and calls in Phase 3
- **React Query** — Provider and hooks structure; replace placeholders with real `useQuery`
- **Services** — `lib/services/topics`, `challenges`, `users`; add Supabase calls
- **API** — Health endpoint; add new routes as needed
- **Observability** — PostHog and Sentry capture events and errors

## Assumptions Made

- Supabase project exists; URL and anon key are in env
- PostHog and Sentry are optional; app runs without them
- `NEXT_PUBLIC_*` vars are inlined at build time
- Placeholder hooks return mock data; Phase 3 will wire real queries

## What Phase 3 Should NOT Change Casually

- **Provider order** — QueryProvider → PostHogProvider; keep nesting as-is
- **Route structure** — Marketing vs app groups; dynamic routes
- **Server utilities** — `api-response.ts`, `errors.ts`; extend, don’t replace
- **Sentry/PostHog init** — In `instrumentation-client.ts`; avoid moving without reason

## Before Starting Phase 3

1. Run `npm run dev` and click through all routes
2. Confirm `/api/health` returns `{ status: "ok", app: "Kuriosa" }`
3. Review `PROJECT_RULES.md` and `DATA_LAYER_ARCHITECTURE.md`
4. Ensure `.env.local` has Supabase (and optionally PostHog/Sentry) configured
