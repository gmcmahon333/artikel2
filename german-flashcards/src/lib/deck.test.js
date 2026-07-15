import test from "node:test";
import assert from "node:assert/strict";
import { loadSeed, seedAdditionsFor, seedCardId } from "./deck.js";

test("seed IDs are stable when the deck is reordered", () => {
  const [first, second] = loadSeed();
  assert.equal(seedCardId(first), seedCardId({ ...first }));
  assert.notEqual(seedCardId(first), seedCardId(second));
});

test("an old deck receives only the version-two nouns", () => {
  const oldCards = loadSeed()
    .filter((word) => word.seedVersion === 1)
    .map((word, index) => ({ id: `seed-${index}`, noun: word.noun, en: word.en }));
  const additions = seedAdditionsFor(oldCards);

  assert.ok(additions.length > 0);
  assert.ok(additions.every((word) => word.seedVersion === 2));
});

test("an installed batch is not restored after one card is deleted", () => {
  const versionTwo = loadSeed().filter((word) => word.seedVersion === 2);
  const cards = versionTwo.slice(1).map((word) => ({
    id: seedCardId(word),
    noun: word.noun,
    en: word.en,
  }));

  assert.deepEqual(seedAdditionsFor(cards), []);
});
