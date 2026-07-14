-- 002_reviews.sql — the behavioral substrate the model learns from.
-- Every grade on every track is logged here; the optimizer reads this to refit
-- the FSRS weights to each user. user_params stores those learned weights.

create table if not exists public.reviews (
  id           bigint generated always as identity primary key,
  user_id      uuid not null references auth.users (id) on delete cascade,
  card_id      text not null,
  track        text not null check (track in ('article', 'meaning')),
  rating       int  not null,                 -- FSRS rating: 1 Again, 2 Hard, 3 Good, 4 Easy
  state        int,                            -- card state BEFORE this review
  elapsed_days numeric,                        -- days since the previous review of this item
  stability    numeric,                        -- resulting stability (days)
  difficulty   numeric,
  reviewed_at  timestamptz not null default now()
);

create index if not exists reviews_user_time_idx on public.reviews (user_id, reviewed_at);
create index if not exists reviews_user_track_idx on public.reviews (user_id, track);

alter table public.reviews enable row level security;
create policy "own reviews: select" on public.reviews for select using (auth.uid() = user_id);
create policy "own reviews: insert" on public.reviews for insert with check (auth.uid() = user_id);
create policy "own reviews: delete" on public.reviews for delete using (auth.uid() = user_id);

-- Learned FSRS weights per user (written by the optimizer; null => use defaults).
create table if not exists public.user_params (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  w           jsonb not null,                 -- array of 21 FSRS-6 weights
  trained_on  int,                            -- number of reviews used to fit
  updated_at  timestamptz not null default now()
);

alter table public.user_params enable row level security;
create policy "own params: all" on public.user_params
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
