# Kuriosa — Mobile auth & route guards (Stage 2)

Companion to **`KURIOSA_MOBILE_NETWORKING_PREP.md`** (Stage 1 API origin). This pass adds **client-safe Supabase auth** and a **client route guard** so the app is not **only** protected by Edge middleware (which does not run in a Capacitor static bundle).

---

## 1. Auth entry points (after refactor)

| Flow | Implementation | Notes |
|------|------------------|--------|
| Sign in | `clientSignIn` in `auth-client.ts` → `sign-in/page.tsx` | Browser Supabase; `router.replace` + `router.refresh`; invalidates `AUTH_SESSION_USER_ID_QUERY_KEY`. Redirect query param validated (`/` prefix, rejects `//`). |
| Sign up | `clientSignUp` → `sign-up/page.tsx` | Same pattern; navigates to `/home`. |
| Sign out | `clientSignOut` → `auth-status.tsx` | Button + `router.replace` landing; invalidates auth query key. |
| Auth chip (header) | `AuthStatus` | Still uses `supabaseBrowser` for display; sign-out uses `auth-client`. |

### Legacy / server (still in repo)

| Artifact | Role |
|----------|------|
| `auth-actions.ts` | Server Actions + `redirect()`. **Not** used by sign-in/up/out UI anymore; kept for gradual migration / tooling. |
| `auth.ts` (`getCurrentUser`, `getCurrentProfile`, …) | **Server** `cookies()` — API routes (`src/app/api/**`), **`internal/content-preview`**. |
| `middleware.ts` + `supabase-middleware.ts` | Web: refresh session cookies + redirects. **Still enabled.** |

---

## 2. Client-side guard pattern

| Piece | Location | Behavior |
|-------|-----------|----------|
| `useRequireAuth` | `src/hooks/use-require-auth.ts` | Subscribes to `createSupabaseBrowserClient` auth state: `loading` \| `authenticated` \| `unauthenticated`. |
| `ProtectedAppRoute` | `src/components/auth/protected-app-route.tsx` | Wraps `(app)` children. **Skips** guard for **public** paths: `/profile/:userId` (one segment after `profile`). Otherwise: loading UI → redirect to `/auth/sign-in?redirect=…` if unauthenticated → render children. |
| Layout wiring | `src/app/(app)/layout.tsx` | `AppShell` → `Suspense` → `ProtectedAppRoute` → `children`. |

### Middleware alignment

`supabase-middleware.ts` now treats **`/leaderboard`** and **`/settings/social`** as protected (previously omitted). **Public profile** `/profile/:id` stays **unauthenticated** in both middleware and `ProtectedAppRoute` (matching `isPublicProfileAppPath`).

---

## 3. App-facing server dependency reductions

| Page | Before | After |
|------|--------|--------|
| `(app)/profile/page.tsx` | Server `getCurrentProfile` + `redirect` | **Client**; guard + `useAuthUserId` for footer links; `ProfileProgressHub` loads data as before. |
| `(app)/settings/social/page.tsx` | Server `getCurrentUser` + `redirect` | **Client**; guard only; `PrivacySettings` unchanged. |

### Still server-oriented (acceptable for now)

- **`curiosity/[slug]/page.tsx`** — `generateMetadata` + service role (Stage 3 / export).
- **Internal preview** — `getCurrentUser` + server loaders.
- **All Route Handlers** — `createSupabaseServerClient` + cookies.

---

## 4. Middleware vs client guard (explicit)

- **Middleware:** Valuable on **Vercel** and **`next dev`** for cookie refresh and fast redirects before hydration.
- **Packaged mobile:** Middleware **does not run** in the static WebView shell; **`ProtectedAppRoute` + `auth-client`** are the portable gate.
- **Do not** remove middleware in this stage; both layers coexist.

---

## 5. Stage 3 (next)

- `output: 'export'`, dynamic routes, metadata.
- CORS / cookie hardening if `NEXT_PUBLIC_API_ORIGIN` ≠ page origin.
- Optional: remove or repurpose `auth-actions.ts` if nothing imports it.

---

## 6. Related files

- `src/lib/services/user/auth-client.ts`
- `src/hooks/use-require-auth.ts`
- `src/components/auth/protected-app-route.tsx`
- `src/hooks/queries/useAuthUserId.ts` (`AUTH_SESSION_USER_ID_QUERY_KEY`)

See **`STAGE_2_MOBILE_AUTH_PREP_SUMMARY.md`** for a short checklist.
