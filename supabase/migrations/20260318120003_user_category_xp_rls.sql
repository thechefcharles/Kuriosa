-- RLS for user_category_xp: users read own rows; writes via service role (completion API)
ALTER TABLE user_category_xp ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_category_xp_select_own"
  ON user_category_xp FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
