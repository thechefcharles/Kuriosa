-- Phase 4.11: additional reference categories for curated seed set.
-- Safe to rerun; uses ON CONFLICT DO NOTHING.

INSERT INTO public.categories (name, slug, description, sort_order) VALUES
  ('Psychology', 'psychology', 'How minds work and why we behave the way we do', 6),
  ('Space', 'space', 'Planets, stars, and the big questions', 7),
  ('Philosophy', 'philosophy', 'Ideas that stretch your thinking', 8),
  ('Finance / Economics', 'finance-economics', 'Money, markets, and incentives', 9),
  ('Biology', 'biology', 'Life, bodies, and ecosystems', 10)
ON CONFLICT (slug) DO NOTHING;

