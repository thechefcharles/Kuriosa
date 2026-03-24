/**
 * Streak rules: UTC calendar days. Simple and predictable for Phase 6.
 */

function toUtcDateString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function parseUtcDateOnly(isoDate: string): Date {
  const [y, m, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(y!, m! - 1, day!));
}

export function isSameDay(dateA: Date, dateB: Date): boolean {
  return toUtcDateString(dateA) === toUtcDateString(dateB);
}

export function isYesterday(today: Date, lastActivity: Date): boolean {
  const t = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  t.setUTCDate(t.getUTCDate() - 1);
  return toUtcDateString(t) === toUtcDateString(lastActivity);
}

export type NextStreakResult = {
  nextStreak: number;
  /** Whether this completion counts as a new calendar-day activity */
  countedToday: boolean;
};

/**
 * - Same UTC day as last activity → streak unchanged, not counted again.
 * - Last activity was yesterday → increment.
 * - Otherwise → reset to 1 (first activity or gap).
 */
export function calculateNextStreak(
  currentStreak: number,
  lastActivityDate: string | null,
  now: Date
): NextStreakResult {
  if (!lastActivityDate?.trim()) {
    return { nextStreak: 1, countedToday: true };
  }

  let last: Date;
  try {
    last = parseUtcDateOnly(lastActivityDate.trim());
  } catch {
    return { nextStreak: 1, countedToday: true };
  }

  if (isSameDay(now, last)) {
    return {
      nextStreak: Math.max(1, currentStreak),
      countedToday: false,
    };
  }

  if (isYesterday(now, last)) {
    return {
      nextStreak: Math.max(1, currentStreak) + 1,
      countedToday: true,
    };
  }

  return { nextStreak: 1, countedToday: true };
}

export type NextCorrectStreakResult = {
  nextCorrectStreak: number;
  longestCorrectStreak: number;
};

/**
 * Correct-answer streak: increases on correct main quiz, resets on wrong.
 * Used for "On a Roll", "Locked In", etc. badges.
 */
export function calculateNextCorrectStreak(
  challengeCorrect: boolean,
  currentCorrectStreak: number,
  longestCorrectStreak: number
): NextCorrectStreakResult {
  if (challengeCorrect) {
    const next = currentCorrectStreak + 1;
    return {
      nextCorrectStreak: next,
      longestCorrectStreak: Math.max(longestCorrectStreak, next),
    };
  }
  return {
    nextCorrectStreak: 0,
    longestCorrectStreak,
  };
}
