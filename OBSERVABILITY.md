# Observability

## What PostHog Tracks (Conceptually)

PostHog provides product analytics:

- **Page views** — which pages users visit
- **User actions** — clicks, form submissions, navigation
- **Custom events** — app-specific events (e.g. curiosity completed, challenge answered)
- **Feature flags** — optional, for experiments and gradual rollouts

PostHog helps you understand how users interact with Kuriosa and where they drop off.

## What Sentry Captures (Conceptually)

Sentry captures:

- **Runtime errors** — uncaught exceptions on the client and server
- **Stack traces** — full context for debugging
- **Request context** — URL, headers, environment

Sentry does not track user behavior or analytics. It focuses on error monitoring and debugging.

## What Is Implemented (Phase 2)

- **PostHog**: Client-side initialization when env vars exist. PostHog provider wraps the app and captures page views. No custom events fired yet.
- **Sentry**: Client, server, and edge initialization when DSN exists. Global error boundary reports React render errors. Server-side `onRequestError` captures request errors. No custom instrumentation or sampling tweaks.

## What Will Be Added in Later Phases

- Custom analytics events (app_opened, curiosity_started, etc.)
- User identification (when auth exists)
- Optional session replay or feature flags in PostHog
- Optional performance tracing or breadcrumbs in Sentry

## How to Verify the Setup

1. **PostHog**: Add `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.local`, run the app, navigate pages. Check your PostHog project dashboard for page view events.
2. **Sentry**: Add `NEXT_PUBLIC_SENTRY_DSN` to `.env.local`, run the app, trigger a test error. Check your Sentry project for the error.
3. **Without env vars**: The app runs normally. PostHog and Sentry are not initialized, and no analytics or errors are sent.
