-- Phase P1.4: Badge naming and description polish.
-- More distinctive names, clearer motivating descriptions.
-- Slugs unchanged for compatibility with user_badges.

UPDATE badges SET
  name = 'First Curiosity',
  description = 'Completed your very first lesson',
  updated_at = NOW()
WHERE slug = 'first-step';

UPDATE badges SET
  name = 'Curiosity Seeker',
  description = 'Completed 5 lessons',
  updated_at = NOW()
WHERE slug = 'curious-mind';

UPDATE badges SET
  name = 'Trail Blazer',
  description = 'Completed 10 lessons',
  updated_at = NOW()
WHERE slug = 'explorer';

UPDATE badges SET
  name = 'Week of Wonder',
  description = '7-day streak — curiosity every day',
  updated_at = NOW()
WHERE slug = 'week-warrior';

UPDATE badges SET
  name = 'Steady Flame',
  description = '30-day streak — dedication pays off',
  updated_at = NOW()
WHERE slug = 'dedicated';

UPDATE badges SET
  name = 'Category Explorer',
  description = 'Explored 3 different categories',
  updated_at = NOW()
WHERE slug = 'category-scout';

UPDATE badges SET
  name = 'Quiz Starter',
  description = 'Completed your first quiz challenge',
  updated_at = NOW()
WHERE slug = 'challenge-accepted';

UPDATE badges SET
  name = 'Quiz Ace',
  description = 'Scored 100% on 5 quizzes',
  updated_at = NOW()
WHERE slug = 'quiz-champion';

UPDATE badges SET
  name = 'Random Rover',
  description = 'Completed 5 discoveries from the random spin',
  updated_at = NOW()
WHERE slug = 'random-rover';

UPDATE badges SET
  name = 'Science Regular',
  description = 'Completed 5 topics in Science',
  updated_at = NOW()
WHERE slug = 'science-regular';
