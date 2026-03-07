export const ROUTES = {
  landing: "/",
  home: "/home",
  discover: "/discover",
  progress: "/progress",
  profile: "/profile",
  curiosity: (slug: string) => `/curiosity/${slug}`,
  challenge: (slug: string) => `/challenge/${slug}`,
} as const;
