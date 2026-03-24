/**
 * Phase 10.2 — Build absolute shareable URL for a curiosity topic.
 *
 * Env: NEXT_PUBLIC_APP_URL (e.g. https://yourdomain.com)
 * Falls back to localhost:3005 in development when unset.
 */

import { ROUTES } from "@/lib/constants/routes";

function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return process.env.NODE_ENV === "production"
    ? "https://kuriosa.app"
    : "http://localhost:3005";
}

/**
 * Build absolute shareable URL for a curiosity topic.
 */
export function getShareUrl(topicSlug: string): string {
  const slug = topicSlug?.trim();
  if (!slug) return getBaseUrl() + ROUTES.curiosity(""); // fallback to /curiosity/
  const path = ROUTES.curiosity(slug);
  return getBaseUrl() + path;
}
