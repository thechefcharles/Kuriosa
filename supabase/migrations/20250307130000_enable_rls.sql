-- Phase 3.3: Row-Level Security
-- Enables RLS and defines policies for user-owned and content tables.

-- =============================================================================
-- USER-OWNED TABLES: profiles, user_topic_history, user_followup_questions, user_badges
-- =============================================================================

-- profiles: users read and update own row only (INSERT via trigger, no app INSERT)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- user_topic_history: users access only their own rows
ALTER TABLE user_topic_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_topic_history_all_own"
  ON user_topic_history FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- user_followup_questions: users access only their own rows
ALTER TABLE user_followup_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_followup_questions_all_own"
  ON user_followup_questions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- user_badges: users access only their own rows
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_badges_all_own"
  ON user_badges FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- CONTENT / REFERENCE TABLES: authenticated read only, no app writes
-- =============================================================================

-- categories: authenticated read
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_select_authenticated"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

-- topics: authenticated read
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "topics_select_authenticated"
  ON topics FOR SELECT
  TO authenticated
  USING (true);

-- topic_tags: authenticated read
ALTER TABLE topic_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "topic_tags_select_authenticated"
  ON topic_tags FOR SELECT
  TO authenticated
  USING (true);

-- topic_followups: authenticated read
ALTER TABLE topic_followups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "topic_followups_select_authenticated"
  ON topic_followups FOR SELECT
  TO authenticated
  USING (true);

-- topic_trails: authenticated read
ALTER TABLE topic_trails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "topic_trails_select_authenticated"
  ON topic_trails FOR SELECT
  TO authenticated
  USING (true);

-- quizzes: authenticated read
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quizzes_select_authenticated"
  ON quizzes FOR SELECT
  TO authenticated
  USING (true);

-- quiz_options: authenticated read
ALTER TABLE quiz_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quiz_options_select_authenticated"
  ON quiz_options FOR SELECT
  TO authenticated
  USING (true);

-- daily_curiosity: authenticated read
ALTER TABLE daily_curiosity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "daily_curiosity_select_authenticated"
  ON daily_curiosity FOR SELECT
  TO authenticated
  USING (true);

-- badges: authenticated read (reference data)
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "badges_select_authenticated"
  ON badges FOR SELECT
  TO authenticated
  USING (true);
