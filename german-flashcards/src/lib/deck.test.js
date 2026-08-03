import test from "node:test";
import assert from "node:assert/strict";
import { loadSeed, seedAdditionsFor, seedCardId } from "./deck.js";

test("version three contains the complete validated master index", () => {
  const words = loadSeed();
  assert.equal(words.length, 1168);
  assert.equal(words.filter((word) => word.seedVersion === 2).length, 168);
  assert.equal(words.filter((word) => word.seedVersion === 3).length, 1000);
  assert.ok(words.every((word, index) => word.frequencyRank === index + 1));
  assert.ok(words.every((word) => word.cefr && word.sourceVerification));
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
  };

  for (const [english, [noun, gender, nominative]] of Object.entries(expected)) {
    const word = words.get(english);
    assert.deepEqual([word.noun, word.gender, word.nominative], [noun, gender, nominative]);
    assert.equal(seedCardId(word), `seed-v${word.seedVersion}-${encodeURIComponent(word.idKey)}`);
  }
});

test("a version-two deck receives only the version-three nouns", () => {
  const oldCards = loadSeed()
    .filter((word) => word.seedVersion === 2)
    .map((word) => ({ id: seedCardId(word), noun: word.noun, en: word.en }));
  const additions = seedAdditionsFor(oldCards);

  assert.ok(additions.length > 0);
  assert.ok(additions.every((word) => word.seedVersion === 3));
});

test("an installed batch is not restored after one card is deleted", () => {
  const versionThree = loadSeed().filter((word) => word.seedVersion === 3);
  const installedWords = [
    ...loadSeed().filter((word) => word.seedVersion === 2),
    ...versionThree.slice(1),
  ];
  const cards = installedWords.map((word) => ({
    id: seedCardId(word),
    noun: word.noun,
    en: word.en,
  }));

  assert.deepEqual(seedAdditionsFor(cards), []);
});
