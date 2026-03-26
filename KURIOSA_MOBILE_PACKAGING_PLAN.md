# Kuriosa — Mobile packaging plan (Capacitor → TestFlight)

Checklist derived from the codebase audit. Use with **`KURIOSA_CAPACITOR_TESTFLIGHT_READINESS_AUDIT.md`**.

---

## Stage 1 — Mobile packaging preparation

- [ ] Register **Bundle ID** in [Apple Developer](https://developer.apple.com) (replace `com.yourname.kuriosa`).
- [ ] Add **`@capacitor/ios`** (and run `npx cap add ios` when `webDir` is valid).
- [ ] Introduce **`NEXT_PUBLIC_API_ORIGIN`** (or equivalent) and a **single helper** for API calls so Capacitor builds hit `https://<vercel-app>` instead of relative `/api/*`.
- [ ] Document **env vars** required in the **mobile build** pipeline (at minimum `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, analytics keys, API origin).

**Success:** iOS folder generated; team knows where API traffic must go in native builds.

---

## Stage 2 — Refactor blockers (minimal path)

### Auth (Server Actions → client-safe)

- [ ] Replace **`signIn` / `signUp` / `signOut`** Server Actions (`src/lib/services/user/auth-actions.ts`) with **client** Supabase auth using `createSupabaseBrowserClient` (or equivalent), **or** dedicated hosted JSON endpoints that set session cookies in a way that works from the WebView.
- [ ] Update **`auth/sign-in`**, **`auth/sign-up`**, **`auth-status.tsx`** to use the new flow.

**Files:** `src/lib/services/user/auth-actions.ts`, `src/app/auth/**/*.tsx`, `src/components/shared/auth-status.tsx`

### Middleware parity

- [ ] Implement **client-side guards** for the same paths protected in `src/lib/supabase/supabase-middleware.ts` (redirect to `/auth/sign-in` when no session).

**Files:** `src/middleware.ts` (keep for web; duplicate logic client-side for static), `src/components/layout/app-shell.tsx` (or `(app)/layout.tsx` client wrapper)

### Server Component pages that require cookies

- [ ] **`(app)/profile/page.tsx`** — stop depending on `getCurrentProfile()` for gating only, or load profile **client-side** after session is known.
- [ ] **`(app)/settings/social/page.tsx`** — same for `getCurrentUser()`.

**Files:** `src/app/(app)/profile/page.tsx`, `src/app/(app)/settings/social/page.tsx`, `src/lib/services/user/auth.ts`

### Relative `/api` fetches

- [ ] Centralize `fetch` to **`${API_ORIGIN}/api/...`** for hooks/services listed in the audit (`useRecordCuriosityCompletion`, leaderboard, activity feed, AI hooks, etc.).

### Metadata

- [ ] **`curiosity/[slug]/page.tsx`** — for export, remove or simplify **`generateMetadata`** / service-role fetch; use static defaults or client-updated title.

**Files:** `src/app/(app)/curiosity/[slug]/page.tsx`, `src/lib/services/social/get-curiosity-page-metadata.ts`

**Success:** App logic no longer **requires** Next middleware, Server Actions, or server cookies for core user flows; APIs reachable via absolute origin.

---

## Stage 3 — Static / mobile-safe build output

- [ ] Add **`output: 'export'`** to `next.config.ts` (validate with Sentry wrapper).
- [ ] Resolve **dynamic route** strategy:
  - [ ] **Option A:** `generateStaticParams` for all **published** topic slugs, category slugs, and any **profile** paths you need (CI job querying Supabase).
  - [ ] **Option B:** Structural change to **SPA-friendly** routing / fallback so new slugs work without a new HTML file (validate with Capacitor local server behavior).
- [ ] Run **`npm run build`** and confirm **`out/`** contains the full navigable app for required paths.
- [ ] Set Capacitor **`webDir: 'out'`** (or actual export dir).

**Success:** reproducible static artifact suitable for `npx cap sync`.

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
