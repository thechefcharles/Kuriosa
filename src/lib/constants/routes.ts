export const ROUTES = {
  landing: "/",
  home: "/home",
  discover: "/discover",
  progress: "/progress",
  profile: "/profile",
  signIn: "/auth/sign-in",
  signUp: "/auth/sign-up",
  curiosity: (slug: string) => `/curiosity/${slug}`,
  challenge: (slug: string) => `/challenge/${slug}`,
} as const;
