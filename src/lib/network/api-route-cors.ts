import type { NextResponse } from "next/server";

/** Shared CORS for `/api/*` — Capacitor / cross-origin; no credentials on client. */
export const API_CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, content-type, x-client-info, x-supabase-api-version",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
};

/**
 * CORS for Route Handlers called from Capacitor / other origins using Bearer auth (no cookies).
 * Uses `Access-Control-Allow-Origin: *` so WKWebView works even when `Origin` is absent or odd.
 * Do not combine with `credentials: "include"` on the client.
 */
export function corsHeadersForApiRequest(_request: Request): Record<string, string> {
  return { ...API_CORS_HEADERS };
}

export function withApiCors(request: Request, response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(corsHeadersForApiRequest(request))) {
    response.headers.set(key, value);
  }
  return response;
}
