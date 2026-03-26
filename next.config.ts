import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const staticExport = process.env.STATIC_EXPORT === "1";

/**
 * **Default `next build` (Vercel):** standard Node server, API routes, middleware.
 *
 * **`STATIC_EXPORT=1` + `npm run build:export`:** `output: "export"` → `out/`.
 * Route Handlers and `middleware.ts` are moved aside for that run only — see
 * `scripts/static-export-build.mjs` and `KURIOSA_STATIC_EXPORT_ENABLEMENT.md`.
 */
const nextConfig: NextConfig = {
  ...(staticExport
    ? {
        output: "export" as const,
        images: { unoptimized: true },
      }
    : {}),
};

export default withSentryConfig(nextConfig, {
  org: "tagvault",

  project: "javascript-nextjs-1p",

  silent: !process.env.CI,

  widenClientFileUpload: true,

  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
