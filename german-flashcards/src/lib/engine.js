// engine.js — FSRS-6 scheduling. Replaces the old fixed-rule SM-2.
//
// FSRS learns from behavior in two layers:
//   1. Per item: every review updates that item's *stability* and *difficulty*
//      from your actual grade and the actual time elapsed. This happens
//      immediately, with the default model.
//   2. Per user: once enough reviews are logged, the 21 model weights can be
//      refit to YOUR forgetting curve (see optimizer notes in README) and passed
//      in via setUserParams(). Until then we use FSRS-6 defaults as a prior.
//
// Dual-track is preserved: each card holds two independent FSRS items,
// `article` and `meaning`, each scheduled and logged separately.

import { fsrs, generatorParameters, createEmptyCard, Rating, State } from "ts-fsrs";

export const DAY = 864e5;

// Three buttons -> FSRS ratings. (Hard is available but we keep it to three.)
export const RATING = { MISSED: Rating.Again, GOT: Rating.Good, EASY: Rating.Easy };

let _scheduler = makeScheduler();

export function makeScheduler(w) {
  return fsrs(generatorParameters(w ? { w, enable_fuzz: true } : { enable_fuzz: true }));
}

// Call once after loading the user's learned weights (or with nothing to reset).
export function setUserParams(w) {
  _scheduler = makeScheduler(w && w.length ? w : undefined);
}

export function freshItem(now = Date.now()) {
  // createEmptyCard returns Date objects; clone to a JSON-safe plain object.
  return JSON.parse(JSON.stringify(createEmptyCard(new Date(now))));
}

const dueMs = (item) => new Date(item.due).getTime();
const isNew = (item) => item.state === State.New; // 0
const isReview = (item) => item.state === State.Review; // 2

// Review one track. Returns the new item state plus the FSRS log entry, which
// is what we append to the behavioral review log.
export function review(item, rating, now = Date.now()) {
  const res = _scheduler.next(item, new Date(now), rating);
  return { item: JSON.parse(JSON.stringify(res.card)), log: res.log };
}

export function cardDue(card, now = Date.now()) {
  return dueMs(card.article) <= now || dueMs(card.meaning) <= now;
}
export function cardNextDue(card) {
  return Math.min(dueMs(card.article), dueMs(card.meaning));
}

export function buildQueue(cards, { newPerDay = 15, now = Date.now() } = {}) {
  const seen = cards.filter((c) => !isNew(c.article) || !isNew(c.meaning));
  const due = seen.filter((c) => cardDue(c, now)).sort((a, b) => cardNextDue(a) - cardNextDue(b));
  const fresh = cards.filter((c) => isNew(c.article) && isNew(c.meaning)).slice(0, newPerDay);
  return [...due, ...fresh];
}

export function buildAheadQueue(cards, { limit = 20, now = Date.now() } = {}) {
  return cards
    .filter((c) => (!isNew(c.article) || !isNew(c.meaning)) && !cardDue(c, now))
    .sort((a, b) => cardNextDue(a) - cardNextDue(b))
    .slice(0, limit);
}

export function itemDue(entry, now = Date.now()) {
  return dueMs(entry.schedule) <= now;
}

export function buildItemQueue(entries, { newPerDay = 15, now = Date.now() } = {}) {
  const seen = entries.filter((entry) => !isNew(entry.schedule));
  const due = seen
    .filter((entry) => itemDue(entry, now))
    .sort((a, b) => dueMs(a.schedule) - dueMs(b.schedule));
  const fresh = entries.filter((entry) => isNew(entry.schedule)).slice(0, newPerDay);
  return [...due, ...fresh];
}

export function itemCounts(entries) {
  return {
    due: entries.filter((entry) => itemDue(entry) && !isNew(entry.schedule)).length,
    fresh: entries.filter((entry) => isNew(entry.schedule)).length,
    learned: entries.filter((entry) => isReview(entry.schedule)).length,
    total: entries.length,
  };
}

// Deck-state counts for the header.
export function counts(cards) {
  return {
    due: cards.filter((c) => cardDue(c) && (!isNew(c.article) || !isNew(c.meaning))).length,
    fresh: cards.filter((c) => isNew(c.article) && isNew(c.meaning)).length,
    learned: cards.filter((c) => isReview(c.article) && isReview(c.meaning)).length,
    total: cards.length,
  };
}

export function humanInterval(days) {
  if (days < 1) return "heute";
  if (days === 1) return "einem Tag";
  if (days < 30) return `${days} Tagen`;
  if (days < 60) return "einem Monat";
  if (days < 365) return `${Math.round(days / 30)} Monaten`;
  return `${(days / 365).toFixed(1)} Jahren`;
}
