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

const CORE_CASE_EXAMPLES = PILOT.flatMap(([noun, en, semanticType, cases]) => {
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
      number: word.number || "singular",
      determiner: "definite",
      semanticType,
      before: record.before,
      target,
      after: record.after,
      sentence: `${record.before}${target}${record.after}`,
      translation: record.translation,
      trigger: record.trigger,
      cefr: word.cefr,
      frequencyRank: word.frequencyRank,
      status: record.status || "candidate",
      reviewer: record.reviewer || null,
      reviewedAt: record.reviewedAt || null,
      reviewNotes: record.reviewNotes || null,
    }));
  });
});

const SUPPLEMENTAL_FRAMES = {
  nominative: {
    before: "Heute steht ", after: " im Mittelpunkt.",
    translation: (gloss) => `Today, the ${gloss} is the focus.`, trigger: "subject",
  },
  dative: {
    before: "Wir beschäftigen uns mit ", after: ".",
    translation: (gloss) => `We are dealing with the ${gloss}.`, trigger: "mit + dative",
  },
  accusative: {
    before: "Wir sprechen über ", after: ".",
    translation: (gloss) => `We are talking about the ${gloss}.`, trigger: "über + accusative",
  },
};

const SUPPLEMENTAL_EXAMPLE_OVERRIDES = {
  "Zeit::nominative": {
    before: "Beim Warten vergeht ", after: " nur langsam.",
    translation: "Time passes slowly while waiting.", trigger: "subject",
  },
  "Zeit::dative": {
    before: "Mit ", after: " wird vieles leichter.",
    translation: "Many things become easier with time.", trigger: "mit + dative",
  },
  "Zeit::accusative": {
    before: "Beim Lesen vergesse ich oft ", after: ".",
    translation: "I often lose track of time while reading.", trigger: "direct object",
  },
  "Jahr::nominative": {
    before: "Für unsere Familie war ", after: " voller Veränderungen.",
    translation: "The year was full of changes for our family.", trigger: "subject",
  },
  "Jahr::dative": {
    before: "Seit ", after: " 2020 arbeitet er von zu Hause.",
    translation: "He has worked from home since 2020.", trigger: "seit + dative",
  },
  "Jahr::accusative": {
    before: "Niemand wird ", after: " 2020 vergessen.",
    translation: "No one will forget the year 2020.", trigger: "direct object",
  },
  "Mann::nominative": {
    before: "Vor dem Bahnhof wartet ", after: " mit einem roten Koffer.",
    translation: "The man is waiting in front of the train station with a red suitcase.", trigger: "subject",
  },
  "Mann::dative": {
    before: "Die Ärztin erklärt ", after: " die Behandlung.",
    translation: "The doctor explains the treatment to the man.", trigger: "indirect object",
  },
  "Mann::accusative": {
    before: "Die Polizei befragt ", after: ".",
    translation: "The police question the man.", trigger: "direct object",
  },
  "Bitte::nominative": {
    before: "Am Ende des Briefes steht ", after: " um eine schnelle Antwort.",
    translation: "The letter ends with a request for a quick reply.", trigger: "subject",
  },
  "Uhr::nominative": {
    before: "An der Wand hängt ", after: ".",
    translation: "The clock hangs on the wall.", trigger: "subject",
  },
  "Recht::nominative": {
    before: "Vor Gericht gilt ", after: " für alle.",
    translation: "In court, the law applies to everyone.", trigger: "subject",
  },
  "Frage::nominative": {
    before: "Im Gespräch taucht ", after: " erneut auf.",
    translation: "The question comes up again in the conversation.", trigger: "subject",
  },
  "Seite::nominative": {
    before: "Im Buch fehlt ", after: ".",
    translation: "The page is missing from the book.", trigger: "subject",
  },
  "Ende::accusative": {
    before: "Niemand erwartet ", after: ".",
    translation: "No one expects the end.", trigger: "direct object",
  },
};

const PACKAGE_2_APPROVED_IDS = new Set([
  "seed-v3-Bitte%3A%3Arequest%20%2F%20please-acc-supplement-01",
  "seed-v2-Tag%3A%3Aday-acc-supplement-01",
  "seed-v3-Uhr%3A%3Awatch%20%2F%20clock-dat-supplement-01",
  "seed-v3-Uhr%3A%3Awatch%20%2F%20clock-acc-supplement-01",
  "seed-v2-Weg%3A%3Away%20%2F%20path-acc-supplement-01",
  "seed-v2-Frau%3A%3Awoman-dat-supplement-01",
  "seed-v2-Frau%3A%3Awoman-acc-supplement-01",
]);

const PACKAGE_3_APPROVED_IDS = new Set([
  "seed-v2-Stadt%3A%3Acity-acc-supplement-01",
  "seed-v3-Recht%3A%3Aright%20%2F%20law-acc-supplement-01",
  "seed-v2-Geld%3A%3Amoney-dat-supplement-01",
  "seed-v2-Geld%3A%3Amoney-acc-supplement-01",
  "seed-v2-Teil%3A%3Apart-dat-supplement-01",
  "seed-v2-Teil%3A%3Apart-acc-supplement-01",
  "seed-v2-Frage%3A%3Aquestion-dat-supplement-01",
  "seed-v2-Frage%3A%3Aquestion-acc-supplement-01",
  "seed-v2-Arbeit%3A%3Awork-dat-supplement-01",
  "seed-v2-Arbeit%3A%3Awork-acc-supplement-01",
  "seed-v3-Paar%3A%3Acouple%20%2F%20pair-dat-supplement-01",
  "seed-v3-Paar%3A%3Acouple%20%2F%20pair-acc-supplement-01",
  "seed-v2-Land%3A%3Acountry-dat-supplement-01",
  "seed-v2-Land%3A%3Acountry-acc-supplement-01",
  "seed-v2-Geschichte%3A%3Astory%20%2F%20history-nom-generated-01",
]);

const PACKAGE_2_REMOVED_IDS = new Set([
  "seed-v3-Bitte%3A%3Arequest%20%2F%20please-dat-supplement-01",
  "seed-v2-Tag%3A%3Aday-dat-supplement-01",
  "seed-v2-Weg%3A%3Away%20%2F%20path-dat-supplement-01",
  "seed-v2-Ende%3A%3Aend-dat-supplement-01",
  "seed-v2-Welt%3A%3Aworld-dat-supplement-01",
  "seed-v2-Welt%3A%3Aworld-acc-supplement-01",
  "seed-v2-Stadt%3A%3Acity-dat-supplement-01",
]);

const PACKAGE_2_REVIEWER = "geoffrey-email-package-2";
const PACKAGE_2_REVIEWED_AT = "2026-08-17T14:57:05.000Z";
const PACKAGE_3_REVIEWER = "geoffrey-email-package-3";
const PACKAGE_3_REVIEWED_AT = "2026-08-19T08:33:02.000Z";

const SUPPLEMENTAL_CASE_EXAMPLES = PILOT.flatMap(([noun, en, semanticType]) => {
  const word = seedByKey.get(`${noun}::${en}`);
  const gloss = en.split(" / ")[0];
  return PRACTICED_CASES.map((grammaticalCase) => {
    const overrideKey = `${noun}::${grammaticalCase}`;
    const isNounSpecific = Object.hasOwn(SUPPLEMENTAL_EXAMPLE_OVERRIDES, overrideKey);
    const frame = SUPPLEMENTAL_EXAMPLE_OVERRIDES[overrideKey]
      || SUPPLEMENTAL_FRAMES[grammaticalCase];
    const target = word[grammaticalCase];
    const id = `${seedCardId(word)}-${{ nominative: "nom", dative: "dat", accusative: "acc" }[grammaticalCase]}-supplement-01`;
    const removedByTemplateRule = frame.before === "Heute steht " && frame.after === " im Mittelpunkt.";
    const isApproved = PACKAGE_2_APPROVED_IDS.has(id) || PACKAGE_3_APPROVED_IDS.has(id);
    const isRemoved = removedByTemplateRule || PACKAGE_2_REMOVED_IDS.has(id);
    const reviewer = PACKAGE_3_APPROVED_IDS.has(id) ? PACKAGE_3_REVIEWER : PACKAGE_2_REVIEWER;
    const reviewedAt = PACKAGE_3_APPROVED_IDS.has(id) ? PACKAGE_3_REVIEWED_AT : PACKAGE_2_REVIEWED_AT;
    return {
      id,
      version: CASE_EXAMPLE_VERSION,
      nounId: seedCardId(word), noun, grammaticalCase,
      forms: Object.fromEntries(PRACTICED_CASES.map((caseName) => [caseName, word[caseName]])),
      number: word.number || "singular", determiner: "definite", semanticType,
      before: frame.before, target, after: frame.after,
      sentence: `${frame.before}${target}${frame.after}`,
      translation: typeof frame.translation === "function" ? frame.translation(gloss) : frame.translation,
      trigger: frame.trigger,
      cefr: word.cefr, frequencyRank: word.frequencyRank,
      status: isRemoved ? "rejected" : isApproved ? "verified" : "candidate",
      reviewer: isRemoved || isApproved ? reviewer : null,
      reviewedAt: isRemoved || isApproved ? reviewedAt : null,
      reviewNotes: isRemoved
        ? "Removed by editorial review; do not publish or resend."
        : isApproved
          ? `Approved by editorial review in Fälle-Prüfung package ${PACKAGE_3_APPROVED_IDS.has(id) ? "3" : "2"}.`
          : isNounSpecific
            ? "Noun-specific candidate; editorial review pending."
            : "Shared boilerplate frame; noun-specific rewrite required before editorial review.",
    };
  });
});

// Two deliberately neutral candidate frames per case make every noun in the
// article deck immediately available for case practice.  The hand-authored
// pilot remains intact, including its stable IDs; generated records are only
// used for nouns outside that pilot.
const GENERATED_FRAMES = {
  nominative: [
    { key: "generated-01", before: "Hier ist ", after: ".", translation: (gloss) => `Here is the ${gloss}.`, trigger: "subject" },
    { key: "generated-02", before: "Dort steht ", after: " im Mittelpunkt.", translation: (gloss) => `There, the ${gloss} is the focus.`, trigger: "subject" },
  ],
  dative: [
    { key: "generated-01", before: "Mit ", after: " gibt es ein Problem.", translation: (gloss) => `There is a problem with the ${gloss}.`, trigger: "mit + dative" },
    { key: "generated-02", before: "Wir beschäftigen uns mit ", after: ".", translation: (gloss) => `We are dealing with the ${gloss}.`, trigger: "mit + dative" },
  ],
  accusative: [
    { key: "generated-01", before: "Wir betrachten ", after: ".", translation: (gloss) => `We are looking at the ${gloss}.`, trigger: "direct object" },
    { key: "generated-02", before: "Wir untersuchen ", after: ".", translation: (gloss) => `We are examining the ${gloss}.`, trigger: "direct object" },
  ],
};

// Hand-authored replacements for generated frames that are grammatically
// valid but semantically unnatural with a particular noun. Keys include the
// generated frame ID so learner scheduling remains unchanged.
const GENERATED_EXAMPLE_OVERRIDES = {
  "Mitte::nominative::generated-01": {
    before: "Auf dem Plan ist ", after: " des Tisches markiert.",
    translation: "The center of the table is marked on the plan.", trigger: "subject",
  },
  "Mitte::nominative::generated-02": {
    before: "Genau zwischen den beiden Punkten liegt ", after: ".",
    translation: "The center lies exactly between the two points.", trigger: "subject",
  },
  "Mitte::dative::generated-01": {
    before: "In ", after: " des Raumes steht ein Tisch.",
    translation: "A table stands in the middle of the room.", trigger: "in + dative (location)",
  },
  "Mitte::dative::generated-02": {
    before: "Von ", after: " aus sieht man beide Eingänge.",
    translation: "From the middle, you can see both entrances.", trigger: "von + dative",
  },
  "Mitte::accusative::generated-01": {
    before: "Der Pfeil trifft ", after: " der Zielscheibe.",
    translation: "The arrow hits the center of the target.", trigger: "direct object",
  },
  "Mitte::accusative::generated-02": {
    before: "Bitte markieren Sie ", after: " des Kreises.",
    translation: "Please mark the center of the circle.", trigger: "direct object",
  },
  "Titel::nominative::generated-01": {
    before: "Oben auf der ersten Seite steht ", after: ".",
    translation: "The title appears at the top of the first page.", trigger: "subject",
  },
  "Titel::nominative::generated-02": {
    before: "Schon vor dem Lesen verrät ", after: " viel über den Inhalt.",
    translation: "The title already reveals a lot about the content.", trigger: "subject",
  },
  "Titel::dative::generated-01": {
    before: "Unter ", after: " steht der Name der Autorin.",
    translation: "The author's name appears beneath the title.", trigger: "unter + dative (location)",
  },
  "Titel::dative::generated-02": {
    before: "Nach ", after: " beginnt das erste Kapitel.",
    translation: "The first chapter begins after the title.", trigger: "nach + dative",
  },
  "Titel::accusative::generated-01": {
    before: "Die Autorin ändert ", after: " ihres Romans.",
    translation: "The author changes the title of her novel.", trigger: "direct object",
  },
  "Titel::accusative::generated-02": {
    before: "Bitte schreiben Sie ", after: " auf das Formular.",
    translation: "Please write the title on the form.", trigger: "direct object",
  },
  "Dank::dative::generated-01": {
    before: "Mit ", after: " endet ihre Rede.",
    translation: "Her speech ends with an expression of gratitude.", trigger: "mit + dative",
  },
  "Abend::accusative::generated-02": {
    before: "Wir genießen ", after: ".",
    translation: "We enjoy the evening.", trigger: "direct object",
  },
  "Straße::dative::generated-02": {
    before: "Wir folgen ", after: " bis zum Bahnhof.",
    translation: "We follow the street to the train station.", trigger: "folgen + dative",
  },
  "Glück::accusative::generated-01": {
    before: "Das Gedicht beschreibt ", after: ".",
    translation: "The poem describes happiness.", trigger: "direct object",
  },
  "Kopf::nominative::generated-02": {
    before: "Seit gestern tut ihm ", after: " weh.",
    translation: "His head has hurt since yesterday.", trigger: "subject",
  },
  "Morgen::dative::generated-02": {
    before: "Seit ", after: " regnet es.",
    translation: "It has been raining since the morning.", trigger: "seit + dative",
  },
  "Dank::dative::generated-02": {
    before: "Mit ", after: " beendet sie ihre Rede.",
    translation: "She ends her speech with an expression of gratitude.", trigger: "mit + dative",
  },
  "Beispiel::accusative::generated-02": {
    before: "Der Lehrer erklärt ", after: ".",
    translation: "The teacher explains the example.", trigger: "direct object",
  },
  "Nacht::nominative::generated-01": {
    before: "In wenigen Minuten beginnt ", after: ".",
    translation: "Night begins in a few minutes.", trigger: "subject",
  },
  "Hilfe::nominative::generated-01": {
    before: "Zum Glück kommt ", after: " rechtzeitig.",
    translation: "Fortunately, help arrives on time.", trigger: "subject",
  },
  "Hilfe::nominative::generated-02": {
    before: "Nach dem Unfall trifft ", after: " schnell ein.",
    translation: "Help arrives quickly after the accident.", trigger: "subject",
  },
  "Wort::nominative::generated-02": {
    before: "In diesem Satz fehlt ", after: ".",
    translation: "The word is missing from this sentence.", trigger: "subject",
  },
  "Laut::accusative::generated-01": {
    before: "Das Mikrofon verstärkt ", after: ".",
    translation: "The microphone amplifies the sound.", trigger: "direct object",
  },
  "Laut::accusative::generated-02": {
    before: "Das Kind wiederholt ", after: ".",
    translation: "The child repeats the sound.", trigger: "direct object",
  },
  "Richtung::accusative::generated-01": {
    before: "Der Kompass zeigt ", after: ".",
    translation: "The compass shows the direction.", trigger: "direct object",
  },
  "Richtung::accusative::generated-02": {
    before: "Wir ändern ", after: ".",
    translation: "We change direction.", trigger: "direct object",
  },
  "Spaß::accusative::generated-02": {
    before: "Niemand versteht ", after: ".",
    translation: "No one understands the joke.", trigger: "direct object",
  },
  "Stelle::dative::generated-02": {
    before: "An ", after: " beginnt der Weg.",
    translation: "The path begins at that spot.", trigger: "an + dative (location)",
  },
};

const pilotNounIds = new Set(PILOT.map(([noun, en]) => seedCardId(seedByKey.get(`${noun}::${en}`))));

const GENERATED_CASE_EXAMPLES = loadSeed()
  .filter((word) => word.casePracticeStatus !== "pending")
  .filter((word) => !pilotNounIds.has(seedCardId(word)))
  .flatMap((word) => PRACTICED_CASES.flatMap((grammaticalCase) => {
    const shortCase = { nominative: "nom", dative: "dat", accusative: "acc" }[grammaticalCase];
    const gloss = word.en.split(" / ")[0].replace(/ \([^)]*\)$/, "");
    return GENERATED_FRAMES[grammaticalCase].map((frame) => {
      const overrideKey = `${word.noun}::${grammaticalCase}::${frame.key}`;
      const isNounSpecific = Object.hasOwn(GENERATED_EXAMPLE_OVERRIDES, overrideKey);
      const authored = GENERATED_EXAMPLE_OVERRIDES[overrideKey] || frame;
      const target = word[grammaticalCase];
      const id = `${seedCardId(word)}-${shortCase}-${frame.key}`;
      const isApproved = PACKAGE_3_APPROVED_IDS.has(id);
      return {
        id,
        version: CASE_EXAMPLE_VERSION,
        nounId: seedCardId(word),
        noun: word.noun,
        grammaticalCase,
        forms: Object.fromEntries(PRACTICED_CASES.map((caseName) => [caseName, word[caseName]])),
        number: word.number || "singular",
        determiner: "definite",
        semanticType: "general",
        before: authored.before,
        target,
        after: authored.after,
        sentence: `${authored.before}${target}${authored.after}`,
        translation: typeof authored.translation === "function" ? authored.translation(gloss) : authored.translation,
        trigger: authored.trigger,
        cefr: word.cefr,
        frequencyRank: word.frequencyRank,
        status: isApproved ? "verified" : "candidate",
        reviewer: isApproved ? PACKAGE_3_REVIEWER : null,
        reviewedAt: isApproved ? PACKAGE_3_REVIEWED_AT : null,
        reviewNotes: isApproved
          ? "Approved by editorial review in Fälle-Prüfung package 3."
          : isNounSpecific
            ? "Noun-specific candidate; editorial review pending."
            : "Shared boilerplate frame; noun-specific rewrite required before editorial review.",
      };
    });
  }));

export const CASE_EXAMPLE_CANDIDATES = [
  ...CORE_CASE_EXAMPLES,
  ...SUPPLEMENTAL_CASE_EXAMPLES,
  ...GENERATED_CASE_EXAMPLES,
];

export function boilerplateCaseExamples(examples = CASE_EXAMPLE_CANDIDATES) {
  return examples.filter((example) =>
    example.reviewNotes === "Shared boilerplate frame; noun-specific rewrite required before editorial review."
  );
}

const BOILERPLATE_CASE_IDS = new Set(boilerplateCaseExamples().map((example) => example.id));

// Only noun-specific candidates reach learners. Shared frames remain in the
// authoring library so editors can replace them in stable CEFR/frequency order
// without changing IDs or discarding existing schedules.
export const CASE_EXAMPLES = CASE_EXAMPLE_CANDIDATES.filter(
  (example) => example.status !== "rejected" && !BOILERPLATE_CASE_IDS.has(example.id)
);

const CEFR_ORDER = new Map(["A1", "A2", "B1", "B2", "C1", "C2"].map((level, index) => [level, index]));

export function caseRewriteBacklog(examples = CASE_EXAMPLE_CANDIDATES) {
  const byNoun = new Map();
  for (const example of boilerplateCaseExamples(examples)) {
    if (!byNoun.has(example.nounId)) {
      byNoun.set(example.nounId, {
        nounId: example.nounId,
        noun: example.noun,
        cefr: example.cefr,
        frequencyRank: example.frequencyRank,
        remainingExampleIds: [],
      });
    }
    byNoun.get(example.nounId).remainingExampleIds.push(example.id);
  }

  return [...byNoun.values()].sort((left, right) =>
    (CEFR_ORDER.get(left.cefr) ?? Number.MAX_SAFE_INTEGER)
      - (CEFR_ORDER.get(right.cefr) ?? Number.MAX_SAFE_INTEGER)
    || (left.frequencyRank ?? Number.MAX_SAFE_INTEGER)
      - (right.frequencyRank ?? Number.MAX_SAFE_INTEGER)
    || left.noun.localeCompare(right.noun, "de")
  );
}

export function examplesForNoun(nounId, { status } = {}) {
  return CASE_EXAMPLES.filter(
    (example) => example.nounId === nounId && (!status || example.status === status)
  );
}

export function verifiedExamplesForNoun(nounId) {
  return examplesForNoun(nounId, { status: "verified" });
}

export function validateCaseExamples(
  examples = CASE_EXAMPLE_CANDIDATES,
  words = loadSeed(),
  { requiredCases = PRACTICED_CASES, minExamplesPerCase = 2, minVerifiedPerCase = 0 } = {}
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
    if (example.version !== CASE_EXAMPLE_VERSION || example.number !== (word.number || "singular") || example.determiner !== "definite") {
      errors.push(`${label}: unsupported schema version or morphology scope`);
    }

    if (!coverage.has(example.nounId)) coverage.set(example.nounId, new Map());
    const nounCoverage = coverage.get(example.nounId);
    if (!nounCoverage.has(example.grammaticalCase)) nounCoverage.set(example.grammaticalCase, []);
    nounCoverage.get(example.grammaticalCase).push(example);
  }

  for (const word of words.filter((item) => item.casePracticeStatus !== "pending")) {
    const nounId = seedCardId(word);
    const nounCoverage = coverage.get(nounId) || new Map();
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
