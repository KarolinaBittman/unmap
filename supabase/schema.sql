-- Users (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users primary key,
  name text,
  created_at timestamp default now(),
  current_stage integer default 1,
  onboarding_complete boolean default false
);

-- User's answers and values collected during journey
create table user_profile_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  key text not null,        -- e.g. 'wheel_career_score', 'ikigai_love', 'point_b_1y'
  value text not null,
  stage integer,
  created_at timestamp default now()
);

-- Conversation history per stage
create table conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  stage integer not null,
  role text not null,       -- 'user' or 'assistant'
  content text not null,
  created_at timestamp default now()
);

-- Daily check-ins for Emotional Baseline chart
create table checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  mood_score integer,       -- 1-10
  note text,
  created_at timestamp default now()
);
