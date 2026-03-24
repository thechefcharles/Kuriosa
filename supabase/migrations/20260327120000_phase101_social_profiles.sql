-- Phase 10.1: Social layer foundation — profiles and activity events
-- Extends profiles for public social data; creates activity_events table

-- =============================================================================
-- PROFILES: Add social and privacy fields
-- =============================================================================
-- display_name, avatar_url already exist; add bio and privacy toggles

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS is_public_profile BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS allow_activity_feed BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS allow_leaderboard BOOLEAN NOT NULL DEFAULT true;

-- Ensure display_name has valid length when set (2–40 chars)
-- Clear invalid values before adding constraint
UPDATE profiles
SET display_name = NULL
WHERE display_name IS NOT NULL
  AND (length(trim(display_name)) < 2 OR length(display_name) > 40);

ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_display_name_length;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_display_name_length
  CHECK (
    display_name IS NULL
    OR (
      length(trim(display_name)) >= 2
      AND length(display_name) <= 40
    )
  );

-- =============================================================================
-- ACTIVITY_EVENTS: Lightweight event tracking for feeds and analytics
-- =============================================================================

CREATE TABLE activity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activity_events_user_id ON activity_events(user_id);
CREATE INDEX idx_activity_events_created_at ON activity_events(created_at);
CREATE INDEX idx_activity_events_type ON activity_events(type);

ALTER TABLE activity_events ENABLE ROW LEVEL SECURITY;

-- Service role writes; no app read policy yet (10.2 will add feed)
CREATE POLICY "activity_events_service_only"
  ON activity_events FOR ALL
  USING (false)
  WITH CHECK (false);
