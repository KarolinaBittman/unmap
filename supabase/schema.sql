-- ============================================================
-- Unmap — Supabase schema
-- Run this in the Supabase SQL editor (Dashboard → SQL editor)
-- ============================================================

-- ── Profiles ────────────────────────────────────────────────
create table if not exists profiles (
  id                  uuid references auth.users on delete cascade primary key,
  name                text,
  current_stage       integer     not null default 1,
  onboarding_complete boolean     not null default false,
  journey_progress    integer     not null default 0,
  point_b_clarity     integer     not null default 0,
  created_at          timestamptz not null default now()
);

-- Auto-create a profile row when a new user signs up
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── Wheel of Life scores ─────────────────────────────────────
create table if not exists wheel_scores (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references profiles (id) on delete cascade,
  career        integer     not null default 0,
  health        integer     not null default 0,
  relationships integer     not null default 0,
  money         integer     not null default 0,
  growth        integer     not null default 0,
  fun           integer     not null default 0,
  environment   integer     not null default 0,
  purpose       integer     not null default 0,
  updated_at    timestamptz not null default now(),
  unique (user_id)
);

-- ── Stage answers (JSONB, one row per stage per user) ────────
create table if not exists stage_answers (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references profiles (id) on delete cascade,
  stage       integer     not null,             -- 1 onboarding | 2 blocks | 3 identity | 4 pointb
  answers     jsonb       not null default '{}',
  updated_at  timestamptz not null default now(),
  unique (user_id, stage)
);

-- ── Daily check-ins ──────────────────────────────────────────
create table if not exists checkins (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references profiles (id) on delete cascade,
  mood_score  integer,
  note        text,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table profiles      enable row level security;
alter table wheel_scores  enable row level security;
alter table stage_answers enable row level security;
alter table checkins      enable row level security;

-- profiles
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- wheel_scores
create policy "Users can view own wheel scores"
  on wheel_scores for select using (auth.uid() = user_id);
create policy "Users can upsert own wheel scores"
  on wheel_scores for insert with check (auth.uid() = user_id);
create policy "Users can update own wheel scores"
  on wheel_scores for update using (auth.uid() = user_id);

-- stage_answers
create policy "Users can view own stage answers"
  on stage_answers for select using (auth.uid() = user_id);
create policy "Users can upsert own stage answers"
  on stage_answers for insert with check (auth.uid() = user_id);
create policy "Users can update own stage answers"
  on stage_answers for update using (auth.uid() = user_id);

-- checkins
create policy "Users can view own checkins"
  on checkins for select using (auth.uid() = user_id);
create policy "Users can insert own checkins"
  on checkins for insert with check (auth.uid() = user_id);
