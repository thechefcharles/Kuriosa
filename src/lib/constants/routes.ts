export const ROUTES = {
  landing: "/",
  home: "/home",
  discover: "/discover",
  discoverCategory: (slug: string) => `/discover/category/${slug}`,
  progress: "/progress",
  progressCategory: (slug: string) => `/progress/category/${slug}`,
  leaderboard: "/leaderboard",
  profile: "/profile",
  profilePublic: (userId: string) => `/profile/${userId}`,
  settingsSocial: "/settings/social",
  signIn: "/auth/sign-in",
  signUp: "/auth/sign-up",
  curiosity: (slug: string) => `/curiosity/${slug}`,
  challenge: (slug: string) => `/challenge/${slug}`,
} as const;

/**
 * Query-param entry points for static export / Capacitor (finite HTML paths). Prefer `ROUTES`
 * for web links, shares, and SEO-friendly URLs. See `KURIOSA_MOBILE_ROUTING_AND_EXPORT_PREP.md`.
 */
export const MOBILE_SAFE_ROUTES = {
  curiosity: (slug: string) =>
    `/curiosity?slug=${encodeURIComponent(slug)}`,
  challenge: (slug: string) =>
    `/challenge?slug=${encodeURIComponent(slug)}`,
  discoverCategory: (slug: string) =>
    `/discover/category?slug=${encodeURIComponent(slug)}`,
  progressCategory: (slug: string) =>
    `/progress/category?slug=${encodeURIComponent(slug)}`,
  profilePublic: (userId: string) =>
    `/profile?userId=${encodeURIComponent(userId)}`,
} as const;
