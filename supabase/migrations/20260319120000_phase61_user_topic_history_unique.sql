-- Phase 6.1: challenge_correct on history + one completion row per (user_id, topic_id)
-- Profiles already include total_xp, current_level, curiosity_score, streak fields, last_active_date.

ALTER TABLE user_topic_history
  ADD COLUMN IF NOT EXISTS challenge_correct BOOLEAN;

UPDATE user_topic_history
SET challenge_correct = (quiz_score >= 100)
WHERE challenge_correct IS NULL
  AND quiz_score IS NOT NULL;

-- Keep earliest row per user/topic so UNIQUE constraint can be applied.
DELETE FROM user_topic_history u
WHERE NOT EXISTS (
  SELECT 1
  FROM (
    SELECT DISTINCT ON (user_id, topic_id) id
    FROM user_topic_history
    ORDER BY user_id, topic_id, created_at ASC, id ASC
  ) k
  WHERE k.id = u.id
);

ALTER TABLE user_topic_history
  ADD CONSTRAINT user_topic_history_user_id_topic_id_key UNIQUE (user_id, topic_id);

CREATE INDEX IF NOT EXISTS idx_user_topic_history_user_topic
  ON user_topic_history (user_id, topic_id);
