-- Add a separate FSRS track for case-card translations.
alter table public.case_cards add column if not exists meaning_state jsonb;
update public.case_cards
  set meaning_state = schedule_state
  where meaning_state is null;
alter table public.case_cards alter column meaning_state set not null;

create index if not exists case_cards_user_meaning_due_idx
  on public.case_cards (user_id, ((meaning_state ->> 'due')));
