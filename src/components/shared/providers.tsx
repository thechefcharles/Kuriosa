"use client";

import { PostHogInit } from "./posthog-init";
import { PostHogProvider } from "./posthog-provider";
import { QueryProvider } from "./query-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <PostHogInit />
      <PostHogProvider>{children}</PostHogProvider>
    </QueryProvider>
  );
}
