/**
 * Playback source guard: only http(s) URLs are treated as valid audio sources.
 * Empty strings, whitespace, and non-HTTP schemes are rejected so the player never receives garbage.
 */

const MAX_URL_LENGTH = 2048;

export function isValidAudioUrl(url: string): boolean {
  if (typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed.length > MAX_URL_LENGTH) return false;
  try {
    const u = new URL(trimmed);
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    if (!u.hostname) return false;
    return true;
  } catch {
    return false;
  }
}
