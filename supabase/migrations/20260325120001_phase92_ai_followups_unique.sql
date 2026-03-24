-- Phase 9.2: Ensure one follow-up set per topic for upsert
ALTER TABLE ai_followups ADD CONSTRAINT ai_followups_topic_id_unique UNIQUE (topic_id);
