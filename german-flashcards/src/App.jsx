import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import Flashcard from "./components/Flashcard.jsx";
import Auth from "./components/Auth.jsx";
import DeckEditor from "./components/DeckEditor.jsx";
import Stats from "./components/Stats.jsx";
import StudyModeSwitch from "./components/StudyModeSwitch.jsx";
import CaseFlashcard from "./components/CaseFlashcard.jsx";
import { CASE_EXAMPLES } from "./lib/caseExamples.js";
import { supabase, hasSupabase } from "./lib/supabaseClient.js";
import {
  loadCards,
  saveCard,
  deleteCard,
  resetAll,
  saveReviews,
  loadParams,
  loadCaseCards,
  saveCaseCard,
  resetCaseCards,
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
  buildItemQueue,
  itemCounts,
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
  const [caseCards, setCaseCards] = useState(null);
  const [caseQueue, setCaseQueue] = useState([]);

  const [revealed, setRevealed] = useState(false);
  const [aGrade, setAGrade] = useState(null);
  const [mGrade, setMGrade] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [incorrectAttempt, setIncorrectAttempt] = useState(0);
  const cardShownAt = useRef(Date.now());
  const [stat, setStat] = useState({ done: 0, artMissed: 0, meaMissed: 0 });
  const [view, setView] = useState("review"); // "review" | "deck" | "stats"
  const [studyMode, setStudyMode] = useState(() => {
    try {
      return localStorage.getItem("artikel.studyMode.v1") || "article";
    } catch {
      return "article";
    }
  });
  const [casePos, setCasePos] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem("artikel.studyMode.v1", studyMode);
    } catch {}
  }, [studyMode]);

  // Load learned weights (if any), then the deck.
  useEffect(() => {
    if (!userId || cards !== null) return;
    let alive = true;
    (async () => {
      try {
        const w = await loadParams(userId);
        setUserParams(w); // defaults if null
        const [c, loadedCaseCards] = await Promise.all([
          loadCards(userId),
          loadCaseCards(userId),
        ]);
        if (!alive) return;
        setCards(c);
        setQueue(buildQueue(c, { newPerDay: NEW_PER_DAY }));
        setCaseCards(loadedCaseCards);
        setCaseQueue(buildItemQueue(loadedCaseCards, { newPerDay: NEW_PER_DAY }));
        setPos(0);
      } catch (e) {
        if (alive) setLoadError(e.message || "Dein Stapel konnte nicht geladen werden.");
      }
    })();
    return () => {
      alive = false;
    };
  }, [userId, cards]);

  const current = queue[pos];
  const finished = pos >= queue.length;
  const currentCaseCard = caseQueue[casePos];
  const caseFinished = casePos >= caseQueue.length;

  useEffect(() => {
    if (!current) return;
    cardShownAt.current = Date.now();
    setRevealed(false);
    setAGrade(null);
    setMGrade(null);
    setSelectedArticle(null);
    setIncorrectAttempt(0);
  }, [current?.id, pos]);

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
      saveCard(userId, updated, next).catch((e) => setLoadError(e.message || "Speichern fehlgeschlagen."));
      saveReviews(userId, rows).catch(() => {});

      setStat((s) => ({
        done: s.done + 1,
        artMissed: s.artMissed + (a === RATING.MISSED ? 1 : 0),
        meaMissed: s.meaMissed + (m === RATING.MISSED ? 1 : 0),
      }));
      setRevealed(false);
      setAGrade(null);
      setMGrade(null);
      setSelectedArticle(null);
      setIncorrectAttempt(0);
      setPos((p) => p + 1);
    },
    [cards, current, userId]
  );

  const chooseArticle = useCallback(
    (article) => {
      if (revealed || !current) return;
      const correct = article === current.gender;
      if (!correct) {
        setAGrade(RATING.MISSED);
        setSelectedArticle(null);
        setIncorrectAttempt((attempt) => attempt + 1);
        return;
      }
      const elapsed = Date.now() - cardShownAt.current;
      const grade = aGrade === RATING.MISSED
        ? RATING.MISSED
        : elapsed <= 3000
          ? RATING.EASY
          : RATING.GOT;
      setSelectedArticle(article);
      setAGrade(grade);
      setRevealed(true);
    },
    [aGrade, current, revealed]
  );
  const gradeMeaning = useCallback(
    (g) => {
      setMGrade(g);
      if (aGrade != null) commit(aGrade, g);
    },
    [aGrade, commit]
  );

  const completeCase = useCallback(
    (rating) => {
      if (!currentCaseCard || rating == null) return;
      const now = Date.now();
      const result = review(currentCaseCard.schedule, rating, now);
      const updated = { ...currentCaseCard, schedule: result.item };
      const next = caseCards.map((card) => card.id === updated.id ? updated : card);
      setCaseCards(next);
      saveCaseCard(userId, updated, next).catch((error) =>
        setLoadError(error.message || "Der Fortschritt konnte nicht gespeichert werden.")
      );
      saveReviews(userId, [{
        card_id: updated.id,
        track: "case",
        rating,
        state: result.log.state,
        elapsed_days: result.log.elapsed_days,
        stability: result.item.stability,
        difficulty: result.item.difficulty,
        reviewed_at: new Date(now).toISOString(),
      }]).catch(() => {});
      setCasePos((position) => position + 1);
    },
    [caseCards, currentCaseCard, userId]
  );

  useEffect(() => {
    function onKey(e) {
      if (finished || cards === null || view !== "review" || studyMode !== "article") return;
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "SELECT" || t.tagName === "TEXTAREA")) return;
      if (!revealed && ["1", "2", "3"].includes(e.key)) {
        e.preventDefault();
        chooseArticle({ 1: "der", 2: "die", 3: "das" }[e.key]);
        return;
      }
      if (revealed && ["1", "2", "3"].includes(e.key)) {
        e.preventDefault();
        const r = { 1: RATING.MISSED, 2: RATING.GOT, 3: RATING.EASY }[e.key];
        gradeMeaning(r);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [revealed, finished, cards, view, studyMode, chooseArticle, gradeMeaning]);

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
  const caseStats = useMemo(
    () => caseCards ? itemCounts(caseCards) : { due: 0, fresh: 0, learned: 0, total: 0 },
    [caseCards]
  );

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
    setSelectedArticle(null);
    setIncorrectAttempt(0);
    setStat({ done: 0, artMissed: 0, meaMissed: 0 });
  }
  async function hardReset() {
    const [fresh, freshCaseCards] = await Promise.all([resetAll(userId), resetCaseCards(userId)]);
    setCards(fresh);
    setQueue(buildQueue(fresh, { newPerDay: NEW_PER_DAY }));
    setPos(0);
    setCaseCards(freshCaseCards);
    setCaseQueue(buildItemQueue(freshCaseCards, { newPerDay: NEW_PER_DAY }));
    setCasePos(0);
    setRevealed(false);
    setAGrade(null);
    setMGrade(null);
    setSelectedArticle(null);
    setIncorrectAttempt(0);
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
    saveCard(userId, card, next).catch((e) => setLoadError(e.message || "Die Karte konnte nicht hinzugefügt werden."));
  }
  function updateCard(id, fields) {
    let changed = null;
    const next = cards.map((c) => (c.id === id ? (changed = { ...c, ...fields }) : c));
    setCards(next);
    setQueue((q) => q.map((c) => (c.id === id ? { ...c, ...fields } : c)));
    if (changed) saveCard(userId, changed, next).catch((e) => setLoadError(e.message || "Speichern fehlgeschlagen."));
  }
  function removeCard(id) {
    const next = cards.filter((c) => c.id !== id);
    setCards(next);
    setQueue(buildQueue(next, { newPerDay: NEW_PER_DAY }));
    setPos(0);
    deleteCard(userId, id, next).catch((e) => setLoadError(e.message || "Löschen fehlgeschlagen."));
  }

  async function signOut() {
    await supabase.auth.signOut();
    setCards(null);
    setQueue([]);
    setCaseCards(null);
    setCaseQueue([]);
    setPos(0);
    setView("review");
  }

  // ---- gates ----
  if (hasSupabase && !authReady) return <div className="splash">Wird geladen…</div>;
  if (hasSupabase && !session) return <Auth />;
  if (cards === null || caseCards === null) return <div className="splash">{loadError || "Dein Stapel wird geladen…"}</div>;

  const progress = studyMode === "case"
    ? caseQueue.length ? Math.min(casePos / caseQueue.length, 1) : 0
    : queue.length
      ? Math.min(pos / queue.length, 1)
      : 0;
  const currentCaseExample = currentCaseCard
    ? CASE_EXAMPLES.find((example) => example.id === currentCaseCard.id)
    : null;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">artikel<span className="brand__dot">.</span></div>
        <div className="topbar__right">
          <div className="topbar__stats">
            {studyMode === "case" ? (
              <>
                <span><b>{caseStats.due}</b> fällig</span>
                <span><b>{caseStats.fresh}</b> neu</span>
                <span><b>{caseStats.learned}</b> gelernt</span>
              </>
            ) : (
              <>
                <span><b>{stats.due}</b> fällig</span>
                <span><b>{stats.fresh}</b> neu</span>
                <span><b>{stats.learned}</b> gelernt</span>
              </>
            )}
          </div>
          <button className={"navlink" + (view === "stats" ? " navlink--on" : "")} onClick={() => setView(view === "stats" ? "review" : "stats")}>Statistik</button>
          <button className={"navlink" + (view === "deck" ? " navlink--on" : "")} onClick={() => setView(view === "deck" ? "review" : "deck")}>Stapel</button>
          {hasSupabase && <button className="signout" onClick={signOut} title="Abmelden">⏻</button>}
        </div>
      </header>

      {view === "review" && (
        <>
          <StudyModeSwitch value={studyMode} onChange={setStudyMode} />
          <div className="progress" aria-hidden="true">
            <div className="progress__fill" style={{ transform: `scaleX(${progress})` }} />
          </div>
        </>
      )}

      {view === "deck" ? (
        <DeckEditor cards={cards} onAdd={addCard} onUpdate={updateCard} onDelete={removeCard} onClose={() => setView("review")} />
      ) : view === "stats" ? (
        <Stats userId={userId} cards={cards} onClose={() => setView("review")} />
      ) : (
        <main className="stage">
          {studyMode === "case" && !caseFinished && currentCaseExample ? (
            <CaseFlashcard
              key={currentCaseExample.id}
              example={currentCaseExample}
              onComplete={completeCase}
            />
          ) : studyMode === "case" ? (
            <div className="done">
              <h2>Fertig f&uuml;r jetzt.</h2>
              <p className="done__line">Alle fälligen Fallbeispiele wurden wiederholt.</p>
              <div className="done__actions">
                <button className="btn btn--ghost" onClick={() => {
                  setCaseQueue(buildItemQueue(caseCards, { newPerDay: NEW_PER_DAY }));
                  setCasePos(0);
                }}>Warteschlange neu aufbauen</button>
              </div>
            </div>
          ) : !finished && current ? (
            <Flashcard
              key={current.id + pos}
              card={current}
              revealed={revealed}
              selectedArticle={selectedArticle}
              incorrectAttempt={incorrectAttempt}
              mGrade={mGrade}
              onChooseArticle={chooseArticle}
              onGradeMeaning={gradeMeaning}
            />
          ) : (
            <div className="done">
              <h2>Fertig f&uuml;r jetzt.</h2>
              <p className="done__line">
                {stat.done} Karten wiederholt
                {stat.done > 0 && (
                  <>
                    {" \u2014 "}
                    {stat.artMissed} Artikel nicht gewusst,{" "}
                    {stat.meaMissed} Bedeutungen nicht gewusst
                  </>
                )}
                .
              </p>
              {nextDueLabel && <p className="done__next">Die nächsten Karten sind in etwa {nextDueLabel} fällig.</p>}
              <div className="done__actions">
                {ahead.length > 0 && <button className="btn" onClick={reviewAhead}>Vorab wiederholen ({ahead.length})</button>}
                <button className="btn btn--ghost" onClick={rebuild}>Warteschlange neu aufbauen</button>
                <button className="btn btn--ghost" onClick={hardReset}>Fortschritt zurücksetzen</button>
              </div>
            </div>
          )}
        </main>
      )}

      <footer className="footer">
        <span>
          {studyMode === "case"
            ? <>Nominativ = blau &middot; Dativ = orange &middot; Akkusativ = mint</>
            : <>der = blau &middot; die = orange &middot; das = mint</>}
        </span>
      </footer>
    </div>
  );
}
