import test from "node:test";
import assert from "node:assert/strict";
import { GOVERNED_EXAMPLES } from "./governedExamples.js";
import { orderArticleCards, orderCaseCards, orderRuleCards } from "./learningOrder.js";

test("article cards follow CEFR and corpus rank regardless of database order", () => {
  const words = [
    { id: "a2", cefr: "A2", frequencyRank: 1 },
    { id: "a1-later", cefr: "A1", frequencyRank: 9 },
    { id: "a1-earlier", cefr: "A1", frequencyRank: 2 },
  ];
  const ordered = orderArticleCards(words.map(({ id }) => ({ id })).reverse(), words);
  assert.deepEqual(ordered.map((card) => card.id), ["a1-earlier", "a1-later", "a2"]);
});

test("rule cards follow CEFR and frequency priority instead of case groups", () => {
  const shuffled = [...GOVERNED_EXAMPLES].reverse().map((example) => ({ id: example.id }));
  const ordered = orderRuleCards(shuffled, GOVERNED_EXAMPLES)
    .map((card) => GOVERNED_EXAMPLES.find((example) => example.id === card.id));
  assert.deepEqual(ordered.slice(0, 3).map((example) => example.governor), ["sein", "mit", "für"]);
  assert.ok(ordered.slice(-3).every((example) => example.cefr === "C1"));
});

test("case cards interleave grammatical cases within a CEFR layer", () => {
  const examples = [
    { id: "a-n", cefr: "A1", frequencyRank: 1, grammaticalCase: "nominative" },
    { id: "a-d", cefr: "A1", frequencyRank: 1, grammaticalCase: "dative" },
    { id: "b-a", cefr: "A1", frequencyRank: 2, grammaticalCase: "accusative" },
    { id: "c-n", cefr: "A2", frequencyRank: 1, grammaticalCase: "nominative" },
  ];
  const ordered = orderCaseCards(examples.map(({ id }) => ({ id })), examples);
  assert.equal(ordered.at(-1).id, "c-n");
  assert.equal(new Set(ordered.slice(0, 3).map((card) => examples.find((example) => example.id === card.id).grammaticalCase)).size, 3);
});
