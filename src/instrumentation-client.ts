import * as Sentry from "@sentry/nextjs";
import posthog from "posthog-js";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    integrations: [Sentry.replayIntegration()],
    tracesSampleRate: process.env.NODE_ENV === "development" ? 1 : 0.1,
    enableLogs: true,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    sendDefaultPii: true,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

const phKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const phHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
if (phKey && phHost) {
  posthog.init(phKey, { api_host: phHost });
}
