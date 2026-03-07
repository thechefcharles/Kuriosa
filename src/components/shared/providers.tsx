"use client";

import { PostHogInit } from "./posthog-init";
import { PostHogProvider } from "./posthog-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PostHogInit />
      <PostHogProvider>{children}</PostHogProvider>
    </>
  );
}
