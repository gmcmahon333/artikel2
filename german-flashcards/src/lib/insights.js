// insights.js — turn the raw review log into "what it learned about you".
// Rating 1 (Again) === a miss; anything else counts as recalled.

import { RATING } from "./engine.js";

const MISS = RATING.MISSED; // 1

export function computeInsights(cards, reviews) {
  const rowsFor = (t) => reviews.filter((r) => r.track === t);
  const recall = (rows) =>
    rows.length ? rows.filter((r) => r.rating !== MISS).length / rows.length : null;

  const seen = (key) => cards.filter((c) => c[key].state !== 0); // not New
  const avgStab = (key) => {
    const s = seen(key);
    return s.length ? s.reduce((a, c) => a + c[key].stability, 0) / s.length : null;
  };

  const aRows = rowsFor("article");
  const mRows = rowsFor("meaning");

  return {
    total: reviews.length,
    overallRecall: recall(reviews),
    article: { reviews: aRows.length, recall: recall(aRows), stability: avgStab("article") },
    meaning: { reviews: mRows.length, recall: recall(mRows), stability: avgStab("meaning") },
  };
}

// A plain-language comparison of the two tracks, or null if not enough data yet.
export function trackComparison(ins) {
  const a = ins.article.stability;
  const m = ins.meaning.stability;
  if (!a || !m) return null;
  const ratio = m / a; // how much longer meanings last vs articles
  if (ratio >= 1.15) return `Your genders fade about ${ratio.toFixed(1)}× faster than your meanings.`;
  if (ratio <= 0.87) return `Your meanings fade about ${(1 / ratio).toFixed(1)}× faster than your genders.`;
  return "Your genders and meanings are sticking about equally well.";
}
