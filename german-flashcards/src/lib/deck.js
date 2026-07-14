// deck.js — seed deck. Nouns chosen so der/die/das are well mixed and include
// the classic "gotcha" pairs (das Mädchen, der Mond vs die Sonne).
// gender: "der" | "die" | "das". `noun` is the bare word; the article is the
// thing you're being tested on, so it's never shown on the front.

export const SEED = [
  { noun: "Mann", gender: "der", en: "man" },
  { noun: "Frau", gender: "die", en: "woman" },
  { noun: "Kind", gender: "das", en: "child" },
  { noun: "Junge", gender: "der", en: "boy" },
  { noun: "Mädchen", gender: "das", en: "girl" },
  { noun: "Mann", gender: "der", en: "man" },
  { noun: "Tisch", gender: "der", en: "table" },
  { noun: "Stuhl", gender: "der", en: "chair" },
  { noun: "Bett", gender: "das", en: "bed" },
  { noun: "Tür", gender: "die", en: "door" },
  { noun: "Fenster", gender: "das", en: "window" },
  { noun: "Haus", gender: "das", en: "house" },
  { noun: "Hund", gender: "der", en: "dog" },
  { noun: "Katze", gender: "die", en: "cat" },
  { noun: "Pferd", gender: "das", en: "horse" },
  { noun: "Apfel", gender: "der", en: "apple" },
  { noun: "Banane", gender: "die", en: "banana" },
  { noun: "Brot", gender: "das", en: "bread" },
  { noun: "Wasser", gender: "das", en: "water" },
  { noun: "Kaffee", gender: "der", en: "coffee" },
  { noun: "Milch", gender: "die", en: "milk" },
  { noun: "Tee", gender: "der", en: "tea" },
  { noun: "Bier", gender: "das", en: "beer" },
  { noun: "Wein", gender: "der", en: "wine" },
  { noun: "Suppe", gender: "die", en: "soup" },
  { noun: "Tag", gender: "der", en: "day" },
  { noun: "Nacht", gender: "die", en: "night" },
  { noun: "Woche", gender: "die", en: "week" },
  { noun: "Monat", gender: "der", en: "month" },
  { noun: "Jahr", gender: "das", en: "year" },
  { noun: "Zeit", gender: "die", en: "time" },
  { noun: "Sonne", gender: "die", en: "sun" },
  { noun: "Mond", gender: "der", en: "moon" },
  { noun: "Stern", gender: "der", en: "star" },
  { noun: "Himmel", gender: "der", en: "sky" },
  { noun: "Regen", gender: "der", en: "rain" },
  { noun: "Schnee", gender: "der", en: "snow" },
  { noun: "Wind", gender: "der", en: "wind" },
  { noun: "Wolke", gender: "die", en: "cloud" },
  { noun: "Auto", gender: "das", en: "car" },
  { noun: "Zug", gender: "der", en: "train" },
  { noun: "Fahrrad", gender: "das", en: "bicycle" },
  { noun: "Flugzeug", gender: "das", en: "airplane" },
  { noun: "Stadt", gender: "die", en: "city" },
  { noun: "Land", gender: "das", en: "country" },
  { noun: "Straße", gender: "die", en: "street" },
  { noun: "Weg", gender: "der", en: "way / path" },
  { noun: "Freund", gender: "der", en: "friend (m)" },
  { noun: "Familie", gender: "die", en: "family" },
  { noun: "Liebe", gender: "die", en: "love" },
  { noun: "Hand", gender: "die", en: "hand" },
  { noun: "Kopf", gender: "der", en: "head" },
  { noun: "Auge", gender: "das", en: "eye" },
  { noun: "Ohr", gender: "das", en: "ear" },
  { noun: "Fuß", gender: "der", en: "foot" },
  { noun: "Herz", gender: "das", en: "heart" },
  { noun: "Name", gender: "der", en: "name" },
  { noun: "Geld", gender: "das", en: "money" },
  { noun: "Arbeit", gender: "die", en: "work" },
  { noun: "Lehrer", gender: "der", en: "teacher (m)" },
  { noun: "Schule", gender: "die", en: "school" },
  { noun: "Buch", gender: "das", en: "book" },
  { noun: "Wort", gender: "das", en: "word" },
  { noun: "Sprache", gender: "die", en: "language" },
  { noun: "Frage", gender: "die", en: "question" },
  { noun: "Antwort", gender: "die", en: "answer" },
  { noun: "Garten", gender: "der", en: "garden" },
  { noun: "Baum", gender: "der", en: "tree" },
  { noun: "Blume", gender: "die", en: "flower" },
];

// Deduplicate (the seed intentionally repeats "Mann" as a typo-guard demo of
// how the loader collapses dupes by noun+meaning).
export function loadSeed() {
  const seen = new Set();
  const out = [];
  for (const w of SEED) {
    const key = `${w.noun}::${w.en}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(w);
  }
  return out;
}
