# Stage 2 — Mobile auth & guards (summary)

**Scope:** Client Supabase sign-in/up/out; `ProtectedAppRoute` + `useRequireAuth`; middleware extended for `/leaderboard` & `/settings/social`; profile/settings pages no longer use server-only gating. No static export, no Capacitor iOS.

## Delivered

- **`auth-client.ts`** — `clientSignIn`, `clientSignUp`, `clientSignOut`.
- **`use-require-auth.ts`** — session subscription for guards.
- **`protected-app-route.tsx`** — client gate; public `/profile/:userId` exception.
- **`(app)/layout.tsx`** — wraps children with `Suspense` + `ProtectedAppRoute`.
- **Auth pages + `AuthStatus`** — use `auth-client` + TanStack Query invalidation + `router.refresh()`.
- **`profile/page.tsx`**, **`settings/social/page.tsx`** — `"use client"`, no `getCurrentProfile` / `getCurrentUser` redirects.
- **Middleware** — comments; protected paths include leaderboard & settings/social; public profile path excluded.
- **`auth-actions.ts`** — retained, documented as legacy.

## Suggested commit message

```
refactor(mobile): add client-safe auth flows and route guards for Capacitor readiness
```

## Next (Stage 3)

Static export, dynamic route strategy, optional CORS on APIs, metadata cleanup.
