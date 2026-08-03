import test from "node:test";
import assert from "node:assert/strict";
import { GOVERNED_EXAMPLES } from "./governedExamples.js";

test("governed-rule candidates cover fixed dative, accusative, and nominative patterns", () => {
  assert.ok(GOVERNED_EXAMPLES.every((example) => example.status === "candidate"));
  assert.deepEqual(
    [...new Set(GOVERNED_EXAMPLES.map((example) => example.grammaticalCase))].sort(),
    ["accusative", "dative", "nominative"]
  );
  assert.ok(GOVERNED_EXAMPLES.some((example) => example.ruleType === "verb"));
  assert.ok(GOVERNED_EXAMPLES.some((example) => example.ruleType === "preposition"));
  assert.ok(GOVERNED_EXAMPLES.some((example) => example.ruleType === "copula"));
  assert.ok(GOVERNED_EXAMPLES.every((example) => example.sentence === `${example.before}${example.target}${example.after}`));
  assert.ok(GOVERNED_EXAMPLES.every((example) => example.ruleId));
});

test("finden examples use a direct learner translation", () => {
  const examples = GOVERNED_EXAMPLES.filter((example) => example.governor === "finden");
  assert.equal(examples.length, 3);
  assert.ok(examples.every((example) => example.translation.startsWith("The group finds the ")));
  assert.ok(examples.every((example) => !example.translation.includes("named object")));
});
