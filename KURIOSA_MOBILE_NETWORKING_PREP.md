# Kuriosa — Mobile networking prep (Stage 1)

This document describes the **first** mobile-packaging networking pass: centralized API origin and `fetchApi`, without static export or Capacitor iOS yet.

Related: **`KURIOSA_CAPACITOR_TESTFLIGHT_READINESS_AUDIT.md`**, **`KURIOSA_MOBILE_PACKAGING_PLAN.md`**, **`STAGE_1_MOBILE_PACKAGING_PREP_SUMMARY.md`**.

---

## 1. Why relative `/api/*` breaks in Capacitor

In the browser on Vercel, `fetch("/api/progress/...")` resolves to the **same origin** as the page, so Route Handlers and auth cookies work.

In a **bundled** Capacitor WebView, the page often loads from a **non-HTTP** or **different** origin (e.g. `capacitor://localhost`). A relative `/api/...` URL then targets **that** origin, where **no** Next server exists — requests fail or hit the wrong host.

**Fix:** Resolve the API base explicitly (e.g. `https://your-deployment.vercel.app`) and call **absolute** URLs. This pass implements that via `NEXT_PUBLIC_API_ORIGIN` + `fetchApi`.

---

## 2. How `NEXT_PUBLIC_API_ORIGIN` works

| Condition | Behavior |
|-----------|----------|
| Variable **set** | `getClientApiOrigin()` returns that value (trimmed, no trailing slash). All `fetchApi("/api/...")` calls go to `{origin}/api/...`. |
| Variable **unset**, code runs **in the browser** | Falls back to `window.location.origin` — same as today for local dev and same-origin production. |
| Unset and **no** `window` | Throws (should not happen for current hooks; they run on the client). |

We **do not** infer production hostnames from Vercel automatically; you set the origin when you need a fixed backend URL (mobile builds).

See **`ENVIRONMENT_SETUP.md`** for examples.

---

## 3. Shared helpers

| Module | Role |
|--------|------|
| `src/lib/config/api-origin.ts` | `getClientApiOrigin`, `resolveClientApiUrl`, `shouldSendCrossOriginApiCredentials` |
| `src/lib/network/fetch-api.ts` | `fetchApi(path, init?)` — builds absolute URL, applies `credentials: "include"` when API origin ≠ page origin, else `same-origin` |

Optional: `parseResponseJson` for safe JSON parsing after `fetchApi`.

---

## 4. What was migrated (off raw `fetch("/api/...")`)

User-facing and example client code now uses `fetchApi`:

| Area | Files |
|------|--------|
| Progress completion | `src/hooks/mutations/useRecordCuriosityCompletion.ts` |
| AI manual question | `src/hooks/mutations/useAskManualQuestion.ts` |
| AI topic exploration | `src/hooks/queries/useGuidedTopicExploration.ts` |
| Leaderboard | `src/hooks/queries/useLeaderboard.ts` |
| Leaderboard position | `src/hooks/queries/useUserLeaderboardPosition.ts` |
| Activity feed | `src/hooks/queries/useActivityFeed.ts` |
| Public profile | `src/hooks/queries/usePublicProfile.ts` |
| Privacy (read/write) | `src/hooks/queries/useProfilePrivacy.ts`, `src/hooks/mutations/useUpdatePrivacySettings.ts` |
| Share analytics | `src/lib/services/social/share-topic-client.ts` |
| Sentry example | `src/app/sentry-example-page/page.tsx` |

**Not migrated (intentionally)**

- **Internal content workflow** — `src/app/internal/content-preview/[slug]/page.tsx` HTML form `action={"/api/internal/..."}` remains relative. Admin-only; revisit if that UI is ever shipped in a static/mobile bundle.

---

## 5. Hosted backend vs “candidate for client Supabase later”

### Must stay on hosted Route Handlers (secrets / server-only)

| Feature | Route(s) | Why |
|---------|-----------|-----|
| Curiosity completion / XP | `POST /api/progress/complete-curiosity` | Service role + `processCuriosityCompletion` |
| AI manual answer | `POST /api/ai/manual-question` | OpenAI, moderation, rate limits |
| Guided exploration / rabbit holes | `GET /api/ai/topic-exploration` | OpenAI / server aggregation |
| Social reads using server session | `GET` leaderboard, position, activity feed, profile, privacy | Cookie session via `createSupabaseServerClient` today |
| Social writes | `PATCH` privacy, `POST` record-share | Authenticated server logic |
| Cron / health / internal / dev | `api/cron/*`, `api/health`, `api/internal/*`, `api/dev/*` | Operational or internal |

None of these should move secrets to the client bundle.

### Candidates for future client-side reads (RLS permitting)

Some **GET** flows could eventually call **Supabase directly** from `createSupabaseBrowserClient` if policies and typings are aligned — **not** done in this pass. Examples: parts of leaderboard/feed/profile if RLS matches current API behavior. Any write that today uses service role or OpenAI stays on the server.

---

## 6. Auth / network (light review — no auth rewrite)

### Still depend on Server Actions (Next server)

- `src/lib/services/user/auth-actions.ts` — `signIn`, `signUp`, `signOut` (`"use server"`), used from auth pages and `auth-status.tsx`.

### Still depend on middleware (Edge)

- `src/middleware.ts` — cookie refresh + redirects for protected routes.

### Already safe for browser / Supabase client

- `createSupabaseBrowserClient` / `supabaseBrowser` — used in hooks (e.g. after completion for query invalidation), RLS-bound reads elsewhere.
- New API calls use `fetchApi`; session for those routes still relies on **cookies** set by Supabase SSR flows today.

### Stage 2 (next)

- Replace Server Actions with client-side Supabase auth (or hosted auth endpoints).
- Client-side route guards for static/Capacitor when middleware is absent.
- If `NEXT_PUBLIC_API_ORIGIN` points to Vercel from a different origin, add **CORS** + cookie `SameSite` strategy as needed.

---

## 7. Verification checklist

1. **Unset** `NEXT_PUBLIC_API_ORIGIN`, run `npm run dev`, complete a curiosity, open leaderboard — behavior unchanged.
2. **Set** `NEXT_PUBLIC_API_ORIGIN=http://localhost:3005` — should match unset for local.
3. **Set** `NEXT_PUBLIC_API_ORIGIN` to another host only when that host runs the same API and CORS is configured (advanced).
4. `rg 'fetch\\([`\\'"]/api/' src` — should show **no** matches in migrated hooks; internal preview forms may still show `/api/internal`.

---

## 8. Risks / follow-ups

- **Cross-origin cookies:** Supabase SSR cookies on `vercel.app` may not be sent to a `capacitor://` app without token storage / deep-link auth changes — Stage 2.
- **CORS:** Next Route Handlers do not yet globally allow cross-origin credentialed requests; required before pointing a true cross-origin shell at production APIs.
- **Internal forms:** Still relative; document if internal tools get a static build.
