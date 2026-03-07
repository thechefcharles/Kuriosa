-- Minimal seed: categories and badges
-- Run after 20250307120000_create_core_schema.sql

INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Science', 'science', 'Discover the wonders of science and discovery', 1),
  ('History', 'history', 'Explore the past and its lessons', 2),
  ('Nature', 'nature', 'The natural world and its mysteries', 3),
  ('Technology', 'technology', 'How things work and evolve', 4),
  ('Culture', 'culture', 'Human creativity and traditions', 5);

INSERT INTO badges (name, slug, description, criteria_type, criteria_value) VALUES
  ('First Step', 'first-step', 'Complete your first curiosity lesson', 'lessons_completed', '1'),
  ('Curious Mind', 'curious-mind', 'Complete 5 curiosity lessons', 'lessons_completed', '5'),
  ('Explorer', 'explorer', 'Complete 10 curiosity lessons', 'lessons_completed', '10'),
  ('Week Warrior', 'week-warrior', 'Maintain a 7-day streak', 'streak', '7'),
  ('Dedicated', 'dedicated', 'Maintain a 30-day streak', 'streak', '30');
