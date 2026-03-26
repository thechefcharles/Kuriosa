-- Set today's daily curiosity (UTC date)
-- Run in Supabase SQL Editor after topics exist.
-- Requires: at least one row in topics with status = 'published'

INSERT INTO daily_curiosity (date, topic_id, theme)
SELECT
  (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::date,
  t.id,
  'Kuriosa demo'
FROM topics t
WHERE t.status = 'published'
ORDER BY t.created_at DESC
LIMIT 1
ON CONFLICT (date) DO UPDATE SET
  topic_id = EXCLUDED.topic_id,
  theme = EXCLUDED.theme;
