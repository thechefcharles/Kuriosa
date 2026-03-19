-- Phase 6.3: additional badge definitions for random spin + category depth.
-- Evaluator understands criteria_type random_completions and category_completions.

INSERT INTO badges (name, slug, description, criteria_type, criteria_value) VALUES
  (
    'Random Rover',
    'random-rover',
    'Complete 5 random curiosity discoveries',
    'random_completions',
    '5'
  ),
  (
    'Science Regular',
    'science-regular',
    'Complete 5 topics in Science',
    'category_completions',
    'science:5'
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  criteria_type = EXCLUDED.criteria_type,
  criteria_value = EXCLUDED.criteria_value,
  updated_at = NOW();
