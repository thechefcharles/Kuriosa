-- XP / Badge Overhaul: daily multiplier, user_category_xp, correct streak
-- See XP_BADGES_AND_DAILY_MULTIPLIER_OVERHAUL.md for design

-- 1. Add daily_multiplier to daily_curiosity (shared per day, 1.2–2.5 range)
ALTER TABLE daily_curiosity
  ADD COLUMN IF NOT EXISTS daily_multiplier NUMERIC(3,2) NOT NULL DEFAULT 1.5;

COMMENT ON COLUMN daily_curiosity.daily_multiplier IS 'Shared multiplier for all users that day (1.2, 1.5, 1.8, 2.0, 2.5). Applied to quiz XP when topic is daily feature.';

-- 2. Add correct streak fields to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS correct_streak INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS longest_correct_streak INTEGER NOT NULL DEFAULT 0;

COMMENT ON COLUMN profiles.correct_streak IS 'Consecutive correct main quiz answers (resets on wrong).';
COMMENT ON COLUMN profiles.longest_correct_streak IS 'All-time longest correct streak.';

-- 3. Create user_category_xp for per-category XP tracking
CREATE TABLE IF NOT EXISTS user_category_xp (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  total_xp INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_user_category_xp_user_id ON user_category_xp(user_id);
CREATE INDEX IF NOT EXISTS idx_user_category_xp_category_id ON user_category_xp(category_id);

COMMENT ON TABLE user_category_xp IS 'Per-category XP from rewarded completions. Used for category milestone badges.';
