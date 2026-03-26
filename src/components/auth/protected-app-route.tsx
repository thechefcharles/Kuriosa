"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { ROUTES } from "@/lib/constants/routes";
import {
  isPrettyPublicProfilePath,
  isPublicProfileAccess,
} from "@/lib/routing/profile-access";

/** Pathname-only check (pretty `/profile/:id`). For query-based public access use `isPublicProfileAccess`. */
export function isPublicProfileAppPath(pathname: string): boolean {
  return isPrettyPublicProfilePath(pathname);
}

function isProtectedAppPath(
  pathname: string,
  userIdSearchParam: string | null
): boolean {
  if (isPublicProfileAccess(pathname, userIdSearchParam)) return false;
  return true;
}

/**
 * Client-side gate for `(app)` routes. Required for a static/Capacitor shell where Edge
 * middleware does not run. On normal Vercel web, middleware still refreshes cookies and
 * redirects; this guard aligns behavior and avoids relying on middleware alone.
 *
 * @see KURIOSA_MOBILE_AUTH_AND_GUARDS.md
 */
export function ProtectedAppRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useRequireAuth();

  const needsAuth = isProtectedAppPath(
    pathname,
    searchParams.get("userId")
  );

  useEffect(() => {
    if (!needsAuth) return;
    if (auth.status !== "unauthenticated") return;

    const qs = searchParams?.toString();
    const redirectTarget =
      qs && qs.length > 0 ? `${pathname}?${qs}` : pathname || ROUTES.home;
    const next = new URLSearchParams({ redirect: redirectTarget });
    router.replace(`${ROUTES.signIn}?${next.toString()}`);
  }, [needsAuth, auth.status, pathname, router, searchParams]);

  if (!needsAuth) {
    return <>{children}</>;
  }

  if (auth.status === "loading") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (auth.status === "unauthenticated") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Redirecting to sign in…</p>
      </div>
    );
  }

  return <>{children}</>;
}
