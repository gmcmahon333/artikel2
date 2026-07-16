import { loadSeed, seedCardId } from "./deck.js";
import { GRAMMAR_RULE_BY_LEMMA } from "./grammarRules.js";

const CASES = ["nominative", "dative", "accusative"];
const words = new Map(loadSeed().map((word) => [word.noun, word]));

function example(id, noun, grammaticalCase, before, after, translation, governor, ruleType) {
  const word = words.get(noun);
  const rule = GRAMMAR_RULE_BY_LEMMA.get(governor);
  if (!word) throw new Error(`Grammar example references unknown noun: ${noun}`);
  if (!rule || rule.grammaticalCase !== grammaticalCase || rule.partOfSpeech !== ruleType) {
    throw new Error(`Grammar example disagrees with rule: ${governor}`);
  }
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
    ruleId: rule.id,
    ruleType,
    cefr: rule.cefr,
    frequencyRank: rule.frequencyRank,
    status: "candidate",
    reviewer: null,
    reviewedAt: null,
    reviewNotes: null,
  };
}

const BASE_GOVERNED_EXAMPLES = [
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
  example("prep-von-mann", "Mann", "dative", "Ich höre von ", ".", "I hear from the man.", "von", "preposition"),
  example("prep-zu-frau", "Frau", "dative", "Wir gehen zu ", ".", "We go to the woman.", "zu", "preposition"),
  example("prep-seit-jahr", "Jahr", "dative", "Seit ", " arbeitet er hier.", "He has worked here since the year began.", "seit", "preposition"),
  example("prep-gegenueber-frau", "Frau", "dative", "Er sitzt ", " gegenüber.", "He sits opposite the woman.", "gegenüber", "preposition"),
  example("prep-gegen-mann", "Mann", "accusative", "Wir spielen gegen ", ".", "We play against the man.", "gegen", "preposition"),
  example("prep-um-stadt", "Stadt", "accusative", "Wir gehen um ", ".", "We walk around the city.", "um", "preposition"),
  example("verb-gefallen-mann", "Mann", "dative", "Die Stadt gefällt ", ".", "The man likes the city.", "gefallen", "verb"),
  example("verb-gehoeren-frau", "Frau", "dative", "Das Geld gehört ", ".", "The money belongs to the woman.", "gehören", "verb"),
  example("verb-antworten-mann", "Mann", "dative", "Ich antworte ", ".", "I answer the man.", "antworten", "verb"),
  example("verb-vertrauen-frau", "Frau", "dative", "Wir vertrauen ", ".", "We trust the woman.", "vertrauen", "verb"),
  example("verb-fehlen-mann", "Mann", "dative", "Das Geld fehlt ", ".", "The man lacks the money.", "fehlen", "verb"),
  example("verb-gratulieren-frau", "Frau", "dative", "Ich gratuliere ", ".", "I congratulate the woman.", "gratulieren", "verb"),
  example("verb-sehen-mann", "Mann", "accusative", "Ich sehe ", ".", "I see the man.", "sehen", "verb"),
  example("verb-hoeren-mann", "Mann", "accusative", "Ich höre ", ".", "I hear the man.", "hören", "verb"),
  example("verb-lesen-seite", "Seite", "accusative", "Ich lese ", ".", "I read the page.", "lesen", "verb"),
  example("verb-kennen-stadt", "Stadt", "accusative", "Ich kenne ", ".", "I know the city.", "kennen", "verb"),
  example("verb-treffen-mann", "Mann", "accusative", "Ich treffe ", ".", "I meet the man.", "treffen", "verb"),
  example("verb-lieben-frau", "Frau", "accusative", "Ich liebe ", ".", "I love the woman.", "lieben", "verb"),
  example("verb-kaufen-uhr", "Uhr", "accusative", "Ich kaufe ", ".", "I buy the clock.", "kaufen", "verb"),
];

const EXTRA_RULE_SPECS = {
  sein: [["Stadt", "Berlin ist ", " an der Spree.", "Berlin is the city on the Spree."], ["Mann", "Das ist ", " aus Berlin.", "That is the man from Berlin."]],
  mit: [["Frau", "Ich spreche mit ", ".", "I speak with the woman."], ["Geld", "Wir bezahlen mit ", ".", "We pay with the money."]],
  für: [["Frau", "Die Blumen sind für ", ".", "The flowers are for the woman."], ["Jahr", "Wir planen für ", ".", "We plan for the year."]],
  aus: [["Land", "Sie kommt aus ", ".", "She comes from the country."], ["Stadt", "Der Zug fährt aus ", ".", "The train leaves the city."]],
  von: [["Frau", "Der Brief kommt von ", ".", "The letter comes from the woman."], ["Arbeit", "Er erzählt von ", ".", "He talks about the work."]],
  zu: [["Mann", "Ich gehe zu ", ".", "I go to the man."], ["Arbeit", "Das gehört zu ", ".", "That belongs with the work."]],
  nach: [["Tag", "Nach ", " sind wir müde.", "After the day, we are tired."], ["Jahr", "Nach ", " beginnt etwas Neues.", "After the year, something new begins."]],
  bei: [["Mann", "Sie wohnt bei ", ".", "She lives with the man."], ["Arbeit", "Bei ", " lerne ich viel.", "I learn a lot at work."]],
  fragen: [["Frau", "Ich frage ", ".", "I ask the woman."], ["Paar", "Wir fragen ", ".", "We ask the couple."]],
  brauchen: [["Geld", "Wir brauchen ", ".", "We need the money."], ["Uhr", "Ich brauche ", ".", "I need the clock."]],
  helfen: [["Mann", "Wir helfen ", ".", "We help the man."], ["Land", "Sie helfen ", ".", "They help the country."]],
  werden: [["Frau", "Sie wird ", " an seiner Seite.", "She becomes the woman at his side."], ["Frage", "Das wird ", " des Tages.", "That becomes the question of the day."]],
  bleiben: [["Mann", "Er bleibt ", " im Team.", "He remains the man on the team."], ["Teil", "Das bleibt ", " des Plans.", "That remains the part of the plan."]],
  ohne: [["Geld", "Ohne ", " können wir nichts kaufen.", "Without the money, we cannot buy anything."], ["Zeit", "Ohne ", " gelingt die Aufgabe nicht.", "Without the time, the task cannot succeed."]],
  gegen: [["Frau", "Sie spielt gegen ", ".", "She plays against the woman."], ["Land", "Die Mannschaft spielt gegen ", ".", "The team plays against the country."]],
  um: [["Welt", "Die Reise geht um ", ".", "The journey goes around the world."], ["Stadt", "Eine Mauer steht um ", ".", "A wall stands around the city."]],
  danken: [["Frau", "Ich danke ", ".", "I thank the woman."], ["Paar", "Wir danken ", ".", "We thank the couple."]],
  besuchen: [["Frau", "Ich besuche ", ".", "I visit the woman."], ["Land", "Wir besuchen ", ".", "We visit the country."]],
  sehen: [["Frau", "Wir sehen ", ".", "We see the woman."], ["Stadt", "Sie sehen ", ".", "They see the city."]],
  hören: [["Frau", "Ich höre ", ".", "I hear the woman."], ["Frage", "Wir hören ", ".", "We hear the question."]],
  lesen: [["Frage", "Ich lese ", ".", "I read the question."], ["Bitte", "Wir lesen ", ".", "We read the request."]],
  kennen: [["Mann", "Wir kennen ", ".", "We know the man."], ["Weg", "Ich kenne ", ".", "I know the way."]],
  treffen: [["Frau", "Wir treffen ", ".", "We meet the woman."], ["Paar", "Ich treffe ", ".", "I meet the couple."]],
  lieben: [["Mann", "Sie liebt ", ".", "She loves the man."], ["Land", "Wir lieben ", ".", "We love the country."]],
  kaufen: [["Seite", "Ich kaufe ", ".", "I buy the page."], ["Teil", "Wir kaufen ", ".", "We buy the part."]],
  gefallen: [["Frau", "Das Buch gefällt ", ".", "The woman likes the book."], ["Paar", "Die Stadt gefällt ", ".", "The couple likes the city."]],
  gehören: [["Mann", "Die Uhr gehört ", ".", "The clock belongs to the man."], ["Paar", "Das Haus gehört ", ".", "The house belongs to the couple."]],
  antworten: [["Frau", "Wir antworten ", ".", "We answer the woman."], ["Paar", "Ich antworte ", ".", "I answer the couple."]],
  fehlen: [["Frau", "Die Zeit fehlt ", ".", "The woman lacks the time."], ["Land", "Das Geld fehlt ", ".", "The country lacks the money."]],
  gratulieren: [["Mann", "Wir gratulieren ", ".", "We congratulate the man."], ["Paar", "Ich gratuliere ", ".", "I congratulate the couple."]],
  durch: [["Land", "Wir fahren durch ", ".", "We drive through the country."], ["Welt", "Die Nachricht geht durch ", ".", "The news travels through the world."]],
  seit: [["Tag", "Seit ", " wartet sie hier.", "She has waited here since that day."], ["Jahr", "Seit ", " lebt er im Ausland.", "He has lived abroad since that year."]],
  gegenüber: [["Mann", "Sie sitzt ", " gegenüber.", "She sits opposite the man."], ["Paar", "Wir wohnen ", " gegenüber.", "We live opposite the couple."]],
  folgen: [["Mann", "Wir folgen ", ".", "We follow the man."], ["Frau", "Das Kind folgt ", ".", "The child follows the woman."]],
  vertrauen: [["Mann", "Ich vertraue ", ".", "I trust the man."], ["Paar", "Wir vertrauen ", ".", "We trust the couple."]],
  begegnen: [["Frau", "Wir begegnen ", ".", "We meet the woman."], ["Paar", "Ich begegne ", ".", "I encounter the couple."]],
};

const EXTRA_GOVERNED_EXAMPLES = Object.entries(EXTRA_RULE_SPECS).flatMap(([governor, specs]) => {
  const rule = GRAMMAR_RULE_BY_LEMMA.get(governor);
  return specs.map(([noun, before, after, translation], index) =>
    example(`${rule.id}-extra-${String(index + 1).padStart(2, "0")}`, noun, rule.grammaticalCase, before, after, translation, governor, rule.partOfSpeech)
  );
});

const EXPANDED_RULE_SPECS = {
  außer: { nouns: ["Mann", "Frau", "Paar"], frame: (t) => [`Außer ${t} kommt niemand.`, "No one is coming except the named person."] },
  ab: { nouns: ["Tag", "Jahr", "Woche"], frame: (t) => [`Ab ${t} gilt die neue Regel.`, "The new rule applies from that time onward."] },
  entgegen: { nouns: ["Wunsch", "Plan", "Idee"], frame: (t) => [`Entgegen ${t} handeln wir anders.`, "Contrary to it, we act differently."] },
  gemäß: { nouns: ["Plan", "Auftrag", "Recht"], frame: (t) => [`Gemäß ${t} beginnen wir heute.`, "In accordance with it, we begin today."] },
  samt: { nouns: ["Mann", "Frau", "Paar"], frame: (t) => [`Wir begrüßen alle samt ${t}.`, "We welcome everyone together with the named person."] },
  mitsamt: { nouns: ["Mann", "Frau", "Paar"], frame: (t) => [`Alle kommen mitsamt ${t}.`, "Everyone is coming together with the named person."] },
  zufolge: { nouns: ["Mann", "Frau", "Paar"], frame: (t) => [`Wir handeln ${t} zufolge.`, "We act according to the named person."] },
  zuliebe: { nouns: ["Mann", "Frau", "Paar"], frame: (t) => [`Wir bleiben ${t} zuliebe hier.`, "We are staying here for the named person's sake."] },
  entsprechend: { nouns: ["Plan", "Wunsch", "Auftrag"], frame: (t) => [`Entsprechend ${t} handeln wir sofort.`, "In accordance with it, we act immediately."] },
  binnen: { nouns: ["Tag", "Jahr", "Woche"], frame: (t) => [`Binnen ${t} erhalten Sie eine Antwort.`, "You will receive an answer within that period."] },
  entlang: { nouns: ["Weg", "Straße", "Grenze"], frame: (t) => [`Wir gehen ${t} entlang.`, "We walk along it."] },
  wider: { nouns: ["Plan", "Wunsch", "Recht"], frame: (t) => [`Das geschieht wider ${t}.`, "That happens contrary to it."] },
  nebst: { nouns: ["Mann", "Frau", "Paar"], frame: (t) => [`Alle kommen nebst ${t}.`, "Everyone is coming along with the named person."] },
  nahe: { nouns: ["Stadt", "Dorf", "Grenze"], frame: (t) => [`Das Haus liegt nahe ${t}.`, "The house is located near that place."] },
  fern: { nouns: ["Stadt", "Dorf", "Grenze"], frame: (t) => [`Das Haus liegt fern ${t}.`, "The house is located far from that place."] },
  zuwider: { nouns: ["Plan", "Wunsch", "Recht"], frame: (t) => [`Das geschieht ${t} zuwider.`, "That happens contrary to it."] },
};

const VERB_FORMS = {
  anrufen: "ruft", essen: "isst", finden: "findet", haben: "hat", mögen: "mag", nehmen: "nimmt",
  suchen: "sucht", verstehen: "versteht", bekommen: "bekommt", bestellen: "bestellt", bezahlen: "bezahlt",
  fotografieren: "fotografiert", öffnen: "öffnet", schließen: "schließt", vergessen: "vergisst",
  verlieren: "verliert", wählen: "wählt", akzeptieren: "akzeptiert", beantworten: "beantwortet",
  ähneln: "ähnelt", drohen: "droht", einfallen: "fällt", entsprechen: "entspricht", gelingen: "gelingt",
  genügen: "genügt", missfallen: "missfällt", nützen: "nützt", passen: "passt", raten: "rät",
  schaden: "schadet", schmecken: "schmeckt", widersprechen: "widerspricht", zustimmen: "stimmt",
  zuhören: "hört", verzeihen: "verzeiht",
};

const VERB_NOUNS = {
  essen: ["Brot", "Apfel", "Kuchen"], nehmen: ["Kaffee", "Zug", "Weg"],
  bekommen: ["Antwort", "Auftrag", "Brief"], bestellen: ["Kaffee", "Brot", "Buch"],
  bezahlen: ["Kaffee", "Karte", "Rechnung"], öffnen: ["Tür", "Fenster", "Brief"],
  schließen: ["Tür", "Fenster", "Vertrag"], beantworten: ["Frage", "Bitte", "Nachricht"],
  einfallen: ["Mann", "Frau", "Paar"], entsprechen: ["Plan", "Wunsch", "Auftrag"],
  gelingen: ["Mann", "Frau", "Paar"], genügen: ["Mann", "Frau", "Paar"],
  nützen: ["Mann", "Frau", "Paar"], passen: ["Mann", "Frau", "Paar"],
  schmecken: ["Mann", "Frau", "Paar"],
};

function expandedVerbFrame(rule, target) {
  const finite = VERB_FORMS[rule.lemma];
  if (rule.lemma === "anrufen") return [`Die Gruppe ruft ${target} an.`, "The group calls the named person."];
  if (rule.lemma === "einfallen") return [`Die Lösung fällt ${target} ein.`, "The solution occurs to the named person."];
  if (rule.lemma === "gelingen") return [`Die Aufgabe gelingt ${target}.`, "The named person succeeds at the task."];
  if (rule.lemma === "genügen") return [`Die Antwort genügt ${target}.`, "The answer is sufficient for the named person."];
  if (rule.lemma === "missfallen") return [`Der Plan missfällt ${target}.`, "The named person dislikes the plan."];
  if (rule.lemma === "nützen") return [`Die Übung nützt ${target}.`, "The exercise benefits the named person."];
  if (rule.lemma === "passen") return [`Der Termin passt ${target}.`, "The appointment suits the named person."];
  if (rule.lemma === "schmecken") return [`Das Essen schmeckt ${target}.`, "The named person likes the taste of the food."];
  if (rule.lemma === "zustimmen") return [`Die Gruppe stimmt ${target} zu.`, "The group agrees with the named person."];
  if (rule.lemma === "zuhören") return [`Die Gruppe hört ${target} zu.`, "The group listens to the named person."];
  return [`Die Gruppe ${finite} ${target}.`, `The group uses “${rule.lemma}” with the named object.`];
}

const existingRuleIds = new Set([...BASE_GOVERNED_EXAMPLES, ...EXTRA_GOVERNED_EXAMPLES].map((item) => item.ruleId));
const EXPANDED_GOVERNED_EXAMPLES = [...GRAMMAR_RULE_BY_LEMMA.values()]
  .filter((rule) => !existingRuleIds.has(rule.id))
  .flatMap((rule) => {
    const spec = EXPANDED_RULE_SPECS[rule.lemma];
    const nouns = spec?.nouns || VERB_NOUNS[rule.lemma] || ["Mann", "Frau", "Paar"];
    return nouns.map((noun, index) => {
      const word = words.get(noun);
      if (!word) throw new Error(`Expanded grammar example references unknown noun: ${noun}`);
      const target = word[rule.grammaticalCase];
      const [sentence, translation] = spec ? spec.frame(target) : expandedVerbFrame(rule, target);
      const targetIndex = sentence.indexOf(target);
      if (targetIndex < 0) throw new Error(`Expanded grammar frame omits target: ${rule.lemma}`);
      return example(
        `${rule.id}-generated-${String(index + 1).padStart(2, "0")}`,
        noun,
        rule.grammaticalCase,
        sentence.slice(0, targetIndex),
        sentence.slice(targetIndex + target.length),
        translation,
        rule.lemma,
        rule.partOfSpeech
      );
    });
  });

export const GOVERNED_EXAMPLES = [
  ...BASE_GOVERNED_EXAMPLES,
  ...EXTRA_GOVERNED_EXAMPLES,
  ...EXPANDED_GOVERNED_EXAMPLES,
];
