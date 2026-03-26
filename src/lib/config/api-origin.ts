/**
 * Single source of truth for the **browser** base URL of Kuriosa's Next.js Route Handlers.
 *
 * Used by `fetchApi` so the app works when the UI is not served from the same origin as `/api/*`
 * (e.g. Capacitor static bundle on `capacitor://` loading APIs on Vercel).
 *
 * ## Resolution order
 * 1. `NEXT_PUBLIC_API_ORIGIN` — use when set (trimmed, trailing slashes stripped). Required for
 *    Capacitor/production-like mobile builds that call a hosted backend.
 * 2. `window.location.origin` — when the env var is unset and code runs in the browser (local
 *    `next dev` / same-deployment web: API is same-origin).
 *
 * Do **not** guess Vercel/production hostnames here; set `NEXT_PUBLIC_API_ORIGIN` explicitly
 * whenever the client is not served from the same origin as the API.
 *
 * @see KURIOSA_MOBILE_NETWORKING_PREP.md
 */

function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/+$/, "");
}

/**
 * Returns the API base URL with no trailing slash (scheme + host [+ port]).
 * Call only from client-side code paths (hooks, event handlers), or ensure
 * `NEXT_PUBLIC_API_ORIGIN` is set for any non-browser execution.
 */
export function getClientApiOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_API_ORIGIN;
  if (typeof explicit === "string" && explicit.trim() !== "") {
    return normalizeOrigin(explicit);
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  throw new Error(
    "getClientApiOrigin: set NEXT_PUBLIC_API_ORIGIN, or call only from the browser when the API is same-origin."
  );
}

/**
 * Builds an absolute URL for a path that starts with `/api/` (may include query string).
 */
export function resolveClientApiUrl(apiPathWithQuery: string): string {
  const base = getClientApiOrigin();
  const path =
    apiPathWithQuery.startsWith("/") ? apiPathWithQuery : `/${apiPathWithQuery}`;
  return `${base}${path}`;
}

/**
 * When the resolved API origin differs from the page origin, cookie-based session must use
 * `credentials: "include"` (and the API must allow CORS credentials if cross-site).
 */
export function shouldSendCrossOriginApiCredentials(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return getClientApiOrigin() !== window.location.origin;
  } catch {
    return false;
  }
}
