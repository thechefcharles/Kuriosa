-- Backfill user_category_xp from existing user_topic_history
-- Run after 20260318120000 and 20260318120001

INSERT INTO user_category_xp (user_id, category_id, total_xp, updated_at)
SELECT
  h.user_id,
  t.category_id,
  COALESCE(SUM(h.xp_earned), 0)::INTEGER AS total_xp,
  NOW() AS updated_at
FROM user_topic_history h
JOIN topics t ON t.id = h.topic_id
WHERE h.rewards_granted = true
  AND h.xp_earned > 0
GROUP BY h.user_id, t.category_id
HAVING COALESCE(SUM(h.xp_earned), 0) > 0
ON CONFLICT (user_id, category_id) DO UPDATE SET
  total_xp = EXCLUDED.total_xp,
  updated_at = EXCLUDED.updated_at;
