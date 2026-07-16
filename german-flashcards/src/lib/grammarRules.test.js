import test from "node:test";
import assert from "node:assert/strict";
import { GOVERNED_EXAMPLES } from "./governedExamples.js";
import { GRAMMAR_RULES, validateGrammarRules } from "./grammarRules.js";

test("grammar rules are canonical, sourced, and reviewable", () => {
  assert.deepEqual(validateGrammarRules(), []);
  assert.equal(GRAMMAR_RULES.length, 87);
  assert.ok(GRAMMAR_RULES.every((rule) => rule.status === "candidate"));
});

test("every grammar rule has a candidate example with a stable rule link", () => {
  const counts = new Map();
  for (const example of GOVERNED_EXAMPLES) counts.set(example.ruleId, (counts.get(example.ruleId) || 0) + 1);
  assert.equal(GOVERNED_EXAMPLES.length, 261);
  assert.ok(GRAMMAR_RULES.every((rule) => counts.get(rule.id) === 3));
  assert.ok(GOVERNED_EXAMPLES.every((example) => example.status === "candidate" && example.reviewer === null));
});
