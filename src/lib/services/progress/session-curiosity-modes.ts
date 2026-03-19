/**
 * Tracks whether the user used Read and/or Listen on the current curiosity (session).
 */

const KEY = "kuriosa_curiosity_modes_v1";

type ModeState = { slug: string; usedRead: boolean; usedListen: boolean };

function readState(slug: string): ModeState {
  if (typeof window === "undefined") {
    return { slug, usedRead: true, usedListen: false };
  }
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return { slug, usedRead: true, usedListen: false };
    const p = JSON.parse(raw) as ModeState;
    if (p.slug !== slug.trim()) {
      return { slug: slug.trim(), usedRead: true, usedListen: false };
    }
    return {
      slug: p.slug,
      usedRead: p.usedRead !== false,
      usedListen: Boolean(p.usedListen),
    };
  } catch {
    return { slug: slug.trim(), usedRead: true, usedListen: false };
  }
}

function writeState(s: ModeState) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

/** Call when the curiosity page loads (Read is the default entry). */
export function initCuriosityModesSession(slug: string): void {
  const s = readState(slug);
  if (s.slug !== slug.trim()) {
    writeState({ slug: slug.trim(), usedRead: true, usedListen: false });
  }
}

export function markListenModeUsed(slug: string): void {
  const s = readState(slug);
  writeState({
    slug: slug.trim(),
    usedRead: true,
    usedListen: true,
  });
}

export function getModeUsedLabel(slug: string): "read" | "listen" | "read_listen" {
  const s = readState(slug);
  if (s.usedListen && s.usedRead) return "read_listen";
  if (s.usedListen) return "listen";
  return "read";
}
