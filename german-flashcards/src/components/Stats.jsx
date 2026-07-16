import React, { useEffect, useState } from "react";
import { loadReviews } from "../lib/storage.js";
import { computeInsights, trackComparison } from "../lib/insights.js";

function pct(x) {
  return x == null ? "—" : `${Math.round(x * 100)}%`;
}
function days(x) {
  if (x == null) return "—";
  if (x < 1) return "<1d";
  if (x < 30) return `${Math.round(x)} T.`;
  if (x < 365) return `${Math.round(x / 30)} Mon.`;
  return `${(x / 365).toFixed(1)} J.`;
}

export default function Stats({ userId, cards, onClose }) {
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    let alive = true;
    loadReviews(userId)
      .then((r) => alive && setReviews(r))
      .catch(() => alive && setReviews([]));
    return () => {
      alive = false;
    };
  }, [userId]);

  if (reviews === null) return <div className="stats"><p className="stats__empty">Wird geladen…</p></div>;

  const ins = computeInsights(cards, reviews);
  const compare = trackComparison(ins);

  return (
    <div className="stats">
      <div className="stats__head">
        <h2>Was das Modell gelernt hat</h2>
        <button className="btn btn--ghost" onClick={onClose}>Fertig</button>
      </div>

      {ins.total === 0 ? (
        <p className="stats__empty">
          Noch keine Daten — wiederhole ein paar Karten, dann füllt sich dieser
          Bereich. Jede Bewertung hilft dem Modell beim Lernen.
        </p>
      ) : (
        <>
          <div className="stats__big">
            <div className="stats__metric">
              <span className="stats__num">{ins.total}</span>
              <span className="stats__lab">Wiederholungen</span>
            </div>
            <div className="stats__metric">
              <span className="stats__num">{pct(ins.overallRecall)}</span>
              <span className="stats__lab">Erinnerungsquote</span>
            </div>
          </div>

          {compare && <p className="stats__insight">{compare}</p>}

          <div className="stats__tracks">
            <div className="stats__track" data-tone="article">
              <span className="stats__tname">Artikel</span>
              <div className="stats__trow"><span>Erinnerung</span><b>{pct(ins.article.recall)}</b></div>
              <div className="stats__trow"><span>Ø Gedächtnis</span><b>{days(ins.article.stability)}</b></div>
              <div className="stats__trow"><span>Wiederholungen</span><b>{ins.article.reviews}</b></div>
            </div>
            <div className="stats__track" data-tone="meaning">
              <span className="stats__tname">Bedeutungen</span>
              <div className="stats__trow"><span>Erinnerung</span><b>{pct(ins.meaning.recall)}</b></div>
              <div className="stats__trow"><span>Ø Gedächtnis</span><b>{days(ins.meaning.stability)}</b></div>
              <div className="stats__trow"><span>Wiederholungen</span><b>{ins.meaning.reviews}</b></div>
            </div>
          </div>

          <p className="stats__foot">
            „Ø Gedächtnis“ zeigt, wie lange FSRS erwartet, dass du dich momentan
            erinnerst. Der Wert wächst bei jeder richtigen Antwort und wird bei
            einer falschen Antwort zurückgesetzt. Nach einigen hundert
            Wiederholungen kann sich das Modell an deine persönliche Lernkurve anpassen.
          </p>
        </>
      )}
    </div>
  );
}
