export const GRAMMAR_RULE_VERSION = 1;

function rule(id, lemma, partOfSpeech, grammaticalCase, cefr, frequencyRank, complementType = "object") {
  return {
    id,
    version: GRAMMAR_RULE_VERSION,
    lemma,
    display: lemma,
    partOfSpeech,
    grammaticalCase,
    complementType,
    reflexive: false,
    separable: false,
    cefr,
    frequencyRank,
    status: "candidate",
    reviewer: null,
    reviewedAt: null,
    reviewNotes: null,
    sources: [`goethe-${cefr.toLowerCase()}`, "german-corpus-frequency"],
  };
}

export const GRAMMAR_RULES = [
  rule("copula-sein", "sein", "copula", "nominative", "A1", 1, "predicate-noun"),
  rule("prep-mit", "mit", "preposition", "dative", "A1", 2, "prepositional-object"),
  rule("prep-fuer", "für", "preposition", "accusative", "A1", 3, "prepositional-object"),
  rule("prep-aus", "aus", "preposition", "dative", "A1", 4, "prepositional-object"),
  rule("prep-von", "von", "preposition", "dative", "A1", 5, "prepositional-object"),
  rule("prep-zu", "zu", "preposition", "dative", "A1", 6, "prepositional-object"),
  rule("prep-nach", "nach", "preposition", "dative", "A1", 7, "prepositional-object"),
  rule("prep-bei", "bei", "preposition", "dative", "A1", 8, "prepositional-object"),
  rule("verb-fragen", "fragen", "verb", "accusative", "A1", 9),
  rule("verb-brauchen", "brauchen", "verb", "accusative", "A1", 10),
  rule("verb-helfen", "helfen", "verb", "dative", "A1", 11),
  rule("copula-werden", "werden", "copula", "nominative", "A1", 12, "predicate-noun"),
  rule("copula-bleiben", "bleiben", "copula", "nominative", "A1", 13, "predicate-noun"),
  rule("prep-ohne", "ohne", "preposition", "accusative", "A1", 14, "prepositional-object"),
  rule("prep-gegen", "gegen", "preposition", "accusative", "A1", 15, "prepositional-object"),
  rule("prep-um", "um", "preposition", "accusative", "A1", 16, "prepositional-object"),
  rule("verb-danken", "danken", "verb", "dative", "A1", 17),
  rule("verb-besuchen", "besuchen", "verb", "accusative", "A1", 18),
  rule("verb-sehen", "sehen", "verb", "accusative", "A1", 19),
  rule("verb-hoeren", "hören", "verb", "accusative", "A1", 20),
  rule("verb-lesen", "lesen", "verb", "accusative", "A1", 21),
  rule("verb-kennen", "kennen", "verb", "accusative", "A1", 22),
  rule("verb-treffen", "treffen", "verb", "accusative", "A1", 23),
  rule("verb-lieben", "lieben", "verb", "accusative", "A1", 24),
  rule("verb-kaufen", "kaufen", "verb", "accusative", "A1", 25),
  rule("verb-gefallen", "gefallen", "verb", "dative", "A1", 26),
  rule("verb-gehoeren", "gehören", "verb", "dative", "A1", 27),
  rule("verb-antworten", "antworten", "verb", "dative", "A1", 28),
  rule("verb-fehlen", "fehlen", "verb", "dative", "A1", 29),
  rule("verb-gratulieren", "gratulieren", "verb", "dative", "A1", 30),
  rule("prep-durch", "durch", "preposition", "accusative", "A2", 31, "prepositional-object"),
  rule("prep-seit", "seit", "preposition", "dative", "A2", 32, "prepositional-object"),
  rule("prep-gegenueber", "gegenüber", "preposition", "dative", "A2", 33, "prepositional-object"),
  rule("verb-folgen", "folgen", "verb", "dative", "B1", 34),
  rule("verb-vertrauen", "vertrauen", "verb", "dative", "B1", 35),
  rule("verb-begegnen", "begegnen", "verb", "dative", "B1", 36),
  // Fixed-case prepositions. Less frequent and formal members remain
  // candidates and are deliberately ordered after the Goethe core.
  rule("prep-ausser", "außer", "preposition", "dative", "A2", 37, "prepositional-object"),
  rule("prep-ab", "ab", "preposition", "dative", "B1", 38, "prepositional-object"),
  rule("prep-entgegen", "entgegen", "preposition", "dative", "B1", 39, "prepositional-object"),
  rule("prep-gemaess", "gemäß", "preposition", "dative", "B1", 40, "prepositional-object"),
  rule("prep-samt", "samt", "preposition", "dative", "B2", 41, "prepositional-object"),
  rule("prep-mitsamt", "mitsamt", "preposition", "dative", "B2", 42, "prepositional-object"),
  rule("prep-zufolge", "zufolge", "preposition", "dative", "B2", 43, "prepositional-object"),
  rule("prep-zuliebe", "zuliebe", "preposition", "dative", "B2", 44, "prepositional-object"),
  rule("prep-entsprechend", "entsprechend", "preposition", "dative", "B2", 45, "prepositional-object"),
  rule("prep-binnen", "binnen", "preposition", "dative", "C1", 46, "prepositional-object"),
  rule("prep-entlang", "entlang", "preposition", "accusative", "A2", 48, "prepositional-object"),
  rule("prep-wider", "wider", "preposition", "accusative", "C1", 49, "prepositional-object"),
  // Bounded A1–B1/B2 teaching inventory: verbs with a stable governed object
  // in the represented sense. Open-class transitive verbs are not labelled
  // exhaustive; ambiguous senses belong in separate future rule records.
  rule("verb-anrufen", "anrufen", "verb", "accusative", "A1", 50),
  rule("verb-essen", "essen", "verb", "accusative", "A1", 51),
  rule("verb-finden", "finden", "verb", "accusative", "A1", 52),
  rule("verb-haben", "haben", "verb", "accusative", "A1", 53),
  rule("verb-moegen", "mögen", "verb", "accusative", "A1", 54),
  rule("verb-nehmen", "nehmen", "verb", "accusative", "A1", 55),
  rule("verb-suchen", "suchen", "verb", "accusative", "A1", 56),
  rule("verb-verstehen", "verstehen", "verb", "accusative", "A1", 57),
  rule("verb-bekommen", "bekommen", "verb", "accusative", "A2", 58),
  rule("verb-bestellen", "bestellen", "verb", "accusative", "A2", 59),
  rule("verb-bezahlen", "bezahlen", "verb", "accusative", "A2", 60),
  rule("verb-fotografieren", "fotografieren", "verb", "accusative", "A2", 61),
  rule("verb-oeffnen", "öffnen", "verb", "accusative", "A2", 62),
  rule("verb-schliessen", "schließen", "verb", "accusative", "A2", 63),
  rule("verb-vergessen", "vergessen", "verb", "accusative", "A2", 64),
  rule("verb-verlieren", "verlieren", "verb", "accusative", "A2", 65),
  rule("verb-waehlen", "wählen", "verb", "accusative", "A2", 66),
  rule("verb-akzeptieren", "akzeptieren", "verb", "accusative", "B1", 67),
  rule("verb-beantworten", "beantworten", "verb", "accusative", "B1", 68),
  rule("verb-aehneln", "ähneln", "verb", "dative", "B1", 69),
  rule("verb-drohen", "drohen", "verb", "dative", "B1", 70),
  rule("verb-einfallen", "einfallen", "verb", "dative", "B1", 71),
  rule("verb-entsprechen", "entsprechen", "verb", "dative", "B1", 72),
  rule("verb-gelingen", "gelingen", "verb", "dative", "B1", 73),
  rule("verb-genuegen", "genügen", "verb", "dative", "B1", 74),
  rule("verb-missfallen", "missfallen", "verb", "dative", "B1", 75),
  rule("verb-nuetzen", "nützen", "verb", "dative", "B1", 76),
  rule("verb-passen", "passen", "verb", "dative", "A2", 77),
  rule("verb-raten", "raten", "verb", "dative", "B1", 78),
  rule("verb-schaden", "schaden", "verb", "dative", "B1", 79),
  rule("verb-schmecken", "schmecken", "verb", "dative", "A2", 80),
  rule("verb-widersprechen", "widersprechen", "verb", "dative", "B1", 81),
  rule("verb-zustimmen", "zustimmen", "verb", "dative", "B1", 82),
  rule("verb-zuhoeren", "zuhören", "verb", "dative", "A2", 83),
  rule("verb-verzeihen", "verzeihen", "verb", "dative", "B1", 84),
  rule("prep-nebst", "nebst", "preposition", "dative", "C1", 85, "prepositional-object"),
  rule("prep-nahe", "nahe", "preposition", "dative", "B2", 86, "prepositional-object"),
  rule("prep-fern", "fern", "preposition", "dative", "C1", 87, "prepositional-object"),
  rule("prep-zuwider", "zuwider", "preposition", "dative", "C1", 88, "prepositional-object"),
];

export const GRAMMAR_RULE_BY_LEMMA = new Map(GRAMMAR_RULES.map((item) => [item.lemma, item]));

export function validateGrammarRules(rules = GRAMMAR_RULES) {
  const errors = [];
  const ids = new Set();
  const lemmas = new Set();
  for (const item of rules) {
    if (!item.id || ids.has(item.id)) errors.push(`${item.id || "rule"}: duplicate or missing id`);
    if (!item.lemma || lemmas.has(item.lemma)) errors.push(`${item.id}: duplicate or missing lemma`);
    ids.add(item.id);
    lemmas.add(item.lemma);
    if (!["verb", "preposition", "copula"].includes(item.partOfSpeech)) errors.push(`${item.id}: invalid part of speech`);
    if (!["nominative", "dative", "accusative"].includes(item.grammaticalCase)) errors.push(`${item.id}: invalid case`);
    if (!item.cefr || !Number.isInteger(item.frequencyRank) || !item.sources?.length) errors.push(`${item.id}: incomplete learning metadata`);
    if (!item.status || (item.status === "verified" && (!item.reviewer || !item.reviewedAt))) errors.push(`${item.id}: invalid review metadata`);
  }
  return errors;
}
