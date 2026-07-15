-- 001_init.sql — review state for the article trainer.
-- Each row is one card; its two FSRS items live in jsonb columns so the
-- scheduler stays in app code and the schema never has to change.

create extension if not exists "pgcrypto";

create table if not exists public.cards (
  id            text not null,
  user_id       uuid not null references auth.users (id) on delete cascade,
  noun          text not null,
  gender        text not null check (gender in ('der', 'die', 'das')),
  en            text not null,
  article_state jsonb not null,   -- { ease, interval, reps, due }
  meaning_state jsonb not null,
  updated_at    timestamptz not null default now(),
  primary key (user_id, id)
);

-- Fast "what's due" lookups. ts-fsrs serializes due as an ISO timestamp.
create index if not exists cards_article_due_idx
  on public.cards ((article_state ->> 'due'));
create index if not exists cards_meaning_due_idx
  on public.cards ((meaning_state ->> 'due'));

-- Row-level security: a user only ever sees their own cards.
alter table public.cards enable row level security;

create policy "own cards: select" on public.cards
  for select using (auth.uid() = user_id);
create policy "own cards: insert" on public.cards
  for insert with check (auth.uid() = user_id);
create policy "own cards: update" on public.cards
  for update using (auth.uid() = user_id);
create policy "own cards: delete" on public.cards
  for delete using (auth.uid() = user_id);
