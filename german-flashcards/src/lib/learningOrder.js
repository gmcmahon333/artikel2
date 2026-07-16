const CEFR_ORDER = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
const CASE_ORDER = { nominative: 0, accusative: 1, dative: 2 };

export function orderCaseCards(cards, examples) {
  const metadata = new Map(examples.map((example) => [example.id, example]));
  return [...cards].sort((a, b) => {
    const left = metadata.get(a.id);
    const right = metadata.get(b.id);
    const level = (CEFR_ORDER[left?.cefr] || 99) - (CEFR_ORDER[right?.cefr] || 99);
    if (level) return level;

    // Rotate the first practiced case by noun rank, then introduce the next
    // case for every noun before starting the third pass.
    const leftRound = ((CASE_ORDER[left?.grammaticalCase] || 0) + (left?.frequencyRank || 0)) % 3;
    const rightRound = ((CASE_ORDER[right?.grammaticalCase] || 0) + (right?.frequencyRank || 0)) % 3;
    if (leftRound !== rightRound) return leftRound - rightRound;
    return (left?.frequencyRank || 99999) - (right?.frequencyRank || 99999) || a.id.localeCompare(b.id);
  });
}

export function orderRuleCards(cards, examples) {
  const metadata = new Map(examples.map((example) => [example.id, example]));
  const rounds = new Map();
  const byRule = new Map();
  for (const example of examples) {
    const key = example.ruleId || example.governor;
    if (!byRule.has(key)) byRule.set(key, []);
    byRule.get(key).push(example);
  }
  for (const group of byRule.values()) {
    group.sort((a, b) => a.id.localeCompare(b.id)).forEach((example, index) => rounds.set(example.id, index));
  }
  return [...cards].sort((a, b) => {
    const left = metadata.get(a.id);
    const right = metadata.get(b.id);
    return (CEFR_ORDER[left?.cefr] || 99) - (CEFR_ORDER[right?.cefr] || 99)
      || (rounds.get(a.id) || 0) - (rounds.get(b.id) || 0)
      || (left?.frequencyRank || 99999) - (right?.frequencyRank || 99999)
      || a.id.localeCompare(b.id);
  });
}
