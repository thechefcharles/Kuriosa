#!/usr/bin/env node
/**
 * Verifies variables that must be available when Next inlines `NEXT_PUBLIC_*` into the client
 * bundle during `npm run build:export` (same rules as `next build`).
 *
 * Loads `.env.local` then `.env` from the repo root (like Next), then merges `process.env`
 * so CI/export machines can inject vars without files.
 *
 * Usage: npm run check:export-env
 *
 * @see ENVIRONMENT_SETUP.md — "Checking env at export time"
 */

import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = join(__dirname, "..");

function parseDotEnv(filePath) {
  if (!existsSync(filePath)) return {};
  const out = {};
  const text = readFileSync(filePath, "utf8");
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

const fromFiles = {
  ...parseDotEnv(join(root, ".env")),
  ...parseDotEnv(join(root, ".env.local")),
};

/** Next merges: file env is overridden by process.env in practice for many setups; use shell wins. */
const env = { ...fromFiles, ...process.env };

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

const recommendedForCapacitor = ["NEXT_PUBLIC_API_ORIGIN"];

function mask(s) {
  if (!s || typeof s !== "string") return "(empty)";
  if (s.length <= 12) return `${s.length} chars`;
  return `${s.slice(0, 8)}… (${s.length} chars)`;
}

let failed = false;

console.log("Export-time env check (for `npm run build:export`)\n");
console.log("Sources: process.env + .env + .env.local (repo root)\n");

for (const key of required) {
  const v = env[key];
  const ok = Boolean(v && String(v).trim());
  if (!ok) {
    console.log(`  ✗ ${key}  MISSING`);
    failed = true;
  } else {
    console.log(`  ✓ ${key}  ${key.includes("KEY") ? "set (" + mask(v) + ")" : mask(v)}`);
  }
}

for (const key of recommendedForCapacitor) {
  const v = env[key];
  const ok = Boolean(v && String(v).trim());
  if (!ok) {
    console.log(`  ○ ${key}  not set (optional for same-origin; set for Capacitor → hosted API)`);
  } else {
    console.log(`  ✓ ${key}  ${mask(v)}`);
  }
}

console.log("");

if (failed) {
  console.error(
    "Fix: add missing keys to `.env.local` (local) or your CI/export environment, then run `npm run build:export` again.\n"
  );
  process.exit(1);
}

console.log("Ready to run: npm run build:export\n");
