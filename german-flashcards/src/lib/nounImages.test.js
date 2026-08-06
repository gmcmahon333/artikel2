import test from "node:test";
import assert from "node:assert/strict";
import { loadSeed } from "./deck.js";
import { nounImageKey, nounImageUrl } from "./nounImages.js";

test("noun image keys are stable, ASCII, and shared only by the same noun", () => {
  const words = loadSeed();
  const keys = words.map((word) => nounImageKey(word.noun));
  assert.equal(new Set(keys).size, new Set(words.map((word) => word.noun)).size);
  assert.ok(keys.every((key) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(key)));
  assert.equal(nounImageKey("Fuß"), "fuss");
  assert.equal(nounImageKey("Mädchen"), "maedchen");
});

test("unfinished images do not produce network URLs", () => {
  assert.equal(nounImageUrl({ noun: "Apfel" }), null);
});
