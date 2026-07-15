-- 004_fix_due_index_immutability.sql
--
-- Casting text to timestamptz is not immutable in PostgreSQL, so it cannot be
-- used in an index expression. ts-fsrs emits canonical UTC ISO strings, which
-- preserve chronological order when indexed directly as text.

drop index if exists public.cards_article_due_idx;
drop index if exists public.cards_meaning_due_idx;

create index cards_article_due_idx
  on public.cards ((article_state ->> 'due'));
create index cards_meaning_due_idx
  on public.cards ((meaning_state ->> 'due'));
