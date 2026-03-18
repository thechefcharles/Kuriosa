-- Phase 8.1: optional narration script and stored duration (playback still uses audio_url).
ALTER TABLE public.topics ADD COLUMN IF NOT EXISTS audio_script TEXT;

ALTER TABLE public.topics ADD COLUMN IF NOT EXISTS audio_duration_seconds INTEGER;

COMMENT ON COLUMN public.topics.audio_script IS 'Spoken script / caption source; app falls back to lesson_text when null.';
COMMENT ON COLUMN public.topics.audio_duration_seconds IS 'Optional stored duration in seconds; HTML audio metadata remains fallback.';

ALTER TABLE public.topics DROP CONSTRAINT IF EXISTS topics_audio_duration_seconds_check;

ALTER TABLE public.topics
  ADD CONSTRAINT topics_audio_duration_seconds_check
  CHECK (audio_duration_seconds IS NULL OR audio_duration_seconds >= 0);
