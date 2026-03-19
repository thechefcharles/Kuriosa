-- Phase 4.9: store accepted recall answers for memory_recall quiz type.
-- MC/logic quizzes leave this NULL.

ALTER TABLE public.quizzes
  ADD COLUMN IF NOT EXISTS memory_recall_hints TEXT;

COMMENT ON COLUMN public.quizzes.memory_recall_hints IS
  'JSON array of acceptable answer strings when quiz_type = memory_recall; NULL otherwise.';
