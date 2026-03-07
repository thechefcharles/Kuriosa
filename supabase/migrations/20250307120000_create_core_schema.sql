-- Kuriosa core schema
-- Phase 3.1: Database foundation (no RLS, no auth UI)

-- profiles: user identity and high-level progress
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  curiosity_score INTEGER NOT NULL DEFAULT 0,
  current_level INTEGER NOT NULL DEFAULT 1,
  total_xp INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- categories: broad curiosity categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);

-- topics: master curiosity topics
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  subcategory TEXT,
  difficulty_level TEXT,
  estimated_minutes INTEGER,
  hook_text TEXT,
  lesson_text TEXT NOT NULL,
  surprising_fact TEXT,
  real_world_relevance TEXT,
  audio_url TEXT,
  image_url TEXT,
  is_random_featured BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'draft',
  source_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_topics_slug ON topics(slug);
CREATE INDEX idx_topics_category_id ON topics(category_id);

-- topic_tags: flexible tags for topics
CREATE TABLE topic_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(topic_id, tag)
);

CREATE INDEX idx_topic_tags_topic_id ON topic_tags(topic_id);

-- topic_followups: suggested follow-up questions
CREATE TABLE topic_followups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  answer_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  difficulty_level TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_topic_followups_topic_id ON topic_followups(topic_id);

-- topic_trails: topic-to-topic recommendation paths
CREATE TABLE topic_trails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  to_topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  reason_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (from_topic_id != to_topic_id)
);

CREATE INDEX idx_topic_trails_from ON topic_trails(from_topic_id);

-- quizzes: topic challenge questions
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  quiz_type TEXT NOT NULL,
  question_text TEXT NOT NULL,
  explanation_text TEXT,
  difficulty_level TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quizzes_topic_id ON quizzes(topic_id);

-- quiz_options: answer options for quizzes
CREATE TABLE quiz_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quiz_options_quiz_id ON quiz_options(quiz_id);

-- daily_curiosity: featured topic per date
CREATE TABLE daily_curiosity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  theme TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_daily_curiosity_date ON daily_curiosity(date);

-- user_topic_history: tracks user consumption and completion
CREATE TABLE user_topic_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  mode_used TEXT,
  quiz_score INTEGER,
  xp_earned INTEGER,
  was_daily_feature BOOLEAN NOT NULL DEFAULT FALSE,
  was_random_spin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_topic_history_user_id ON user_topic_history(user_id);
CREATE INDEX idx_user_topic_history_topic_id ON user_topic_history(topic_id);

-- user_followup_questions: user-entered questions and answers
CREATE TABLE user_followup_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  answer_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_followup_questions_user_id ON user_followup_questions(user_id);

-- badges: badge definitions
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  criteria_type TEXT NOT NULL,
  criteria_value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_badges_slug ON badges(slug);

-- user_badges: badge unlocks
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
