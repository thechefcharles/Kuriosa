import { resolveClientApiUrl } from "@/lib/config/api-origin";

/**
 * Always `same-origin`: cookies attach only for real same-origin (e.g. `next dev` → `/api`).
 * Cross-origin (Capacitor → Vercel) sends no cookies — use `Authorization: Bearer` instead.
 * Avoids credentialed CORS (`credentials: "include"`), which often breaks in WKWebView when
 * `Origin` is missing or not reflected exactly.
 */
function defaultApiCredentials(): RequestCredentials {
  return "same-origin";
}

/**
 * `fetch` against Kuriosa's Route Handlers using an absolute URL from {@link resolveClientApiUrl}.
 * Preserves caller `init` and only sets `credentials` when omitted.
 */
export function fetchApi(apiPath: string, init: RequestInit = {}): Promise<Response> {
  const url = resolveClientApiUrl(apiPath);
  const credentials = init.credentials ?? defaultApiCredentials();
  return fetch(url, { ...init, credentials });
}

/**
 * Parse JSON body; returns `null` if the body is empty or not valid JSON.
 */
export async function parseResponseJson<T = unknown>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
