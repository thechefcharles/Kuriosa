"use client";

import posthog from "posthog-js";

export function initPostHog(): typeof posthog | null {
  if (typeof window === "undefined") return null;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  if (process.env.NODE_ENV === "development") {
    console.log("[Kuriosa] PostHog env:", { hasKey: !!key, hasHost: !!host });
  }
  if (!key || !host) return null;
  if (posthog.__loaded) return posthog;
  posthog.init(key, { api_host: host });
  if (process.env.NODE_ENV === "development") {
    console.log("[Kuriosa] PostHog initialized");
  }
  return posthog;
}

export function getPostHog(): typeof posthog | null {
  if (typeof window === "undefined") return null;
  return posthog.__loaded ? posthog : null;
}
