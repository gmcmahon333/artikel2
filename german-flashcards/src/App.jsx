import React, { useEffect, useMemo, useState, useCallback } from "react";
import Flashcard from "./components/Flashcard.jsx";
import Auth from "./components/Auth.jsx";
import DeckEditor from "./components/DeckEditor.jsx";
import Stats from "./components/Stats.jsx";
import { supabase, hasSupabase } from "./lib/supabaseClient.js";
import {
  loadCards,
  saveCard,
  deleteCard,
  resetAll,
  saveReviews,
  loadParams,
} from "./lib/storage.js";
import {
  review,
  buildQueue,
  buildAheadQueue,
  cardNextDue,
  humanInterval,
  counts,
  freshItem,
  setUserParams,
  RATING,
} from "./lib/engine.js";

const NEW_PER_DAY = 15;
const DAY = 864e5;

export default function App() {
  // ---- auth / session ----
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(!hasSupabase);

  useEffect(() => {
    if (!hasSupabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const userId = hasSupabase ? session?.user?.id ?? null : "local";

  // ---- deck state ----
  const [cards, setCards] = useState(null);
  const [queue, setQueue] = useState([]);
  const [pos, setPos] = useState(0);
  const [loadError, setLoadError] = useState(null);

  const [revealed, setRevealed] = useState(false);
  const [aGrade, setAGrade] = useState(null);
  const [mGrade, setMGrade] = useState(null);
  const [activeAxis, setActiveAxis] = useState("article");
  const [stat, setStat] = useState({ done: 0, artMissed: 0, meaMissed: 0 });
  const [view, setView] = useState("review"); // "review" | "deck" | "stats"

  // Load learned weights (if any), then the deck.
  useEffect(() => {
    if (!userId || cards !== null) return;
    let alive = true;
    (async () => {
      try {
        const w = await loadParams(userId);
        setUserParams(w); // defaults if null
        const c = await loadCards(userId);
        if (!alive) return;
        setCards(c);
        setQueue(buildQueue(c, { newPerDay: NEW_PER_DAY }));
        setPos(0);
      } catch (e) {
        if (alive) setLoadError(e.message || "Could not load your deck.");
      }
    })();
    return () => {
      alive = false;
    };
  }, [userId, cards]);

  const current = queue[pos];
  const finished = pos >= queue.length;

  const reveal = useCallback(() => setRevealed((r) => r || true), []);

  const commit = useCallback(
    (a, m) => {
      const now = Date.now();
      const ra = review(current.article, a, now);
      const rm = review(current.meaning, m, now);
      const updated = { ...current, article: ra.item, meaning: rm.item };
      const next = cards.map((c) => (c.id === current.id ? updated : c));
      setCards(next);

      const at = new Date(now).toISOString();
      const rows = [
        { card_id: current.id, track: "article", rating: a, state: ra.log.state,
          elapsed_days: ra.log.elapsed_days, stability: ra.item.stability,
          difficulty: ra.item.difficulty, reviewed_at: at },
        { card_id: current.id, track: "meaning", rating: m, state: rm.log.state,
          elapsed_days: rm.log.elapsed_days, stability: rm.item.stability,
          difficulty: rm.item.difficulty, reviewed_at: at },
      ];
      saveCard(userId, updated, next).catch((e) => setLoadError(e.message || "Couldn't save."));
      saveReviews(userId, rows).catch(() => {});

      setStat((s) => ({
        done: s.done + 1,
        artMissed: s.artMissed + (a === RATING.MISSED ? 1 : 0),
        meaMissed: s.meaMissed + (m === RATING.MISSED ? 1 : 0),
      }));
      setRevealed(false);
      setAGrade(null);
      setMGrade(null);
      setActiveAxis("article");
      setPos((p) => p + 1);
    },
    [cards, current, userId]
  );

  const gradeArticle = useCallback(
    (g) => {
      setAGrade(g);
      setActiveAxis("meaning");
      if (mGrade != null) commit(g, mGrade);
    },
    [mGrade, commit]
  );
  const gradeMeaning = useCallback(
    (g) => {
      setMGrade(g);
      if (aGrade != null) commit(aGrade, g);
      else setActiveAxis("article");
    },
    [aGrade, commit]
  );

  useEffect(() => {
    function onKey(e) {
      if (finished || cards === null || view !== "review") return;
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "SELECT" || t.tagName === "TEXTAREA")) return;
      if (!revealed && (e.code === "Space" || e.code === "Enter")) {
        e.preventDefault();
        reveal();
        return;
      }
      if (revealed && ["1", "2", "3"].includes(e.key)) {
        e.preventDefault();
        const r = { 1: RATING.MISSED, 2: RATING.GOT, 3: RATING.EASY }[e.key];
        if (activeAxis === "article") gradeArticle(r);
        else gradeMeaning(r);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [revealed, finished, activeAxis, cards, view, reveal, gradeArticle, gradeMeaning]);

  const stats = useMemo(
    () => (cards ? counts(cards) : { due: 0, fresh: 0, learned: 0, total: 0 }),
    [cards]
  );
  const nextDueLabel = useMemo(() => {
    if (!cards || !cards.length) return null;
    const soonest = Math.min(...cards.map(cardNextDue));
    return humanInterval(Math.max(0, Math.ceil((soonest - Date.now()) / DAY)));
  }, [cards]);
  const ahead = useMemo(() => (cards ? buildAheadQueue(cards) : []), [cards]);

  function rebuild() {
    setQueue(buildQueue(cards, { newPerDay: NEW_PER_DAY }));
    setPos(0);
    setStat({ done: 0, artMissed: 0, meaMissed: 0 });
  }
  function reviewAhead() {
    setQueue(buildAheadQueue(cards));
    setPos(0);
    setRevealed(false);
    setAGrade(null);
    setMGrade(null);
    setActiveAxis("article");
    setStat({ done: 0, artMissed: 0, meaMissed: 0 });
  }
  async function hardReset() {
    const fresh = await resetAll(userId);
    setCards(fresh);
    setQueue(buildQueue(fresh, { newPerDay: NEW_PER_DAY }));
    setPos(0);
    setRevealed(false);
    setAGrade(null);
    setMGrade(null);
    setActiveAxis("article");
    setStat({ done: 0, artMissed: 0, meaMissed: 0 });
  }

  function addCard({ noun, gender, en }) {
    const now = Date.now();
    const card = {
      id: `c-${now}-${Math.random().toString(36).slice(2, 7)}`,
      noun, gender, en,
      article: freshItem(now),
      meaning: freshItem(now),
    };
    const next = [...cards, card];
    setCards(next);
    setQueue(buildQueue(next, { newPerDay: NEW_PER_DAY }));
    saveCard(userId, card, next).catch((e) => setLoadError(e.message || "Couldn't add card."));
  }
  function updateCard(id, fields) {
    let changed = null;
    const next = cards.map((c) => (c.id === id ? (changed = { ...c, ...fields }) : c));
    setCards(next);
    setQueue((q) => q.map((c) => (c.id === id ? { ...c, ...fields } : c)));
    if (changed) saveCard(userId, changed, next).catch((e) => setLoadError(e.message || "Couldn't save."));
  }
  function removeCard(id) {
    const next = cards.filter((c) => c.id !== id);
    setCards(next);
    setQueue(buildQueue(next, { newPerDay: NEW_PER_DAY }));
    setPos(0);
    deleteCard(userId, id, next).catch((e) => setLoadError(e.message || "Couldn't delete."));
  }

  async function signOut() {
    await supabase.auth.signOut();
    setCards(null);
    setQueue([]);
    setPos(0);
    setView("review");
  }

  // ---- gates ----
  if (hasSupabase && !authReady) return <div className="splash">Loading…</div>;
  if (hasSupabase && !session) return <Auth />;
  if (cards === null) return <div className="splash">{loadError || "Loading your deck…"}</div>;

  const progress = queue.length ? Math.min(pos / queue.length, 1) : 0;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">artikel<span className="brand__dot">.</span></div>
        <div className="topbar__right">
          <div className="topbar__stats">
            <span><b>{stats.due}</b> due</span>
            <span><b>{stats.fresh}</b> new</span>
            <span><b>{stats.learned}</b> learned</span>
          </div>
          <button className={"navlink" + (view === "stats" ? " navlink--on" : "")} onClick={() => setView(view === "stats" ? "review" : "stats")}>Stats</button>
          <button className={"navlink" + (view === "deck" ? " navlink--on" : "")} onClick={() => setView(view === "deck" ? "review" : "deck")}>Deck</button>
          {hasSupabase && <button className="signout" onClick={signOut} title="Sign out">⏻</button>}
        </div>
      </header>

      {view === "review" && (
        <div className="progress" aria-hidden="true">
          <div className="progress__fill" style={{ transform: `scaleX(${progress})` }} />
        </div>
      )}

      {view === "deck" ? (
        <DeckEditor cards={cards} onAdd={addCard} onUpdate={updateCard} onDelete={removeCard} onClose={() => setView("review")} />
      ) : view === "stats" ? (
        <Stats userId={userId} cards={cards} onClose={() => setView("review")} />
      ) : (
        <main className="stage">
          {!finished && current ? (
            <Flashcard
              key={current.id + pos}
              card={current}
              revealed={revealed}
              onReveal={reveal}
              aGrade={aGrade}
              mGrade={mGrade}
              activeAxis={activeAxis}
              onGradeArticle={gradeArticle}
              onGradeMeaning={gradeMeaning}
            />
          ) : (
            <div className="done">
              <h2>Fertig f&uuml;r jetzt.</h2>
              <p className="done__line">
                {stat.done} cards reviewed
                {stat.done > 0 && (
                  <>
                    {" \u2014 "}
                    {stat.artMissed} article{stat.artMissed === 1 ? "" : "s"} missed,{" "}
                    {stat.meaMissed} meaning{stat.meaMissed === 1 ? "" : "s"} missed
                  </>
                )}
                .
              </p>
              {nextDueLabel && <p className="done__next">Next cards due in about {nextDueLabel}.</p>}
              <div className="done__actions">
                {ahead.length > 0 && <button className="btn" onClick={reviewAhead}>Review ahead ({ahead.length})</button>}
                <button className="btn btn--ghost" onClick={rebuild}>Rebuild queue</button>
                <button className="btn btn--ghost" onClick={hardReset}>Reset progress</button>
              </div>
            </div>
          )}
        </main>
      )}

      <footer className="footer"><span>der = blue &middot; die = rose &middot; das = mint</span></footer>
    </div>
  );
}
