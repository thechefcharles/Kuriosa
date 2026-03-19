/**
 * User-facing copy when progress queries fail (e.g. expired JWT).
 */

export function friendlyProgressLoadError(message: string): string {
  const m = message.toLowerCase();
  if (
    m.includes("jwt") ||
    m.includes("401") ||
    m.includes("session") ||
    m.includes("unauthorized") ||
    m.includes("invalid refresh token")
  ) {
    return "Your session ended. Sign in again to see your progress.";
  }
  return message;
}
