# Phase 2 Infrastructure Inventory

## Framework and Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (Base UI, semantic design tokens)

## Folder Architecture

```
src/
├── app/              # Routes (marketing, app, api)
├── components/       # UI, layout, shared
├── hooks/            # React hooks (queries)
├── lib/              # Utilities, services, constants
├── styles/           # Theme CSS
└── types/            # TypeScript types
```

## Routing

| Route | Purpose |
|-------|---------|
| `/` | Landing (marketing) |
| `/home` | App home |
| `/discover` | Topic discovery |
| `/progress` | XP, streaks, badges |
| `/profile` | Account and settings |
| `/curiosity/[slug]` | Curiosity lesson (placeholder) |
| `/challenge/[slug]` | Quiz/challenge (placeholder) |
| `/api/health` | Health check |

## UI Foundation

- **Design tokens** — `lib/constants/design-tokens.ts`
- **Shared primitives** — PageContainer, PageHeader, Section
- **shadcn components** — Button, Card, Input, Badge, Tabs, Dialog
- **Loading and error states** — LoadingState, ErrorState

## Supabase Utilities

- **Browser client** — `lib/supabase/supabase-browser-client.ts`
- **Server client** — `lib/supabase/supabase-server-client.ts`

## Environment Configuration

- **`.env.example`** — Template for required vars
- **`ENVIRONMENT_SETUP.md`** — How to obtain keys
- **`lib/utils/env.ts`** — Validation utility

## API Foundation

- **`/api/health`** — Health check (status, app, timestamp)
- **Server utilities** — `lib/server/api-response.ts`, `lib/server/errors.ts`
- **Placeholders** — `api/internal/`, `api/public/`

## Observability Foundation

- **PostHog** — Analytics (page views), init in `instrumentation-client.ts`
- **Sentry** — Error monitoring (client, server, edge), `global-error.tsx`
- **`OBSERVABILITY.md`** — Documentation

## Data Layer Foundation

- **React Query** — QueryClient, QueryProvider
- **Service placeholders** — `lib/services/topics`, `challenges`, `users`
- **Query hooks** — `useTopics`, `useTopic`, `useChallenge` (placeholders)
- **`DATA_LAYER_ARCHITECTURE.md`** — Documentation
