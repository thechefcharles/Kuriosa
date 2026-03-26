import { resolveClientApiUrl, shouldSendCrossOriginApiCredentials } from "@/lib/config/api-origin";

/**
 * Default `RequestCredentials` for hosted API calls: same-origin in dev web, `include` when
 * the API base differs from `window.location` (e.g. Capacitor → Vercel).
 */
function defaultApiCredentials(): RequestCredentials {
  return shouldSendCrossOriginApiCredentials() ? "include" : "same-origin";
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
