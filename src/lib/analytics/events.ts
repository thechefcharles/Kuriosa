export const AnalyticsEvents = {
  app_opened: "app_opened",
  curiosity_started: "curiosity_started",
  curiosity_completed: "curiosity_completed",
  challenge_answered: "challenge_answered",
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];
