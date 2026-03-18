/**
 * Plain text to send to TTS for a topic row.
 * Prefers editorial script; falls back to lesson body.
 */

export type TopicNarrationRow = {
  title: string | null;
  audio_script: string | null;
  lesson_text: string | null;
};

export function buildNarrationTextForTopic(row: TopicNarrationRow): string | null {
  const script = row.audio_script != null ? String(row.audio_script).trim() : "";
  if (script.length > 0) return script;

  const lesson = row.lesson_text != null ? String(row.lesson_text).trim() : "";
  if (lesson.length === 0) return null;

  const title = row.title != null ? String(row.title).trim() : "";
  if (title.length > 0) {
    return `${title}.\n\n${lesson}`;
  }
  return lesson;
}
