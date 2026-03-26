-- Personality-driven badges: curiosity moments, not just thresholds.
-- Criteria: categories_in_one_day, comeback_gap, advanced_in_row

INSERT INTO badges (name, slug, description, criteria_type, criteria_value) VALUES
  (
    'Curious Switch',
    'curious-switch',
    'Explored 3 different categories in one day',
    'categories_in_one_day',
    '3'
  ),
  (
    'Comeback Trail',
    'comeback-trail',
    'Returned after 5 or more days away',
    'comeback_gap',
    '5'
  ),
  (
    'Deep Diver',
    'deep-diver',
    'Completed 3 intermediate or advanced topics in a row',
    'advanced_in_row',
    '3'
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  criteria_type = EXCLUDED.criteria_type,
  criteria_value = EXCLUDED.criteria_value,
  updated_at = NOW();
