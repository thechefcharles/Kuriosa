-- Phase 9.1: AI Curiosity Engine — data model for follow-ups, answers, cache
-- Supports: follow-up question generation, manual Q&A, rabbit-hole suggestions, caching

-- ai_questions: user or system-generated questions tied to a topic
CREATE TABLE ai_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('followup', 'manual')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_questions_topic_id ON ai_questions(topic_id);
CREATE INDEX idx_ai_questions_user_id ON ai_questions(user_id);

-- ai_answers: AI-generated answers for questions
CREATE TABLE ai_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES ai_questions(id) ON DELETE CASCADE,
  answer_text TEXT NOT NULL,
  model TEXT,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_answers_question_id ON ai_answers(question_id);

-- ai_followups: cached AI-generated follow-up questions per topic
CREATE TABLE ai_followups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  questions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_followups_topic_id ON ai_followups(topic_id);

-- ai_cache: generic key-value cache for AI responses
CREATE TABLE ai_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT NOT NULL UNIQUE,
  response JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_cache_cache_key ON ai_cache(cache_key);

-- RLS: service role used for writes; authenticated read for app access
ALTER TABLE ai_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_questions_select_authenticated"
  ON ai_questions FOR SELECT TO authenticated USING (true);

CREATE POLICY "ai_answers_select_authenticated"
  ON ai_answers FOR SELECT TO authenticated USING (true);

CREATE POLICY "ai_followups_select_authenticated"
  ON ai_followups FOR SELECT TO authenticated USING (true);

CREATE POLICY "ai_cache_select_authenticated"
  ON ai_cache FOR SELECT TO authenticated USING (true);
