import test from "node:test";
import assert from "node:assert/strict";
import {
  CASE_EXAMPLES,
  CASE_EXAMPLE_VERSION,
  PRACTICED_CASES,
  examplesForNoun,
  validateCaseExamples,
  verifiedExamplesForNoun,
} from "./caseExamples.js";

test("case example pilot covers twenty nouns in all three practiced cases", () => {
  const nounIds = new Set(CASE_EXAMPLES.map((example) => example.nounId));
  assert.equal(nounIds.size, 20);
  assert.equal(CASE_EXAMPLES.length, 61);

  for (const nounId of nounIds) {
    assert.deepEqual(
      [...new Set(examplesForNoun(nounId).map((example) => example.grammaticalCase))],
      PRACTICED_CASES
    );
  }

  const zeitId = CASE_EXAMPLES.find((example) => example.noun === "Zeit").nounId;
  assert.equal(
    examplesForNoun(zeitId).filter((example) => example.grammaticalCase === "nominative").length,
    2
  );
});

test("case examples match deck morphology and the public content schema", () => {
  assert.deepEqual(validateCaseExamples(), []);
  assert.ok(CASE_EXAMPLES.every((example) => example.version === CASE_EXAMPLE_VERSION));
  assert.ok(CASE_EXAMPLES.every((example) => example.status === "candidate"));
  assert.ok(CASE_EXAMPLES.every((example) =>
    PRACTICED_CASES.every((caseName) => typeof example.forms[caseName] === "string")
  ));
  assert.ok(CASE_EXAMPLES.every((example) => example.reviewer === null));
  assert.equal(new Set(CASE_EXAMPLES.map((example) => example.id)).size, CASE_EXAMPLES.length);
  assert.deepEqual(verifiedExamplesForNoun(CASE_EXAMPLES[0].nounId), []);
});

test("validator rejects a target that disagrees with deck morphology", () => {
  const invalid = CASE_EXAMPLES.map((example, index) =>
    index === 0 ? { ...example, target: "dem falschen Wort" } : example
  );
  assert.match(validateCaseExamples(invalid)[0], /target does not match deck morphology/);
});

test("validator rejects declension choices that disagree with deck morphology", () => {
  const invalid = CASE_EXAMPLES.map((example, index) =>
    index === 0
      ? { ...example, forms: { ...example.forms, dative: "der falschen Form" } }
      : example
  );
  assert.ok(validateCaseExamples(invalid).some((error) => /declension options do not match deck morphology/.test(error)));
});

test("validator rejects missing case coverage without relying on pilot totals", () => {
  const nounId = CASE_EXAMPLES[0].nounId;
  const incomplete = CASE_EXAMPLES.filter(
    (example) => !(example.nounId === nounId && example.grammaticalCase === "dative")
  );
  assert.ok(validateCaseExamples(incomplete).some((error) => /needs 1 dative example/.test(error)));
});

test("optional editorial validation can require reviewed examples", () => {
  const errors = validateCaseExamples(CASE_EXAMPLES, undefined, { minVerifiedPerCase: 1 });
  assert.ok(errors.some((error) => /needs 1 verified nominative example/.test(error)));

  const reviewed = CASE_EXAMPLES.map((example) => ({
    ...example,
    status: "verified",
    reviewer: "reviewer-id",
    reviewedAt: "2026-07-15T00:00:00.000Z",
  }));
  assert.deepEqual(validateCaseExamples(reviewed, undefined, { minVerifiedPerCase: 1 }), []);
});

test("verified status requires an auditable reviewer and timestamp", () => {
  const invalid = CASE_EXAMPLES.map((example, index) =>
    index === 0 ? { ...example, status: "verified" } : example
  );
  assert.ok(validateCaseExamples(invalid).some((error) => /needs reviewer and reviewedAt/.test(error)));
});
