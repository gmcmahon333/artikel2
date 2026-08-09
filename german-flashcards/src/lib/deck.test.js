import test from "node:test";
import assert from "node:assert/strict";
import { loadSeed, seedAdditionsFor, seedCardId } from "./deck.js";

test("version four expands Artikel to 1,500 nouns", () => {
  const words = loadSeed();
  assert.equal(words.length, 1500);
  assert.equal(words.filter((word) => word.seedVersion === 2).length, 168);
  assert.equal(words.filter((word) => word.seedVersion === 3).length, 1000);
  assert.equal(words.filter((word) => word.seedVersion === 4).length, 332);
  assert.ok(words.every((word, index) => word.frequencyRank === index + 1));
  assert.ok(words.every((word) => word.cefr && word.sourceVerification));
  assert.ok(words.filter((word) => word.seedVersion === 4).every((word) => word.casePracticeStatus === "pending"));
  const earlierNouns = new Set(words.filter((word) => word.seedVersion < 4).map((word) => word.noun));
  const versionFour = words.filter((word) => word.seedVersion === 4);
  assert.equal(new Set(versionFour.map((word) => word.noun)).size, versionFour.length);
  assert.ok(versionFour.every((word) => !earlierNouns.has(word.noun)));
});

test("seed IDs are stable when the deck is reordered", () => {
  const [first, second] = loadSeed();
  assert.equal(seedCardId(first), seedCardId({ ...first }));
  assert.notEqual(seedCardId(first), seedCardId(second));
});

test("lexicon corrections preserve legacy schedules and morphology", () => {
  const words = new Map(loadSeed().filter((word) => word.idKey).map((word) => [word.en, word]));
  const expected = {
    butter: ["Butter", "die", "die Butter"],
    photo: ["Foto", "das", "das Foto"],
    marketing: ["Vermarktung", "die", "die Vermarktung"],
    moped: ["Kleinkraftrad", "das", "das Kleinkraftrad"],
    hardware: ["Eisenwaren", "die", "die Eisenwaren"],
    truck: ["LKW", "der", "der LKW"],
    gratitude: ["Dank", "der", "der Dank"],
    plastic: ["Kunststoff", "der", "der Kunststoff"],
    cookie: ["Keks", "der", "der Keks"],
  };

  for (const [english, [noun, gender, nominative]] of Object.entries(expected)) {
    const word = words.get(english);
    assert.deepEqual([word.noun, word.gender, word.nominative], [noun, gender, nominative]);
    assert.equal(seedCardId(word), `seed-v${word.seedVersion}-${encodeURIComponent(word.idKey)}`);
  }
});

test("a version-two deck receives the complete later seed batches", () => {
  const oldCards = loadSeed()
    .filter((word) => word.seedVersion === 2)
    .map((word) => ({ id: seedCardId(word), noun: word.noun, en: word.en }));
  const additions = seedAdditionsFor(oldCards);

  assert.ok(additions.length > 0);
  assert.deepEqual(new Set(additions.map((word) => word.seedVersion)), new Set([3, 4]));
});

test("an installed batch is not restored after one card is deleted", () => {
  const versionThree = loadSeed().filter((word) => word.seedVersion === 3);
  const installedWords = [
    ...loadSeed().filter((word) => word.seedVersion === 2),
    ...versionThree.slice(1),
    ...loadSeed().filter((word) => word.seedVersion === 4),
  ];
  const cards = installedWords.map((word) => ({
    id: seedCardId(word),
    noun: word.noun,
    en: word.en,
  }));

  assert.deepEqual(seedAdditionsFor(cards), []);
});

test("an installed version-three deck receives exactly version four", () => {
  const cards = loadSeed()
    .filter((word) => word.seedVersion < 4)
    .map((word) => ({ id: seedCardId(word), noun: word.noun, en: word.en }));
  const additions = seedAdditionsFor(cards);
  assert.equal(additions.length, 332);
  assert.ok(additions.every((word) => word.seedVersion === 4));
});

test("the lexicon extends beyond S without suspicious same-letter runs", () => {
  const words = loadSeed();
  const initials = words.map((word) => word.noun.normalize("NFD")[0].toUpperCase());
  assert.ok(["T", "U", "V", "W", "Z"].every((letter) => initials.includes(letter)));
  let longestRun = 1;
  let run = 1;
  for (let index = 1; index < initials.length; index += 1) {
    run = initials[index] === initials[index - 1] ? run + 1 : 1;
    longestRun = Math.max(longestRun, run);
  }
  assert.ok(longestRun < 15);
});
