-- Independent FSRS scheduling for grammatical-case examples.
create table if not exists public.case_cards (
  id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  noun_id text not null,
  grammatical_case text not null check (grammatical_case in ('nominative', 'dative', 'accusative')),
  schedule_state jsonb not null,
  primary key (user_id, id)
);

alter table public.case_cards enable row level security;

create policy "Users manage their own case cards"
  on public.case_cards for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists case_cards_user_due_idx
  on public.case_cards (user_id, ((schedule_state ->> 'due')));

alter table public.reviews drop constraint if exists reviews_track_check;
alter table public.reviews
  add constraint reviews_track_check check (track in ('article', 'meaning', 'case'));
