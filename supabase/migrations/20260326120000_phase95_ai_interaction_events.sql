-- Phase 9.5: Lightweight AI interaction analytics
-- Records every AI answer attempt (guided follow-up, manual, rabbit-hole)
-- Non-blocking; failures do not affect user experience

CREATE TABLE ai_interaction_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('guided_followup', 'manual', 'rabbit_hole')),
  question_text TEXT NOT NULL,
  from_cache BOOLEAN NOT NULL DEFAULT false,
  rate_limited BOOLEAN NOT NULL DEFAULT false,
  fallback_used BOOLEAN NOT NULL DEFAULT false,
  question_id UUID REFERENCES ai_questions(id) ON DELETE SET NULL,
  answer_id UUID REFERENCES ai_answers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_interaction_events_user_id ON ai_interaction_events(user_id);
CREATE INDEX idx_ai_interaction_events_topic_id ON ai_interaction_events(topic_id);
CREATE INDEX idx_ai_interaction_events_created_at ON ai_interaction_events(created_at);
CREATE INDEX idx_ai_interaction_events_event_type ON ai_interaction_events(event_type);

ALTER TABLE ai_interaction_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_interaction_events_service_role_only"
  ON ai_interaction_events FOR ALL
  USING (false)
  WITH CHECK (false);

-- Service role bypasses RLS; no app read needed for MVP
