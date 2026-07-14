import React, { useEffect, useState } from "react";
import { loadReviews } from "../lib/storage.js";
import { computeInsights, trackComparison } from "../lib/insights.js";

function pct(x) {
  return x == null ? "—" : `${Math.round(x * 100)}%`;
}
function days(x) {
  if (x == null) return "—";
  if (x < 1) return "<1d";
  if (x < 30) return `${Math.round(x)}d`;
  if (x < 365) return `${Math.round(x / 30)}mo`;
  return `${(x / 365).toFixed(1)}y`;
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

  if (reviews === null) return <div className="stats"><p className="stats__empty">Loading…</p></div>;

  const ins = computeInsights(cards, reviews);
  const compare = trackComparison(ins);

  return (
    <div className="stats">
      <div className="stats__head">
        <h2>What it's learned</h2>
        <button className="btn btn--ghost" onClick={onClose}>Done</button>
      </div>

      {ins.total === 0 ? (
        <p className="stats__empty">
          Nothing yet — review some cards and this fills in. Every grade you give
          is logged and feeds the model.
        </p>
      ) : (
        <>
          <div className="stats__big">
            <div className="stats__metric">
              <span className="stats__num">{ins.total}</span>
              <span className="stats__lab">reviews logged</span>
            </div>
            <div className="stats__metric">
              <span className="stats__num">{pct(ins.overallRecall)}</span>
              <span className="stats__lab">recall rate</span>
            </div>
          </div>

          {compare && <p className="stats__insight">{compare}</p>}

          <div className="stats__tracks">
            <div className="stats__track" data-tone="article">
              <span className="stats__tname">Articles</span>
              <div className="stats__trow"><span>recall</span><b>{pct(ins.article.recall)}</b></div>
              <div className="stats__trow"><span>avg memory</span><b>{days(ins.article.stability)}</b></div>
              <div className="stats__trow"><span>reviews</span><b>{ins.article.reviews}</b></div>
            </div>
            <div className="stats__track" data-tone="meaning">
              <span className="stats__tname">Meanings</span>
              <div className="stats__trow"><span>recall</span><b>{pct(ins.meaning.recall)}</b></div>
              <div className="stats__trow"><span>avg memory</span><b>{days(ins.meaning.stability)}</b></div>
              <div className="stats__trow"><span>reviews</span><b>{ins.meaning.reviews}</b></div>
            </div>
          </div>

          <p className="stats__foot">
            "Avg memory" is how long FSRS expects each thing to stick right now —
            it grows every time you recall and resets when you miss. Once you've
            logged a few hundred reviews, the model can refit to your personal
            curve (see README).
          </p>
        </>
      )}
    </div>
  );
}
