// storage.js — unified async storage. One interface, two backends.
//
//   hasSupabase === true  -> Supabase (per-user, synced across devices)
//   hasSupabase === false -> localStorage (single browser, zero config)
//
// Every function is async so the rest of the app never has to care which is live.

import { loadSeed, seedAdditionsFor, seedCardId } from "./deck.js";
import { freshItem } from "./engine.js";
import { supabase, hasSupabase } from "./supabaseClient.js";

const LOCAL_KEY = "artikel.cards.v1";
const LOCAL_REVIEWS = "artikel.reviews.v1";
const LOCAL_PARAMS = "artikel.params.v1";

// Shared seed builder used by both backends.
export function buildSeedCards(now = Date.now(), words = loadSeed()) {
  return words.map((w) => ({
    id: seedCardId(w),
    noun: w.noun,
    gender: w.gender,
    en: w.en,
    article: freshItem(now),
    meaning: freshItem(now),
  }));
}

function buildSeedAdditions(cards, now = Date.now()) {
  return buildSeedCards(now, seedAdditionsFor(cards));
}

// ---- Supabase row <-> app card ----
function rowToCard(row) {
  return {
    id: row.id,
    noun: row.noun,
    gender: row.gender,
    en: row.en,
    article: row.article_state,
    meaning: row.meaning_state,
  };
}
function cardToRow(userId, card) {
  return {
    id: card.id,
    user_id: userId,
    noun: card.noun,
    gender: card.gender,
    en: card.en,
    article_state: card.article,
    meaning_state: card.meaning,
  };
}

// ---- public API ----

// Returns the user's cards, seeding the deck on first use.
export async function loadCards(userId) {
  if (hasSupabase) {
    const { data, error } = await supabase.from("cards").select("*").eq("user_id", userId);
    if (error) throw error;
    if (!data || data.length === 0) {
      const seeded = buildSeedCards();
      const rows = seeded.map((c) => cardToRow(userId, c));
      const { error: insErr } = await supabase.from("cards").insert(rows);
      if (insErr) throw insErr;
      return seeded;
    }
    const existing = data.map(rowToCard);
    const additions = buildSeedAdditions(existing);
    if (additions.length) {
      const rows = additions.map((c) => cardToRow(userId, c));
      const { error: insErr } = await supabase.from("cards").insert(rows);
      if (insErr) throw insErr;
    }
    return [...existing, ...additions];
  }

  // local fallback
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) {
      const seeded = buildSeedCards();
      localStorage.setItem(LOCAL_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const existing = JSON.parse(raw);
    const additions = buildSeedAdditions(existing);
    if (!additions.length) return existing;
    const merged = [...existing, ...additions];
    localStorage.setItem(LOCAL_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return buildSeedCards();
  }
}

// Persist one card (called after each grade). For local we rewrite the whole set.
export async function saveCard(userId, card, allCards) {
  if (hasSupabase) {
    const { error } = await supabase
      .from("cards")
      .upsert(cardToRow(userId, card), { onConflict: "user_id,id" });
    if (error) throw error;
    return;
  }
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(allCards));
  } catch (e) {
    console.error("Could not save review state:", e);
  }
}

export async function deleteCard(userId, cardId, allCards) {
  if (hasSupabase) {
    const { error } = await supabase
      .from("cards")
      .delete()
      .eq("user_id", userId)
      .eq("id", cardId);
    if (error) throw error;
    return;
  }
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(allCards));
  } catch (e) {
    console.error("Could not save review state:", e);
  }
}

export async function resetAll(userId) {
  if (hasSupabase) {
    const { error } = await supabase.from("cards").delete().eq("user_id", userId);
    if (error) throw error;
    await supabase.from("reviews").delete().eq("user_id", userId);
    return loadCards(userId); // re-seeds
  }
  localStorage.removeItem(LOCAL_KEY);
  localStorage.removeItem(LOCAL_REVIEWS);
  return loadCards(userId);
}

// ---- behavioral review log (the data the model learns from) ----

export async function saveReviews(userId, rows) {
  const stamped = rows.map((r) => ({ ...r, user_id: userId }));
  if (hasSupabase) {
    const { error } = await supabase.from("reviews").insert(stamped);
    if (error) throw error;
    return;
  }
  try {
    const raw = localStorage.getItem(LOCAL_REVIEWS);
    const all = raw ? JSON.parse(raw) : [];
    all.push(...stamped);
    localStorage.setItem(LOCAL_REVIEWS, JSON.stringify(all));
  } catch (e) {
    console.error("Could not log reviews:", e);
  }
}

export async function loadReviews(userId) {
  if (hasSupabase) {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", userId)
      .order("reviewed_at", { ascending: true });
    if (error) throw error;
    return data || [];
  }
  try {
    const raw = localStorage.getItem(LOCAL_REVIEWS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ---- per-user learned weights (populated later by the optimizer) ----

export async function loadParams(userId) {
  if (hasSupabase) {
    const { data, error } = await supabase
      .from("user_params")
      .select("w")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) return null;
    return data?.w || null;
  }
  try {
    const raw = localStorage.getItem(LOCAL_PARAMS);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
