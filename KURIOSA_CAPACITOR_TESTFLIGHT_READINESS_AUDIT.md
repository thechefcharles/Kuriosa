# Kuriosa — Capacitor / TestFlight Readiness Audit

Senior Next.js + mobile packaging review of the repo (Next.js 15 App Router, Vercel, Supabase, Capacitor packages present).

---

## 1. Current state summary

| Area | State |
|------|--------|
| Next.js | App Router, default **Node** build (`next build` / `next start`). **No** `output: 'export'`. |
| Capacitor | `@capacitor/core` + `@capacitor/cli` in `package.json`. **`@capacitor/ios` not installed**; no `ios/` project in repo (expected until `cap add ios`). |
| `capacitor.config.ts` | `appId: 'com.yourname.kuriosa'` (placeholder). `webDir: 'public'` — **incorrect** for a built Next app (see §6). |
| Production | Deployed on **Vercel**; `vercel.json` cron hits `/api/cron/roll-daily-curiosity`. |
| Data / auth | **Supabase** (`@supabase/ssr`): middleware + server client (cookies), browser client exists (`supabase-browser-client.ts`). |

**Verdict:** The product is a **full-stack Next.js app** (SSR-capable pages, middleware, Route Handlers, Server Actions). It is **not** today a static site you can point Capacitor at without further work.

---

## 2. Why the current Capacitor config is not sufficient

### `webDir: 'public'`

- `public/` holds **static assets** (images, etc.), not the **compiled application** (HTML, JS chunks, CSS from `next build`).
- Capacitor expects `webDir` to be the **complete web bundle** the WebView loads (typically `out/` after `output: 'export'`, or another framework’s `dist/`).
- Pointing at `public/` would load incomplete/broken UI and **no** Next-routed app.

### `appId: 'com.yourname.kuriosa'`

- Apple **Bundle ID** must be **unique**, owned by your team, and match **App Store Connect**.
- Placeholder IDs block signing, provisioning, and TestFlight uploads until replaced (e.g. `com.<yourcompany>.kuriosa` — use the ID you register in Apple Developer).

### Missing iOS platform

- TestFlight requires an **Xcode project** (usually `ios/` from `npx cap add ios`). That step has not been done in-repo yet.

---

## 3. Static export viability (`out/`)

**Can Kuriosa be exported to static assets today?** **No**, not without targeted changes.

### Features that block or complicate `output: 'export'`

| Mechanism | Where / what | Why it blocks |
|-----------|----------------|---------------|
| **Route Handlers** | `src/app/api/**/route.ts` (17 files) | Not emitted in a static export; no server to run them. |
| **Middleware** | `src/middleware.ts` + `src/lib/supabase/supabase-middleware.ts` | Edge/runtime middleware does not ship inside a static folder bundle. |
| **Server Actions** | `src/lib/services/user/auth-actions.ts` (`"use server"`) | Rely on Next server endpoints; absent in pure static hosting. |
| **Cookie-based server Supabase** | `src/lib/supabase/supabase-server-client.ts` + `getCurrentUser` / `getCurrentProfile` | Uses `cookies()` from `next/headers`; not available in a portable way on static client-only navigation without a server. |
| **Dynamic segments** | `curiosity/[slug]`, `challenge/[slug]`, `discover/category/[slug]`, `progress/category/[slug]`, `profile/[userId]`, `internal/content-preview/[slug]` | Static export requires a **finite** set of paths at build time **or** a SPA fallback strategy so unknown paths still load `index.html`. Unbounded slugs/UUIDs are a **structural** issue for naive `out/`. |
| **Request-time metadata** | `src/app/(app)/curiosity/[slug]/page.tsx` → `generateMetadata` → `getCuriosityPageMetadata` | Uses **service role** Supabase server-side; cannot run as static HTML for arbitrary slugs without prebuild or moving to client/default meta. |
| **Sentry Next wrapper** | `next.config.ts` `withSentryConfig` | Usually compatible with export, but should be validated in CI once `output: 'export'` is attempted (source maps, instrumentation). |

**Conclusion:** A **mobile-safe bundled frontend** implies either (a) **static export + hosted APIs + client auth/data patterns**, with a clear plan for **dynamic routes / deep links**, or (b) a **different** packaging model (e.g. remote origin — explicitly not your desired end state).

---

## 4. Runtime dependencies (what needs a server today)

### Next.js server / Route Handlers

All of `src/app/api/*`, including:

- **Progress:** `api/progress/complete-curiosity` — uses `createSupabaseServerClient` + **service role** for `processCuriosityCompletion`.
- **AI:** `api/ai/topic-exploration`, `api/ai/manual-question` — OpenAI + auth via server client.
- **Social:** `api/social/activity-feed`, `leaderboard`, `leaderboard/position`, `profile/[userId]`, `record-share`, `settings/privacy`.
- **Ops:** `api/cron/roll-daily-curiosity` (Vercel cron), `api/health`.
- **Internal workflow:** `api/internal/content-preview/[slug]/*` (POST transitions; allowlisted emails).
- **Dev / demo:** `api/dev/validate-curiosity`, `api/sentry-example-api`.

### Middleware

- Refreshes Supabase session from cookies and **redirects** unauthenticated users away from app routes (`/home`, `/discover`, `/progress`, `/profile`, `/curiosity/*`, `/challenge/*`).

### Server Actions

- Sign-in, sign-up, sign-out (`auth-actions.ts`) used from auth UI and `auth-status.tsx`.

### Server Components (cookies / DB via server client)

- `src/app/(app)/profile/page.tsx` — `getCurrentProfile()`.
- `src/app/(app)/settings/social/page.tsx` — `getCurrentUser()`.
- `src/app/internal/content-preview/[slug]/page.tsx` — `getCurrentUser()` + `loadCuriosityPreviewBySlug`.

### Client code already calling relative `/api/*`

Examples: `useRecordCuriosityCompletion`, `useLeaderboard`, `useActivityFeed`, `usePublicProfile`, `useGuidedTopicExploration`, `useAskManualQuestion`, `share-topic-client`, etc. On a **file:// or capacitor://** bundle, relative `/api` hits the **wrong host** unless replaced with an absolute **API base URL** (e.g. Vercel).

---

## 5. Recommended mobile architecture (end state)

**Yes — the intended architecture should be:**

1. **Bundled static web app** in the Capacitor WebView (`webDir` = Next static export output, with SPA/deep-link strategy for dynamic paths — see risks).
2. **Hosted backend** on Vercel (or equivalent) for:
   - All current **Route Handlers** that need secrets (OpenAI, service role, cron).
   - Optionally **thin** wrappers indefinitely; some reads might later move to **direct Supabase** from the client where RLS allows.
3. **Supabase Auth in the client** (or via hosted endpoints) for session in the native app: **replace** Server Actions + cookie-only flows for sign-in/sign-out/sign-up with **browser/client** patterns suitable for Capacitor (storage, deep links for magic links if you add them later).
4. **Client-side route protection** replacing middleware redirects (e.g. guard in `AppShell` or layout using session from `createBrowserClient` / React Query).

**What Capacitor packages:** Only the **static front-end build** + assets — **not** the Next server, **not** `node_modules` for API routes.

**What stays hosted:** Vercel app (API routes + cron), Supabase (DB, auth, storage), OpenAI (via your API routes), PostHog/Sentry (client keys in bundle; server DSN for hosted API if kept).

---

## 6. Eventual Capacitor config (recommended)

When the static bundle exists:

| Field | Recommendation | Notes |
|--------|----------------|--------|
| `appId` | Your real reverse-DNS ID, e.g. `com.<company>.kuriosa` | Must match Apple Developer + App Store Connect. |
| `appName` | `Kuriosa` (or App Store display name policy) | User-visible. |
| `webDir` | **`out`** (or whatever directory `next build` writes for `output: 'export'`) | **Never** `public/` for Next. |
| `server.url` | Omit for **local bundle**; use only for interim smoke tests | Loading only Vercel in the shell is the “remote webview” shortcut you want to avoid as the **final** product. |

Additional (when implementing):

- **iOS**: `npx cap add ios`, configure **ATS** if all APIs are HTTPS (expected).
- **Environment**: inject `NEXT_PUBLIC_*` at **build time** for the export that ships in the IPA (Supabase URL/anon key, `NEXT_PUBLIC_APP_URL`, API base URL if split).
- **API base**: e.g. `NEXT_PUBLIC_API_ORIGIN=https://your-app.vercel.app` and centralize `fetch` so mobile calls the hosted origin.

---

## 7. What must happen before Xcode / TestFlight

1. **Apple Developer Program** membership, App ID / Bundle ID registered.
2. **Decided deep-link / routing strategy** for dynamic routes with static export (see §8).
3. **Working static export build** (or explicit decision to use interim remote `server.url` only for QA).
4. **Auth + API** callable from the WebView with correct origin and cookies/CORS/session strategy.
5. **Xcode**: signing team, provisioning profile, archive, upload to App Store Connect, TestFlight group.

---

## 8. Notes / risks

- **Dynamic routes + static export:** For topics and profiles, paths are **unbounded**. Options: (1) CI `generateStaticParams` from Supabase for all published slugs (large `out/`, still won’t cover **future** slugs until rebuild), (2) **SPA-style** single entry + client router (larger Next structural change), (3) Capacitor **routing** / server fallback configuration so unknown paths serve the app shell (validate against Next 15 export output layout).
- **Service role in `generateMetadata`:** Even if pages become static, **per-URL** meta for sharing may need moving to **client** `document.title` or dropping dynamic meta for mobile.
- **Progress completion** depends on **service role** server-side — should remain on **hosted** API; do not move secrets to the app bundle.
- **Cron** remains Vercel-only; mobile build does not need to include it.

---

## 9. Related docs

- Action-oriented checklist: **`KURIOSA_MOBILE_PACKAGING_PLAN.md`**
- Stage 1 client → hosted API wiring: **`KURIOSA_MOBILE_NETWORKING_PREP.md`**, **`STAGE_1_MOBILE_PACKAGING_PREP_SUMMARY.md`**
- Stage 2 client auth + route guards: **`KURIOSA_MOBILE_AUTH_AND_GUARDS.md`**, **`STAGE_2_MOBILE_AUTH_PREP_SUMMARY.md`**
- Stage 3 mobile-safe query routes + export prep notes: **`KURIOSA_MOBILE_ROUTING_AND_EXPORT_PREP.md`**, **`STAGE_3_MOBILE_ROUTING_PREP_SUMMARY.md`**
