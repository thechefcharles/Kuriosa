-- XP/Badge Overhaul: New badge definitions and naming
-- See XP_BADGES_AND_DAILY_MULTIPLIER_OVERHAUL.md

-- A. Global XP progression (curiosity journey naming)
INSERT INTO badges (name, slug, description, criteria_type, criteria_value) VALUES
  ('First Spark', 'first-spark', 'Earn your first 10 XP', 'total_xp', '10'),
  ('Getting Curious', 'getting-curious', '50 XP — you''re on your way', 'total_xp', '50'),
  ('On the Path', 'on-the-path', '150 XP — curiosity is growing', 'total_xp', '150'),
  ('Deepening', 'deepening', '400 XP — going deeper', 'total_xp', '400'),
  ('In the Flow', 'in-the-flow', '1000 XP — fully in the flow', 'total_xp', '1000'),
  ('Sharpened Mind', 'sharpened-mind', '2500 XP — mind is sharp', 'total_xp', '2500'),
  ('Curiosity Engine', 'curiosity-engine', '5000 XP — endless curiosity', 'total_xp', '5000'),
  ('Endless Curious', 'endless-curious', '10000 XP — mastery of learning', 'total_xp', '10000')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  criteria_type = EXCLUDED.criteria_type,
  criteria_value = EXCLUDED.criteria_value,
  updated_at = NOW();

-- B. Participation streak (days in a row)
INSERT INTO badges (name, slug, description, criteria_type, criteria_value) VALUES
  ('Week of Curiosity', 'week-of-curiosity', '7 days in a row participating', 'streak', '7'),
  ('Building Momentum', 'building-momentum', '14 days in a row', 'streak', '14'),
  ('Steady Mind', 'steady-mind', '30 days in a row', 'streak', '30'),
  ('Always Curious', 'always-curious', '100 days in a row', 'streak', '100')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  criteria_type = EXCLUDED.criteria_type,
  criteria_value = EXCLUDED.criteria_value,
  updated_at = NOW();

-- C. Correct-answer streak
INSERT INTO badges (name, slug, description, criteria_type, criteria_value) VALUES
  ('On a Roll', 'on-a-roll', '3 correct answers in a row', 'correct_streak', '3'),
  ('Locked In', 'locked-in', '5 correct in a row', 'correct_streak', '5'),
  ('Unshakable', 'unshakable', '10 correct in a row', 'correct_streak', '10'),
  ('Flawless Run', 'flawless-run', '20 correct in a row', 'correct_streak', '20')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  criteria_type = EXCLUDED.criteria_type,
  criteria_value = EXCLUDED.criteria_value,
  updated_at = NOW();

-- D. Category breadth (category-scout = 3 cats, wide-mind = 5, polymath = 8/all)
UPDATE badges SET name = 'Explorer', description = 'Explore 3 different categories' WHERE slug = 'category-scout';
INSERT INTO badges (name, slug, description, criteria_type, criteria_value) VALUES
  ('Wide Mind', 'wide-mind', 'Explore 5 categories', 'categories_explored', '5'),
  ('Polymath', 'polymath', 'Explore all categories', 'categories_explored', '8')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  criteria_type = EXCLUDED.criteria_type,
  criteria_value = EXCLUDED.criteria_value,
  updated_at = NOW();

-- E. Special badges
INSERT INTO badges (name, slug, description, criteria_type, criteria_value) VALUES
  ('Lucky Spin', 'lucky-spin', 'Hit a 2.5× daily multiplier', 'daily_multiplier_hit', '1'),
  ('Comeback Trail', 'comeback-trail', 'Return after 7+ inactive days', 'comeback_gap', '7')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  criteria_type = EXCLUDED.criteria_type,
  criteria_value = EXCLUDED.criteria_value,
  updated_at = NOW();

-- Update legacy participation streak badges to new names (slug unchanged for user_badges)
UPDATE badges SET name = 'Week of Curiosity', description = '7 days in a row participating' WHERE slug = 'week-warrior';
UPDATE badges SET name = 'Steady Mind', description = '30 days in a row' WHERE slug = 'dedicated';
