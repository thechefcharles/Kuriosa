-- Phase 6.2: gate XP so each user/topic is rewarded at most once.
-- Existing completed rows (Phase 5) are treated as already rewarded (no retro XP burst).

ALTER TABLE user_topic_history
  ADD COLUMN IF NOT EXISTS rewards_granted BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE user_topic_history
SET rewards_granted = TRUE
WHERE completed_at IS NOT NULL;
