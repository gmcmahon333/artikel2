# artikel — adaptive German trainer

A flashcard trainer for German nouns that learns from how *you* forget. Every
card tracks two things on separate schedules — the article (der/die/das) and the
meaning — so a word whose gender you keep blowing resurfaces fast for that reason
while the meaning is allowed to graduate.

Signature: **gender as light.** On reveal the card glows in its gender's color
(der = blue, die = rose, das = mint), so the color becomes muscle memory.

## The algorithm: FSRS + a behavioral log

The scheduler is **FSRS-6** (the model that's now Anki's default), not fixed-rule
SM-2. It learns from behavior in two layers:

1. **Per item, immediately.** Each review updates that item's *stability* (how
   long the memory lasts), *difficulty*, and *retrievability* using your actual
   grade and the actual time since you last saw it. So intervals reflect how you
   personally did on that word — live, from review one.

2. **Per user, over time.** Every grade is written to a `reviews` log
   (`src/lib/engine.js` returns an FSRS log entry per track; `storage.js` persists
   it). That log is the raw material to refit FSRS's 21 weights to *your*
   forgetting curve. Drop the learned weights into `setUserParams(w)` and the
   whole model bends to you. Until you've logged enough, FSRS-6 defaults act as a
   sensible prior.

The **Stats** tab reads the log and shows what it's learned — recall rate and
average memory length per track — including lines like *"your genders fade ~2×
faster than your meanings,"* which falls straight out of the dual-track log.

### Wiring up the optimizer (the per-user refit)

The log is already being recorded; the refit is the one piece left to add when
you want it. Two clean options on your stack:

- **Supabase Edge Function (recommended):** a scheduled function pulls the user's
  `reviews`, runs the FSRS optimizer, and upserts the result into `user_params`.
  The optimizer exists as a Python package (`fsrs-optimizer`) or a Rust core
  (`fsrs-rs`) you can call from the function.
- **In-browser (WASM):** `fsrs-rs` compiled to WASM (`fsrs-browser`) can refit
  client-side on demand — no server, heavier bundle.

The app already calls `loadParams(userId)` on startup and feeds the result to
`setUserParams`, so once `user_params` has a row, personalization turns on with
no further code changes.

## Run it (no setup)

```bash
npm install
npm run dev
```

http://localhost:5173. With no env vars set it runs on `localStorage` — no login,
single browser, reviews logged locally so Stats still works.

- **Space / Enter** — reveal
- **1 / 2 / 3** — grade the active row (Missed / Got it / Easy → FSRS
  Again / Good / Easy); article first, then meaning, then it advances.

## Multi-device sync (Supabase + auth)

1. Run **both** migrations in the SQL editor:
   `supabase/migrations/001_init.sql` (cards) and `002_reviews.sql`
   (review log + learned-weights table). All tables have row-level security.
2. Email auth is on by default; turn off "Confirm email" for easy local testing.
3. Copy `.env.example` to `.env` with your project URL + anon key, restart.

## Deploy to Vercel

`vercel`, then add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the
project's environment variables and redeploy.

## Where things live

- `src/lib/engine.js` — FSRS scheduling, queue building, dual-track review + log
- `src/lib/insights.js` — turns the review log into the Stats view
- `src/lib/deck.js` — ~65 seed nouns (gender-balanced; add your own)
- `src/lib/storage.js` — the only file that knows about persistence; cards,
  review log, and learned params, Supabase or localStorage
- `src/components/` — Flashcard, GradeBar, DeckEditor, Stats, Auth
- `supabase/migrations/` — schema + RLS
