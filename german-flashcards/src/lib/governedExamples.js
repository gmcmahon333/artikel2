import { loadSeed, seedCardId } from "./deck.js";

const CASES = ["nominative", "dative", "accusative"];
const words = new Map(loadSeed().map((word) => [word.noun, word]));

const GOVERNOR_PRIORITY = {
  sein: { cefr: "A1", frequencyRank: 1 },
  mit: { cefr: "A1", frequencyRank: 2 },
  für: { cefr: "A1", frequencyRank: 3 },
  aus: { cefr: "A1", frequencyRank: 4 },
  nach: { cefr: "A1", frequencyRank: 5 },
  bei: { cefr: "A1", frequencyRank: 6 },
  fragen: { cefr: "A1", frequencyRank: 7 },
  brauchen: { cefr: "A1", frequencyRank: 8 },
  helfen: { cefr: "A1", frequencyRank: 9 },
  werden: { cefr: "A1", frequencyRank: 10 },
  bleiben: { cefr: "A1", frequencyRank: 11 },
  ohne: { cefr: "A1", frequencyRank: 12 },
  danken: { cefr: "A1", frequencyRank: 13 },
  besuchen: { cefr: "A1", frequencyRank: 14 },
  durch: { cefr: "A2", frequencyRank: 15 },
  folgen: { cefr: "B1", frequencyRank: 16 },
  begegnen: { cefr: "B1", frequencyRank: 17 },
};

function example(id, noun, grammaticalCase, before, after, translation, governor, ruleType) {
  const word = words.get(noun);
  const priority = GOVERNOR_PRIORITY[governor];
  if (!word) throw new Error(`Grammar example references unknown noun: ${noun}`);
  return {
    id: `rule-${id}`,
    nounId: seedCardId(word),
    noun,
    grammaticalCase,
    forms: Object.fromEntries(CASES.map((caseName) => [caseName, word[caseName]])),
    target: word[grammaticalCase],
    before,
    after,
    sentence: `${before}${word[grammaticalCase]}${after}`,
    translation,
    trigger: `${governor} verlangt ${grammaticalCase === "dative" ? "den Dativ" : grammaticalCase === "accusative" ? "den Akkusativ" : "den Nominativ"}`,
    governor,
    ruleType,
    cefr: priority.cefr,
    frequencyRank: priority.frequencyRank,
    status: "candidate",
  };
}

export const GOVERNED_EXAMPLES = [
  example("prep-mit-mann", "Mann", "dative", "Ich spreche mit ", ".", "I speak with the man.", "mit", "preposition"),
  example("prep-nach-arbeit", "Arbeit", "dative", "Nach ", " fahre ich nach Hause.", "After work, I go home.", "nach", "preposition"),
  example("prep-aus-stadt", "Stadt", "dative", "Sie kommt aus ", ".", "She comes from the city.", "aus", "preposition"),
  example("prep-bei-frau", "Frau", "dative", "Er wohnt bei ", ".", "He lives with the woman.", "bei", "preposition"),
  example("verb-helfen-frau", "Frau", "dative", "Ich helfe ", ".", "I help the woman.", "helfen", "verb"),
  example("verb-danken-mann", "Mann", "dative", "Wir danken ", ".", "We thank the man.", "danken", "verb"),
  example("verb-folgen-weg", "Weg", "dative", "Sie folgt ", ".", "She follows the path.", "folgen", "verb"),
  example("verb-begegnen-mann", "Mann", "dative", "Ich begegne ", ".", "I meet the man.", "begegnen", "verb"),
  example("prep-fuer-mann", "Mann", "accusative", "Das Geschenk ist für ", ".", "The gift is for the man.", "für", "preposition"),
  example("prep-durch-stadt", "Stadt", "accusative", "Wir fahren durch ", ".", "We drive through the city.", "durch", "preposition"),
  example("prep-ohne-arbeit", "Arbeit", "accusative", "Ohne ", " fehlt uns Geld.", "Without work, we lack money.", "ohne", "preposition"),
  example("verb-besuchen-stadt", "Stadt", "accusative", "Wir besuchen ", ".", "We visit the city.", "besuchen", "verb"),
  example("verb-fragen-mann", "Mann", "accusative", "Sie fragt ", ".", "She asks the man.", "fragen", "verb"),
  example("verb-brauchen-zeit", "Zeit", "accusative", "Ich brauche ", ".", "I need the time.", "brauchen", "verb"),
  example("copula-sein-frage", "Frage", "nominative", "Das ist ", ".", "That is the question.", "sein", "copula"),
  example("copula-bleiben-frage", "Frage", "nominative", "Das bleibt ", ".", "That remains the question.", "bleiben", "copula"),
  example("copula-werden-mann", "Mann", "nominative", "Er wird ", " an ihrer Seite.", "He becomes the man at her side.", "werden", "copula"),
];
