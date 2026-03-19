"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import posthog from "posthog-js";
import { initPostHog } from "@/lib/analytics/posthog";

function PostHogPageView({ client }: { client: typeof posthog }) {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname) client.capture("$pageview", { path: pathname });
  }, [client, pathname]);
  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<typeof posthog | null>(null);

  useEffect(() => {
    const ph = initPostHog();
    if (ph) setClient(ph);
  }, []);

  if (!client) return <>{children}</>;

  return (
    <PHProvider client={client}>
      <PostHogPageView client={client} />
      {children}
    </PHProvider>
  );
}
