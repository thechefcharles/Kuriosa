"use client";

import { useEffect } from "react";
import { initPostHog } from "@/lib/analytics/posthog";

export function PostHogInit() {
  useEffect(() => {
    const ph = initPostHog();
    if (process.env.NODE_ENV === "development") {
      console.log("[Kuriosa] PostHog init result:", ph ? "ready" : "skipped (no env)");
    }
  }, []);
  return null;
}
