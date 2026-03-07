# Kuriosa Database Schema

## Overview

Phase 3.1 created the foundational Supabase schema for Kuriosa. All tables use `snake_case`, UUID primary keys, and `created_at`/`updated_at` where appropriate.

## Table Relationships

```
auth.users (Supabase built-in)
    └── profiles (user identity & progress)
            ├── user_topic_history
            ├── user_followup_questions
            └── user_badges

categories
    └── topics
            ├── topic_tags
            ├── topic_followups
            ├── topic_trails (from/to)
            ├── quizzes → quiz_options
            ├── daily_curiosity
            └── user_topic_history

badges
    └── user_badges
```

## Tables

### profiles
User identity and high-level progress. `id` matches `auth.users.id`.

- **id** — UUID, FK to auth.users
- **username**, **display_name**, **avatar_url** — Identity
- **curiosity_score**, **total_xp**, **current_level** — Gamification
- **current_streak**, **longest_streak**, **last_active_date** — Streaks
- **created_at**, **updated_at**

### categories
Broad curiosity categories (e.g. Science, History).

- **id**, **name**, **slug** (unique), **icon**, **description**, **sort_order**
- **created_at**, **updated_at**

### topics
Master curiosity topics.

- **id**, **title**, **slug** (unique), **category_id** (FK)
- **subcategory**, **difficulty_level**, **estimated_minutes**
- **hook_text**, **lesson_text**, **surprising_fact**, **real_world_relevance**
- **audio_url**, **image_url**
- **is_random_featured**, **status** (e.g. draft, published), **source_type**
- **created_at**, **updated_at**

### topic_tags
Flexible tags for topics. Unique on `(topic_id, tag)`.

### topic_followups
Predefined follow-up Q&A for topics.

- **topic_id**, **question_text**, **answer_text**, **sort_order**, **difficulty_level**

### topic_trails
Topic-to-topic recommendations.

- **from_topic_id**, **to_topic_id** (both FK to topics), **reason_text**, **sort_order**

### quizzes
Challenge questions for topics.

- **topic_id**, **quiz_type** (e.g. multiple_choice), **question_text**, **explanation_text**, **difficulty_level**, **sort_order**

### quiz_options
Answer options for quizzes.

- **quiz_id**, **option_text**, **is_correct**

### daily_curiosity
Featured topic per date. **date** is unique.

- **date**, **topic_id**, **theme**

### user_topic_history
User consumption and completion.

- **user_id**, **topic_id**
- **started_at**, **completed_at**, **mode_used**
- **quiz_score**, **xp_earned**
- **was_daily_feature**, **was_random_spin**
- **created_at**, **updated_at**

### user_followup_questions
User-entered Q&A for topics.

- **user_id**, **topic_id**, **question_text**, **answer_text**

### badges
Badge definitions.

- **name**, **slug** (unique), **description**, **icon**
- **criteria_type**, **criteria_value**

### user_badges
Badge unlocks. Unique on `(user_id, badge_id)`.

- **user_id**, **badge_id**, **earned_at**

## Design Decisions

- **Text over enums** — `status`, `quiz_type`, `difficulty_level`, etc. use TEXT for flexibility.
- **Indexes** — Added for slug lookups, foreign keys, and common filters (user_id, topic_id, date).
- **Defaults** — Counters (curiosity_score, total_xp, streaks) default to 0/1.
- **profiles.id** — References `auth.users(id)`; profile is created when a user signs up.

## What Phase 3.1 Implemented

- All 13 tables above
- Foreign keys, unique constraints, basic indexes
- Seed data for categories and badges

## What Remains (Later Phases)

- **RLS (Row Level Security)** — Not yet applied
- **Auth triggers** — Auto-create profile on signup
- **Topic and quiz content** — Not seeded yet
