# Case example library

`src/lib/caseExamples.js` is the content layer for nominative, dative, and
accusative practice. It is deliberately separate from FSRS scheduling and the
seed noun morphology.

## Authoring rules

- The seed deck is the source of truth for the target noun phrase.
- Version 1 uses definite, singular noun phrases only.
- Each case contains an array of examples with a stable, descriptive `key`.
- Every example stores `before`, `target`, and `after` separately so the UI can
  hide or emphasize the answer without parsing a sentence.
- Every example names the grammatical trigger that establishes its case.
- Avoid ambiguous case cues and two-way prepositions in introductory content.
- New examples begin as `candidate`. Only a fluent German reviewer may promote
  an example to `verified`, recording `reviewer`, `reviewedAt`, and optional
  `reviewNotes`. Candidate examples may enter the production review queue; the
  status remains visible in the content layer so they can still be audited and
  promoted later.
- Add at least two verified examples per noun and case before broad release, so
  learners cannot succeed by memorizing one sentence.

New content should use the expanded form:

```js
dative: [{
  key: "after-year-abroad",
  before: "Nach ",
  after: " im Ausland kehrt sie nach Berlin zurück.",
  translation: "After the year abroad, she returns to Berlin.",
  trigger: "nach + dative",
  status: "candidate",
  reviewer: null,
  reviewedAt: null,
  reviewNotes: null,
}]
```

Run `npm test` after editing the library. The validator checks stable IDs,
morphology, sentence segmentation, per-noun case coverage, punctuation, schema
scope, and auditable review metadata. Release validation permits candidates.
