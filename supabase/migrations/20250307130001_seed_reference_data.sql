-- Phase 3.3: Extended reference data
-- Adds categories and badges per prompt spec. Uses ON CONFLICT to be idempotent.

-- Categories: add Psychology, Space, Biology, Philosophy, Finance if not present
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Science', 'science', 'Discover the wonders of science and discovery', 1),
  ('History', 'history', 'Explore the past and its lessons', 2),
  ('Psychology', 'psychology', 'Understanding mind and behavior', 3),
  ('Space', 'space', 'The cosmos and beyond', 4),
  ('Technology', 'technology', 'How things work and evolve', 5),
  ('Biology', 'biology', 'Life and living systems', 6),
  ('Philosophy', 'philosophy', 'Big questions and ideas', 7),
  ('Finance', 'finance', 'Money, markets, and economics', 8)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

-- Badges: streak, category exploration, challenge-related
INSERT INTO badges (name, slug, description, criteria_type, criteria_value) VALUES
  ('First Step', 'first-step', 'Complete your first curiosity lesson', 'lessons_completed', '1'),
  ('Curious Mind', 'curious-mind', 'Complete 5 curiosity lessons', 'lessons_completed', '5'),
  ('Explorer', 'explorer', 'Complete 10 curiosity lessons', 'lessons_completed', '10'),
  ('Week Warrior', 'week-warrior', 'Maintain a 7-day streak', 'streak', '7'),
  ('Dedicated', 'dedicated', 'Maintain a 30-day streak', 'streak', '30'),
  ('Category Scout', 'category-scout', 'Explore 3 different categories', 'categories_explored', '3'),
  ('Challenge Accepted', 'challenge-accepted', 'Complete your first quiz challenge', 'quizzes_completed', '1'),
  ('Quiz Champion', 'quiz-champion', 'Score 100% on 5 quizzes', 'quiz_perfect_scores', '5')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  criteria_type = EXCLUDED.criteria_type,
  criteria_value = EXCLUDED.criteria_value,
  updated_at = NOW();
