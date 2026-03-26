import { ROUTES } from "@/lib/constants/routes";

/**
 * `/profile/:userId` — public member view (pretty URL for web + share links).
 */
export function isPrettyPublicProfilePath(pathname: string): boolean {
  if (!pathname.startsWith("/profile/")) return false;
  const rest = pathname.slice("/profile/".length);
  return rest.length > 0 && !rest.includes("/");
}

/**
 * `/profile?userId=…` — static-export-friendly public profile entry (same screen as pretty URL).
 */
export function isPublicProfileByUserIdQuery(
  pathname: string,
  userIdParam: string | null
): boolean {
  if (pathname !== ROUTES.profile) return false;
  return Boolean(userIdParam?.trim());
}

/**
 * Whether `(app)` auth gate + middleware should skip auth for this profile access pattern.
 */
export function isPublicProfileAccess(
  pathname: string,
  userIdSearchParam: string | null
): boolean {
  return (
    isPrettyPublicProfilePath(pathname) ||
    isPublicProfileByUserIdQuery(pathname, userIdSearchParam)
  );
}
