import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isPublicProfileAccess } from "@/lib/routing/profile-access";

/**
 * Web deployment: refreshes Supabase session cookies and redirects unauthenticated users
 * away from app routes. Still required for SSR and first paint on Vercel.
 *
 * **Mobile / static shell:** Edge middleware does not run inside a Capacitor bundle.
 * Use `ProtectedAppRoute` + `auth-client` for gates and session UX — do not rely on this alone.
 */

export async function updateSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set({ name, value, ...options });
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set({ name, value, ...options });
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthPage = request.nextUrl.pathname.startsWith("/auth/");
  const path = request.nextUrl.pathname;
  const profileUserIdQuery = request.nextUrl.searchParams.get("userId");
  const isPublicProfile = isPublicProfileAccess(path, profileUserIdQuery);

  const isAppProtected =
    path.startsWith("/home") ||
    path.startsWith("/discover") ||
    path.startsWith("/progress") ||
    path.startsWith("/leaderboard") ||
    path.startsWith("/settings/social") ||
    (path.startsWith("/profile") && !isPublicProfile) ||
    path === "/curiosity" ||
    path.startsWith("/curiosity/") ||
    path === "/challenge" ||
    path.startsWith("/challenge/");

  if (isAppProtected && !user) {
    const signInUrl = new URL("/auth/sign-in", request.url);
    const redirectTarget = path + (request.nextUrl.search || "");
    signInUrl.searchParams.set("redirect", redirectTarget);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthPage && user) {
    const redirect = request.nextUrl.searchParams.get("redirect") || "/home";
    return NextResponse.redirect(new URL(redirect, request.url));
  }

  return response;
}
