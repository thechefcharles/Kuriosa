/**
 * Phase 10.3 — Leaderboard date/window helpers.
 * All windows use UTC. Deterministic and explicit.
 */

export type LeaderboardWindow = "weekly" | "monthly" | "all_time";

export type WindowRange = {
  start: Date;
  end: Date;
};

/**
 * Get start of current ISO week (Monday 00:00 UTC).
 */
function startOfWeek(d: Date): Date {
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() + diff);
  monday.setUTCHours(0, 0, 0, 0);
  return monday;
}

/**
 * Get end of current ISO week (Sunday 23:59:59.999 UTC).
 */
function endOfWeek(d: Date): Date {
  const start = startOfWeek(d);
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);
  end.setUTCHours(23, 59, 59, 999);
  return end;
}

/**
 * Get start of current month (1st 00:00 UTC).
 */
function startOfMonth(d: Date): Date {
  const start = new Date(d);
  start.setUTCDate(1);
  start.setUTCHours(0, 0, 0, 0);
  return start;
}

/**
 * Get end of current month (last day 23:59:59.999 UTC).
 */
function endOfMonth(d: Date): Date {
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();
  const end = new Date(Date.UTC(y, m + 1, 0, 23, 59, 59, 999));
  return end;
}

/**
 * Resolve the date range for a leaderboard window.
 * Weekly: current ISO week (Mon–Sun).
 * Monthly: current calendar month.
 * All-time: returns epoch to now (for filtering completeness; typically not used for date filter).
 */
export function getLeaderboardWindowRange(
  window: LeaderboardWindow,
  refDate: Date = new Date()
): WindowRange | null {
  if (window === "all_time") {
    return {
      start: new Date(0),
      end: refDate,
    };
  }
  if (window === "weekly") {
    return {
      start: startOfWeek(refDate),
      end: endOfWeek(refDate),
    };
  }
  if (window === "monthly") {
    return {
      start: startOfMonth(refDate),
      end: endOfMonth(refDate),
    };
  }
  return null;
}

export function getWindowStartISO(window: LeaderboardWindow): string | null {
  const range = getLeaderboardWindowRange(window);
  return range ? range.start.toISOString() : null;
}

export function getWindowEndISO(window: LeaderboardWindow): string | null {
  const range = getLeaderboardWindowRange(window);
  return range ? range.end.toISOString() : null;
}
