-- 003_fix_due_indexes.sql — ts-fsrs stores card due dates as ISO timestamps.
--
-- The original indexes cast those values to bigint, causing inserts to fail
-- with "invalid input syntax for type bigint" as soon as Supabase was enabled.

drop index if exists public.cards_article_due_idx;
drop index if exists public.cards_meaning_due_idx;

create index cards_article_due_idx
  on public.cards (((article_state ->> 'due')::timestamptz));
create index cards_meaning_due_idx
  on public.cards (((meaning_state ->> 'due')::timestamptz));
