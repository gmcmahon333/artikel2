import test from "node:test";
import assert from "node:assert/strict";
import {
  CASE_EXAMPLES,
  CASE_EXAMPLE_CANDIDATES,
  CASE_EXAMPLE_VERSION,
  PRACTICED_CASES,
  boilerplateCaseExamples,
  caseRewriteBacklog,
  examplesForNoun,
  validateCaseExamples,
  verifiedExamplesForNoun,
} from "./caseExamples.js";

test("case example library covers every noun with two examples per practiced case", () => {
  const nounIds = new Set(CASE_EXAMPLE_CANDIDATES.map((example) => example.nounId));
  assert.equal(nounIds.size, 1168);
  assert.equal(CASE_EXAMPLE_CANDIDATES.length, 7009);

  for (const nounId of nounIds) {
    assert.deepEqual(
      [...new Set(CASE_EXAMPLE_CANDIDATES.filter((example) => example.nounId === nounId).map((example) => example.grammaticalCase))],
      PRACTICED_CASES
    );
  }

  const zeitId = CASE_EXAMPLE_CANDIDATES.find((example) => example.noun === "Zeit").nounId;
  assert.equal(
    CASE_EXAMPLE_CANDIDATES.filter((example) => example.nounId === zeitId && example.grammaticalCase === "nominative").length,
    3
  );
});

test("new Artikel nouns stay out of Fälle until content review", async () => {
  const { loadSeed, seedCardId } = await import("./deck.js");
  const pending = loadSeed().filter((word) => word.casePracticeStatus === "pending");
  const caseIds = new Set(CASE_EXAMPLES.map((example) => example.nounId));
  assert.equal(pending.length, 332);
  assert.ok(pending.every((word) => !caseIds.has(seedCardId(word))));
});

test("case examples match deck morphology and the public content schema", () => {
  assert.deepEqual(validateCaseExamples(), []);
  assert.ok(CASE_EXAMPLE_CANDIDATES.every((example) => example.version === CASE_EXAMPLE_VERSION));
  assert.ok(CASE_EXAMPLE_CANDIDATES.every((example) => example.status === "candidate"));
  assert.ok(CASE_EXAMPLE_CANDIDATES.every((example) =>
    PRACTICED_CASES.every((caseName) => typeof example.forms[caseName] === "string")
  ));
  assert.ok(CASE_EXAMPLE_CANDIDATES.every((example) => example.reviewer === null));
  assert.equal(new Set(CASE_EXAMPLE_CANDIDATES.map((example) => example.id)).size, CASE_EXAMPLE_CANDIDATES.length);
  assert.deepEqual(verifiedExamplesForNoun(CASE_EXAMPLES[0].nounId), []);
});

test("noun-specific candidates replace semantically invalid generated frames", () => {
  const expected = [
    ["Dank", "dative", "generated-01", "Mit dem Dank endet ihre Rede.", "Her speech ends with an expression of gratitude."],
    ["Abend", "accusative", "generated-02", "Wir genießen den Abend.", "We enjoy the evening."],
    ["Straße", "dative", "generated-02", "Wir folgen der Straße bis zum Bahnhof.", "We follow the street to the train station."],
    ["Glück", "accusative", "generated-01", "Das Gedicht beschreibt das Glück.", "The poem describes happiness."],
    ["Uhr", "nominative", "supplement-01", "An der Wand hängt die Uhr.", "The clock hangs on the wall."],
    ["Recht", "nominative", "supplement-01", "Vor Gericht gilt das Recht für alle.", "In court, the law applies to everyone."],
    ["Kopf", "nominative", "generated-02", "Seit gestern tut ihm der Kopf weh.", "His head has hurt since yesterday."],
    ["Frage", "nominative", "supplement-01", "Im Gespräch taucht die Frage erneut auf.", "The question comes up again in the conversation."],
    ["Seite", "nominative", "supplement-01", "Im Buch fehlt die Seite.", "The page is missing from the book."],
    ["Morgen", "dative", "generated-02", "Seit dem Morgen regnet es.", "It has been raining since the morning."],
    ["Dank", "dative", "generated-02", "Mit dem Dank beendet sie ihre Rede.", "She ends her speech with an expression of gratitude."],
    ["Ende", "accusative", "supplement-01", "Niemand erwartet das Ende.", "No one expects the end."],
    ["Beispiel", "accusative", "generated-02", "Der Lehrer erklärt das Beispiel.", "The teacher explains the example."],
    ["Nacht", "nominative", "generated-01", "In wenigen Minuten beginnt die Nacht.", "Night begins in a few minutes."],
    ["Hilfe", "nominative", "generated-01", "Zum Glück kommt die Hilfe rechtzeitig.", "Fortunately, help arrives on time."],
    ["Hilfe", "nominative", "generated-02", "Nach dem Unfall trifft die Hilfe schnell ein.", "Help arrives quickly after the accident."],
    ["Wort", "nominative", "generated-02", "In diesem Satz fehlt das Wort.", "The word is missing from this sentence."],
    ["Laut", "accusative", "generated-01", "Das Mikrofon verstärkt den Laut.", "The microphone amplifies the sound."],
    ["Laut", "accusative", "generated-02", "Das Kind wiederholt den Laut.", "The child repeats the sound."],
    ["Richtung", "accusative", "generated-01", "Der Kompass zeigt die Richtung.", "The compass shows the direction."],
    ["Richtung", "accusative", "generated-02", "Wir ändern die Richtung.", "We change direction."],
    ["Spaß", "accusative", "generated-02", "Niemand versteht den Spaß.", "No one understands the joke."],
    ["Stelle", "dative", "generated-02", "An der Stelle beginnt der Weg.", "The path begins at that spot."],
    ["Mitte", "nominative", "generated-01", "Auf dem Plan ist die Mitte des Tisches markiert.", "The center of the table is marked on the plan."],
    ["Mitte", "nominative", "generated-02", "Genau zwischen den beiden Punkten liegt die Mitte.", "The center lies exactly between the two points."],
    ["Mitte", "dative", "generated-01", "In der Mitte des Raumes steht ein Tisch.", "A table stands in the middle of the room."],
    ["Mitte", "dative", "generated-02", "Von der Mitte aus sieht man beide Eingänge.", "From the middle, you can see both entrances."],
    ["Mitte", "accusative", "generated-01", "Der Pfeil trifft die Mitte der Zielscheibe.", "The arrow hits the center of the target."],
    ["Mitte", "accusative", "generated-02", "Bitte markieren Sie die Mitte des Kreises.", "Please mark the center of the circle."],
    ["Titel", "nominative", "generated-01", "Oben auf der ersten Seite steht der Titel.", "The title appears at the top of the first page."],
    ["Titel", "nominative", "generated-02", "Schon vor dem Lesen verrät der Titel viel über den Inhalt.", "The title already reveals a lot about the content."],
    ["Titel", "dative", "generated-01", "Unter dem Titel steht der Name der Autorin.", "The author's name appears beneath the title."],
    ["Titel", "dative", "generated-02", "Nach dem Titel beginnt das erste Kapitel.", "The first chapter begins after the title."],
    ["Titel", "accusative", "generated-01", "Die Autorin ändert den Titel ihres Romans.", "The author changes the title of her novel."],
    ["Titel", "accusative", "generated-02", "Bitte schreiben Sie den Titel auf das Formular.", "Please write the title on the form."],
  ];

  for (const [noun, grammaticalCase, idSuffix, sentence, translation] of expected) {
    const candidate = CASE_EXAMPLE_CANDIDATES.find((example) =>
      example.noun === noun && example.grammaticalCase === grammaticalCase && example.id.endsWith(idSuffix)
    );
    assert.deepEqual([candidate.sentence, candidate.translation], [sentence, translation]);
  }
});

test("semantic audit distinguishes shared boilerplate from noun-specific candidates", () => {
  const boilerplate = boilerplateCaseExamples();
  assert.ok(boilerplate.length > 0);
  assert.ok(boilerplate.every((example) => !["Mitte", "Titel"].includes(example.noun)));
  assert.ok(boilerplate.every((example) => example.reviewNotes.includes("noun-specific rewrite required")));
});

test("learner queue excludes shared boilerplate and rewrite backlog follows CEFR then frequency", () => {
  const boilerplateIds = new Set(boilerplateCaseExamples().map((example) => example.id));
  assert.ok(CASE_EXAMPLES.length < CASE_EXAMPLE_CANDIDATES.length);
  assert.ok(CASE_EXAMPLES.every((example) => !boilerplateIds.has(example.id)));

  const backlog = caseRewriteBacklog();
  assert.ok(backlog.length > 0);
  for (let index = 1; index < backlog.length; index += 1) {
    const previous = backlog[index - 1];
    const current = backlog[index];
    const previousCefr = ["A1", "A2", "B1", "B2", "C1", "C2"].indexOf(previous.cefr);
    const currentCefr = ["A1", "A2", "B1", "B2", "C1", "C2"].indexOf(current.cefr);
    assert.ok(previousCefr < currentCefr || (previousCefr === currentCefr && previous.frequencyRank <= current.frequencyRank));
  }
});

test("validator rejects a target that disagrees with deck morphology", () => {
  const invalid = CASE_EXAMPLE_CANDIDATES.map((example, index) =>
    index === 0 ? { ...example, target: "dem falschen Wort" } : example
  );
  assert.match(validateCaseExamples(invalid)[0], /target does not match deck morphology/);
});

test("validator rejects declension choices that disagree with deck morphology", () => {
  const invalid = CASE_EXAMPLE_CANDIDATES.map((example, index) =>
    index === 0
      ? { ...example, forms: { ...example.forms, dative: "der falschen Form" } }
      : example
  );
  assert.ok(validateCaseExamples(invalid).some((error) => /declension options do not match deck morphology/.test(error)));
});

test("validator rejects missing case coverage without relying on pilot totals", () => {
  const nounId = CASE_EXAMPLE_CANDIDATES[0].nounId;
  const incomplete = CASE_EXAMPLE_CANDIDATES.filter(
    (example) => !(example.nounId === nounId && example.grammaticalCase === "dative")
  );
  assert.ok(validateCaseExamples(incomplete).some((error) => /needs 2 dative example/.test(error)));
});

test("optional editorial validation can require reviewed examples", () => {
  const errors = validateCaseExamples(CASE_EXAMPLE_CANDIDATES, undefined, { minVerifiedPerCase: 1 });
  assert.ok(errors.some((error) => /needs 1 verified nominative example/.test(error)));

  const reviewed = CASE_EXAMPLE_CANDIDATES.map((example) => ({
    ...example,
    status: "verified",
    reviewer: "reviewer-id",
    reviewedAt: "2026-07-15T00:00:00.000Z",
  }));
  assert.deepEqual(validateCaseExamples(reviewed, undefined, { minVerifiedPerCase: 1 }), []);
});

test("verified status requires an auditable reviewer and timestamp", () => {
  const invalid = CASE_EXAMPLE_CANDIDATES.map((example, index) =>
    index === 0 ? { ...example, status: "verified" } : example
  );
  assert.ok(validateCaseExamples(invalid).some((error) => /needs reviewer and reviewedAt/.test(error)));
});
