import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/supabase-middleware";

/**
 * Runs on Vercel / `next dev` only — not inside a Capacitor static bundle. Keeps Supabase
 * cookies fresh and mirrors redirects; `(app)` also uses `ProtectedAppRoute` so auth gates
 * are not middleware-only. See `KURIOSA_MOBILE_AUTH_AND_GUARDS.md`.
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
