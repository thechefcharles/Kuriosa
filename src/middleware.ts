import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/supabase-middleware";
import { API_CORS_HEADERS } from "@/lib/network/api-route-cors";

function applyApiCorsHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(API_CORS_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

/**
 * Runs on Vercel / `next dev` only — not inside a Capacitor static bundle. For `out/`, this
 * file is temporarily moved aside by `scripts/static-export-build.mjs`. See
 * `KURIOSA_STATIC_EXPORT_ENABLEMENT.md` and `KURIOSA_MOBILE_AUTH_AND_GUARDS.md`.
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/api/")) {
    if (request.method === "OPTIONS") {
      return applyApiCorsHeaders(new NextResponse(null, { status: 204 }));
    }
    return applyApiCorsHeaders(NextResponse.next());
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
