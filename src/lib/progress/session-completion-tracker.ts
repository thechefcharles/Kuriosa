/**
 * Lightweight session arc: "2 curiosities explored today"
 * No pressure, no timers — just a gentle reinforcement.
 */

const KEY = "kuriosa:sessionCompletions";
const DATE_KEY = "kuriosa:sessionCompletionsDate";

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function readState(): { count: number; dateKey: string } {
  if (typeof window === "undefined") return { count: 0, dateKey: "" };
  try {
    const raw = sessionStorage.getItem(KEY);
    const dateKey = sessionStorage.getItem(DATE_KEY) ?? "";
    const today = getTodayKey();
    if (dateKey !== today) return { count: 0, dateKey: today };
    const count = typeof raw === "string" ? parseInt(raw, 10) : 0;
    return { count: Number.isFinite(count) ? Math.max(0, count) : 0, dateKey: today };
  } catch {
    return { count: 0, dateKey: getTodayKey() };
  }
}

/** Call when a completion is recorded (e.g. on stashed celebration). */
export function incrementSessionCompletions(): void {
  if (typeof window === "undefined") return;
  try {
    const today = getTodayKey();
    const { count, dateKey } = readState();
    const next = dateKey === today ? count + 1 : 1;
    sessionStorage.setItem(KEY, String(next));
    sessionStorage.setItem(DATE_KEY, today);
  } catch {
    /* ignore */
  }
}

/** Read current count for this session day. */
export function getSessionCompletionCount(): number {
  return readState().count;
}
