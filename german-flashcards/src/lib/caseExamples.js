import { loadSeed, seedCardId } from "./deck.js";

export const CASE_EXAMPLE_VERSION = 1;
export const PRACTICED_CASES = ["nominative", "dative", "accusative"];

// Candidate content stays compact for authoring, then expands into the public
// schema below. Candidates may be published to the learner queue; a fluent
// German reviewer can later promote them to `verified` without changing IDs.
const PILOT = [
  ["Zeit", "time", "abstract", {
    nominative: [
      {
        key: "passes-quickly-today",
        before: "Heute vergeht ",
        after: " schnell.",
        translation: "Time passes quickly today.",
        trigger: "subject",
        status: "candidate",
      },
      {
        key: "passes-quickly-on-holiday",
        before: "Im Urlaub vergeht ",
        after: " schnell.",
        translation: "Time passes quickly on holiday.",
        trigger: "subject",
        status: "candidate",
      },
    ],
    dative: ["Mit ", " wird vieles leichter.", "Many things become easier with time.", "mit + dative"],
    accusative: ["Ich nutze ", " zum Nachdenken.", "I use the time to think.", "direct object"],
  }],
  ["Jahr", "year", "time", {
    nominative: ["Bald beginnt ", ".", "The year begins soon.", "subject"],
    dative: ["Nach ", " im Ausland kehrt sie nach Berlin zurück.", "After the year abroad, she returns to Berlin.", "nach + dative"],
    accusative: ["Wir planen ", " im Voraus.", "We plan the year in advance.", "direct object"],
  }],
  ["Mann", "man", "person", {
    nominative: ["Dort wartet ", ".", "The man is waiting there.", "subject"],
    dative: ["Ich helfe ", ".", "I help the man.", "helfen + dative"],
    accusative: ["Ich sehe ", ".", "I see the man.", "direct object"],
  }],
  ["Bitte", "request / please", "abstract", {
    nominative: ["Nun folgt ", " um Ruhe.", "Now comes the request for quiet.", "subject"],
    dative: ["Mit ", " um Hilfe beginnt der Brief.", "The letter begins with the request for help.", "mit + dative"],
    accusative: ["Sie äußert ", " sehr höflich.", "She expresses the request very politely.", "direct object"],
  }],
  ["Tag", "day", "time", {
    nominative: ["Morgen beginnt ", " früh.", "The day begins early tomorrow.", "subject"],
    dative: ["Nach ", " am Meer sind alle müde.", "Everyone is tired after the day by the sea.", "nach + dative"],
    accusative: ["Wir genießen ", ".", "We enjoy the day.", "direct object"],
  }],
  ["Uhr", "watch / clock", "object", {
    nominative: ["An der Wand hängt ", ".", "The clock hangs on the wall.", "subject"],
    dative: ["Von ", " lese ich die Zeit ab.", "I read the time from the clock.", "von + dative"],
    accusative: ["Ich repariere ", ".", "I repair the clock.", "direct object"],
  }],
  ["Weg", "way / path", "place", {
    nominative: ["Hinter dem Haus beginnt ", ".", "The path begins behind the house.", "subject"],
    dative: ["Wir folgen ", ".", "We follow the path.", "folgen + dative"],
    accusative: ["Ich kenne ", ".", "I know the way.", "direct object"],
  }],
  ["Ende", "end", "abstract", {
    nominative: ["Bald kommt ", ".", "The end is coming soon.", "subject"],
    dative: ["Nach ", " des Films gehen wir nach Hause.", "We go home after the end of the film.", "nach + dative"],
    accusative: ["Wir erwarten ", ".", "We expect the end.", "direct object"],
  }],
  ["Frau", "woman", "person", {
    nominative: ["Dort arbeitet ", ".", "The woman works there.", "subject"],
    dative: ["Ich danke ", ".", "I thank the woman.", "danken + dative"],
    accusative: ["Ich begrüße ", ".", "I greet the woman.", "direct object"],
  }],
  ["Welt", "world", "place", {
    nominative: ["Für Kinder wirkt ", " riesig.", "The world seems huge to children.", "subject"],
    dative: ["Wir begegnen ", " mit Neugier.", "We encounter the world with curiosity.", "begegnen + dative"],
    accusative: ["Die Reise verändert ", ".", "The journey changes the world.", "direct object"],
  }],
  ["Stadt", "city", "place", {
    nominative: ["Am Fluss liegt ", ".", "The city lies by the river.", "subject"],
    dative: ["Wir nähern uns ", ".", "We approach the city.", "sich nähern + dative"],
    accusative: ["Wir besuchen ", ".", "We visit the city.", "direct object"],
  }],
  ["Recht", "right / law", "abstract", {
    nominative: ["Für alle gilt ", ".", "The law applies to everyone.", "subject"],
    dative: ["Nach ", " des Landes ist das erlaubt.", "That is permitted under the law of the country.", "nach + dative"],
    accusative: ["Das Gericht schützt ", " auf freie Rede.", "The court protects the right to free speech.", "direct object"],
  }],
  ["Geld", "money", "substance", {
    nominative: ["Auf dem Tisch liegt ", ".", "The money lies on the table.", "subject"],
    dative: ["Mit ", " kaufe ich ein Buch.", "I buy a book with the money.", "mit + dative"],
    accusative: ["Ich spare ", ".", "I save the money.", "direct object"],
  }],
  ["Teil", "part", "object", {
    nominative: ["Hier fehlt ", ".", "The part is missing here.", "subject"],
    dative: ["Mit ", " funktioniert die Maschine.", "The machine works with the part.", "mit + dative"],
    accusative: ["Ich brauche ", ".", "I need the part.", "direct object"],
  }],
  ["Frage", "question", "abstract", {
    nominative: ["Am Ende bleibt ", " offen.", "The question remains open at the end.", "subject"],
    dative: ["Nach ", " wartet die Lehrerin auf eine Antwort.", "After the question, the teacher waits for an answer.", "nach + dative"],
    accusative: ["Ich beantworte ", ".", "I answer the question.", "direct object"],
  }],
  ["Arbeit", "work", "activity", {
    nominative: ["Heute beginnt ", " früh.", "Work begins early today.", "subject"],
    dative: ["Nach ", " gehe ich nach Hause.", "I go home after work.", "nach + dative"],
    accusative: ["Ich erledige ", ".", "I complete the work.", "direct object"],
  }],
  ["Paar", "couple / pair", "person", {
    nominative: ["Vor der Tür wartet ", ".", "The couple is waiting outside the door.", "subject"],
    dative: ["Ich gratuliere ", ".", "I congratulate the couple.", "gratulieren + dative"],
    accusative: ["Wir fotografieren ", ".", "We photograph the couple.", "direct object"],
  }],
  ["Seite", "side / page", "object", {
    nominative: ["Im Buch fehlt ", ".", "The page is missing from the book.", "subject"],
    dative: ["Wir entnehmen ", " wichtige Informationen.", "We take important information from the page.", "entnehmen + dative"],
    accusative: ["Ich lese ", ".", "I read the page.", "direct object"],
  }],
  ["Liebe", "love", "abstract", {
    nominative: ["Manchmal wächst ", " langsam.", "Love sometimes grows slowly.", "subject"],
    dative: ["Aus ", " entsteht Vertrauen.", "Trust grows out of love.", "aus + dative"],
    accusative: ["Das Gedicht beschreibt ", ".", "The poem describes love.", "direct object"],
  }],
  ["Land", "country", "place", {
    nominative: ["Im Norden liegt ", ".", "The country lies in the north.", "subject"],
    dative: ["Wir helfen ", ".", "We help the country.", "helfen + dative"],
    accusative: ["Sie bereisen ", ".", "They travel through the country.", "direct object"],
  }],
];

const seedByKey = new Map(loadSeed().map((word) => [`${word.noun}::${word.en}`, word]));

function authoringRecords(raw) {
  // Version-one pilot shorthand: one positional candidate tuple. New content
  // uses arrays of named records, allowing any number of examples per case.
  if (Array.isArray(raw) && typeof raw[0] === "string") {
    const [before, after, translation, trigger] = raw;
    return [{ key: "01", before, after, translation, trigger, status: "candidate" }];
  }
  return raw;
}

export const CASE_EXAMPLES = PILOT.flatMap(([noun, en, semanticType, cases]) => {
  const word = seedByKey.get(`${noun}::${en}`);
  if (!word) throw new Error(`Case example references unknown noun: ${noun}::${en}`);

  return PRACTICED_CASES.flatMap((grammaticalCase) => {
    const target = word[grammaticalCase];
    const shortCase = { nominative: "nom", dative: "dat", accusative: "acc" }[grammaticalCase];
    return authoringRecords(cases[grammaticalCase]).map((record) => ({
      id: `${seedCardId(word)}-${shortCase}-${record.key}`,
      version: CASE_EXAMPLE_VERSION,
      nounId: seedCardId(word),
      noun,
      grammaticalCase,
      forms: Object.fromEntries(
        PRACTICED_CASES.map((caseName) => [caseName, word[caseName]])
      ),
      number: "singular",
      determiner: "definite",
      semanticType,
      before: record.before,
      target,
      after: record.after,
      sentence: `${record.before}${target}${record.after}`,
      translation: record.translation,
      trigger: record.trigger,
      cefr: word.cefr,
      status: record.status || "candidate",
      reviewer: record.reviewer || null,
      reviewedAt: record.reviewedAt || null,
      reviewNotes: record.reviewNotes || null,
    }));
  });
});

export function examplesForNoun(nounId, { status } = {}) {
  return CASE_EXAMPLES.filter(
    (example) => example.nounId === nounId && (!status || example.status === status)
  );
}

export function verifiedExamplesForNoun(nounId) {
  return examplesForNoun(nounId, { status: "verified" });
}

export function validateCaseExamples(
  examples = CASE_EXAMPLES,
  words = loadSeed(),
  { requiredCases = PRACTICED_CASES, minExamplesPerCase = 1, minVerifiedPerCase = 0 } = {}
) {
  const errors = [];
  const ids = new Set();
  const wordsById = new Map(words.map((word) => [seedCardId(word), word]));
  const coverage = new Map();

  for (const example of examples) {
    const label = example.id || "example without id";
    if (!example.id || ids.has(example.id)) errors.push(`${label}: duplicate or missing id`);
    ids.add(example.id);

    const word = wordsById.get(example.nounId);
    if (!word) {
      errors.push(`${label}: unknown nounId`);
      continue;
    }
    if (!PRACTICED_CASES.includes(example.grammaticalCase)) {
      errors.push(`${label}: unsupported case ${example.grammaticalCase}`);
      continue;
    }
    if (example.target !== word[example.grammaticalCase]) {
      errors.push(`${label}: target does not match deck morphology`);
    }
    if (PRACTICED_CASES.some((caseName) => example.forms?.[caseName] !== word[caseName])) {
      errors.push(`${label}: declension options do not match deck morphology`);
    }
    if (example.sentence !== `${example.before}${example.target}${example.after}`) {
      errors.push(`${label}: sentence does not match its segments`);
    }
    if (!example.before || !example.after || !example.translation || !example.trigger) {
      errors.push(`${label}: incomplete learning metadata`);
    }
    if (!/[.!?]$/.test(example.sentence) || !/[.!?]$/.test(example.translation)) {
      errors.push(`${label}: sentence and translation need terminal punctuation`);
    }
    if (!example.semanticType || !["candidate", "verified", "rejected"].includes(example.status)) {
      errors.push(`${label}: invalid review metadata`);
    }
    if (example.status === "verified" && (!example.reviewer || !example.reviewedAt)) {
      errors.push(`${label}: verified example needs reviewer and reviewedAt`);
    }
    if (example.noun !== word.noun || example.cefr !== word.cefr) {
      errors.push(`${label}: duplicated noun metadata does not match the deck`);
    }
    if (example.version !== CASE_EXAMPLE_VERSION || example.number !== "singular" || example.determiner !== "definite") {
      errors.push(`${label}: unsupported schema version or morphology scope`);
    }

    if (!coverage.has(example.nounId)) coverage.set(example.nounId, new Map());
    const nounCoverage = coverage.get(example.nounId);
    if (!nounCoverage.has(example.grammaticalCase)) nounCoverage.set(example.grammaticalCase, []);
    nounCoverage.get(example.grammaticalCase).push(example);
  }

  for (const [nounId, nounCoverage] of coverage) {
    for (const grammaticalCase of requiredCases) {
      const caseExamples = nounCoverage.get(grammaticalCase) || [];
      if (caseExamples.length < minExamplesPerCase) {
        errors.push(`${nounId}: needs ${minExamplesPerCase} ${grammaticalCase} example(s)`);
      }
      const verified = caseExamples.filter((example) => example.status === "verified").length;
      if (verified < minVerifiedPerCase) {
        errors.push(`${nounId}: needs ${minVerifiedPerCase} verified ${grammaticalCase} example(s)`);
      }
    }
  }

  return errors;
}
