-- Sync quiz difficulty to match parent topic difficulty
-- Ensures quiz display always matches the curiosity card

UPDATE quizzes q
SET difficulty_level = t.difficulty_level
FROM topics t
WHERE q.topic_id = t.id
  AND (q.difficulty_level IS DISTINCT FROM t.difficulty_level);
