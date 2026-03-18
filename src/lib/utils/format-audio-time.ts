/**
 * Format seconds as m:ss (e.g. 65 → "1:05"). Non-finite values → "--:--".
 */
export function formatAudioTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "--:--";
  const s = Math.floor(seconds % 60);
  const m = Math.floor(seconds / 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
