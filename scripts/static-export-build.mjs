#!/usr/bin/env node
/**
 * Produces `out/` with `output: "export"`.
 * Temporarily moves aside paths Next.js cannot combine with `output: "export"`, then restores
 * them in `finally` (always run from repo root):
 * - `src/app/api` (Route Handlers stay on Vercel, not in the bundle)
 * - `src/middleware.ts` (Edge middleware does not run in a static export)
 * - `src/app/internal` (admin-only)
 * - Pretty dynamic segments; the static bundle uses Stage 3 **query** shells + `MOBILE_SAFE_ROUTES`
 *
 * @see KURIOSA_STATIC_EXPORT_ENABLEMENT.md
 */

import { existsSync, mkdirSync, renameSync, rmSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = join(__dirname, "..");
const stashDir = join(root, ".next-export-stash");

/** [sourceAbsolute, stashAbsolute] — stash names must be unique under stashDir. */
function exportStashMoves() {
  return [
    [join(root, "src/app/api"), join(stashDir, "api")],
    [join(root, "src/middleware.ts"), join(stashDir, "middleware.ts")],
    [join(root, "src/app/internal"), join(stashDir, "internal-app")],
    [
      join(root, "src/app/(app)/profile/[userId]"),
      join(stashDir, "profile-userId-route"),
    ],
    [
      join(root, "src/app/(app)/challenge/[slug]"),
      join(stashDir, "challenge-slug-route"),
    ],
    [
      join(root, "src/app/(app)/curiosity/[slug]"),
      join(stashDir, "curiosity-slug-route"),
    ],
    [
      join(root, "src/app/(app)/discover/category/[slug]"),
      join(stashDir, "discover-category-slug-route"),
    ],
    [
      join(root, "src/app/(app)/progress/category/[slug]"),
      join(stashDir, "progress-category-slug-route"),
    ],
  ];
}

function ensureCleanStash() {
  if (existsSync(stashDir)) {
    rmSync(stashDir, { recursive: true, force: true });
  }
  mkdirSync(stashDir, { recursive: true });
}

function stash() {
  ensureCleanStash();
  for (const [from, to] of exportStashMoves()) {
    if (existsSync(from)) {
      renameSync(from, to);
    }
  }
}

function restore() {
  for (const [from, to] of exportStashMoves()) {
    if (existsSync(to) && !existsSync(from)) {
      renameSync(to, from);
    }
  }
  if (existsSync(stashDir)) {
    try {
      rmSync(stashDir, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  }
}

stash();
try {
  execSync("npx next build", {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, STATIC_EXPORT: "1" },
  });
} finally {
  restore();
}
