# Kuriosa — Mobile packaging plan (Capacitor → TestFlight)

Checklist derived from the codebase audit. Use with **`KURIOSA_CAPACITOR_TESTFLIGHT_READINESS_AUDIT.md`**.

---

## Stage 1 — Mobile packaging preparation

- [ ] Register **Bundle ID** in [Apple Developer](https://developer.apple.com) (replace `com.yourname.kuriosa`).
- [ ] Add **`@capacitor/ios`** (and run `npx cap add ios` when `webDir` is valid).
- [x] Introduce **`NEXT_PUBLIC_API_ORIGIN`** and **`fetchApi`** (`src/lib/config/api-origin.ts`, `src/lib/network/fetch-api.ts`); main app hooks migrated — see **`KURIOSA_MOBILE_NETWORKING_PREP.md`** / **`STAGE_1_MOBILE_PACKAGING_PREP_SUMMARY.md`**.
- [x] Document **env vars** for mobile/API origin in **`ENVIRONMENT_SETUP.md`** and **`KURIOSA_MOBILE_NETWORKING_PREP.md`**.

**Success:** iOS folder generated; team knows where API traffic must go in native builds.

---

## Stage 2 — Refactor blockers (minimal path)

### Auth (Server Actions → client-safe)

- [x] **Client path:** `auth-client.ts` (`clientSignIn` / `clientSignUp` / `clientSignOut`) + auth pages + `auth-status.tsx`. **`auth-actions.ts`** kept as legacy (unused by UI).
- [x] Docs: **`KURIOSA_MOBILE_AUTH_AND_GUARDS.md`**, **`STAGE_2_MOBILE_AUTH_PREP_SUMMARY.md`**.

**Files:** `src/lib/services/user/auth-client.ts`, `src/app/auth/**/*.tsx`, `src/components/shared/auth-status.tsx`, `src/lib/services/user/auth-actions.ts` (legacy)

### Middleware parity

- [x] **`ProtectedAppRoute`** in **`src/app/(app)/layout.tsx`** (with `Suspense` for `useSearchParams`) mirrors protected routes; public **`/profile/:userId`** excluded.
- [x] Middleware extended for **`/leaderboard`**, **`/settings/social`**, with same public-profile rule.

**Files:** `src/components/auth/protected-app-route.tsx`, `src/hooks/use-require-auth.ts`, `src/lib/supabase/supabase-middleware.ts`, `src/middleware.ts`

### Server Component pages that require cookies

- [x] **`(app)/profile/page.tsx`** — client page; **`useAuthUserId`** for links; **`ProfileProgressHub`** unchanged.
- [x] **`(app)/settings/social/page.tsx`** — client page; guard only.

**Files:** `src/app/(app)/profile/page.tsx`, `src/app/(app)/settings/social/page.tsx`, `src/lib/services/user/auth.ts` (server helpers for API/internal only)

### Relative `/api` fetches

- [x] Done in Stage 1 — **`fetchApi`** / **`NEXT_PUBLIC_API_ORIGIN`** (see **`KURIOSA_MOBILE_NETWORKING_PREP.md`**).

### Metadata

- [ ] **`curiosity/[slug]/page.tsx`** — for export, remove or simplify **`generateMetadata`** / service-role fetch; use static defaults or client-updated title.

**Files:** `src/app/(app)/curiosity/[slug]/page.tsx`, `src/lib/services/social/get-curiosity-page-metadata.ts`

**Success (target):** Core UX does not **only** rely on middleware / Server Actions for auth; APIs reachable via absolute origin (Stage 1). Remaining: static export, CORS if cross-origin API, metadata.

---

## Stage 3 — Mobile-safe routing (export prep, not export yet)

- [x] **Query-param shell routes** next to pretty dynamic segments — see **`MOBILE_SAFE_ROUTES`** and **`KURIOSA_MOBILE_ROUTING_AND_EXPORT_PREP.md`**.
- [x] **`profile-access`** + middleware / **`ProtectedAppRoute`** for **`/profile?userId=`** (public) vs **`/profile`** (own hub).
- [x] **`next.config`** comments documenting export blockers.

## Stage 3b / 4 — Static export (`out/`)

- [x] **`output: 'export'`** when **`STATIC_EXPORT=1`** + **`npm run build:export`** (`scripts/static-export-build.mjs` stashes API/middleware/pretty dynamics). See **`KURIOSA_STATIC_EXPORT_ENABLEMENT.md`**, **`STAGE_4_STATIC_EXPORT_SUMMARY.md`**.
- [x] Capacitor **`webDir: 'out'`** in **`capacitor.config.ts`** (run **`build:export`** before **`cap sync`**).

**Success:** reproducible **`out/`** for `npx cap sync` (hosted APIs unchanged on Vercel).

---

## Stage 4 — Capacitor + iOS shell

- [ ] `npx cap sync ios`
- [ ] Configure **App icons**, **splash**, **display name** in Xcode / Asset Catalog as needed.
- [ ] Verify **HTTPS** API calls (ATS), **CORS** / **cookie** behavior for Supabase + Vercel from WebView.
- [ ] Test **deep links** into `/curiosity/...`, `/challenge/...` from cold start.

**Success:** Debug build runs on simulator/device with bundled `out/` talking to production APIs.

---

## Stage 5 — Xcode signing and local device install

- [ ] Xcode: select **Team**, **Signing & Capabilities**, unique bundle ID.
- [ ] Run on **physical iPhone** (release-like build).

**Success:** signed install without web-only workarounds (except any intentional staging API).

---

## Stage 6 — App Store Connect + TestFlight

- [ ] Create app record in **App Store Connect** (bundle ID match).
- [ ] **Archive** → **Distribute** → TestFlight.
- [ ] Privacy manifest / **App Privacy** labels (analytics: PostHog, errors: Sentry).
- [ ] Internal / external testers.

**Success:** TestFlight build installable by testers.

---

## Excluded / low priority for consumer TestFlight

- **Internal content preview** (`src/app/internal/**`, `api/internal/**`) — omit from mobile export or protect; not needed for store build.
- **`api/dev/*`**, **`sentry-example-*`** — dev-only.

---

## Suggested commit message (when docs land)

```
docs: audit Kuriosa for Capacitor and TestFlight readiness
```
