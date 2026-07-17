import React, { useEffect, useState } from "react";
import { RATING } from "../lib/engine.js";
import GradeBar from "./GradeBar.jsx";

const CASES = [
  { value: "nominative", label: "Nominativ", hint: "1" },
  { value: "dative", label: "Dativ", hint: "2" },
  { value: "accusative", label: "Akkusativ", hint: "3" },
];

const LABELS = Object.fromEntries(CASES.map((item) => [item.value, item.label]));
const TYPE_LABELS = { verb: "Verb", preposition: "Präposition", copula: "Kopulaverb" };

export default function RuleFlashcard({ example, onComplete }) {
  const [answer, setAnswer] = useState(null);
  const [incorrectAttempt, setIncorrectAttempt] = useState(0);
  const [grade, setGrade] = useState(null);
  const [meaningGrade, setMeaningGrade] = useState(null);
  const [shownAt, setShownAt] = useState(Date.now());

  useEffect(() => {
    setAnswer(null);
    setIncorrectAttempt(0);
    setGrade(null);
    setMeaningGrade(null);
    setShownAt(Date.now());
  }, [example.id]);

  function choose(value) {
    if (answer) return;
    if (value === example.grammaticalCase) {
      setAnswer(value);
      setGrade(incorrectAttempt > 0
        ? RATING.MISSED
        : Date.now() - shownAt <= 3000
          ? RATING.EASY
          : RATING.GOT);
    } else {
      setIncorrectAttempt((attempt) => attempt + 1);
    }
  }

  useEffect(() => {
    function onKey(event) {
      const target = event.target;
      if (target && (target.tagName === "INPUT" || target.tagName === "SELECT" || target.tagName === "TEXTAREA")) return;
      if (answer || !["1", "2", "3"].includes(event.key)) return;
      event.preventDefault();
      choose(CASES[Number(event.key) - 1].value);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answer]);

  return (
    <div
      className="card rule-card"
      data-revealed={answer ? "true" : "false"}
      data-case={answer ? example.grammaticalCase : "none"}
      data-incorrect={incorrectAttempt ? (incorrectAttempt % 2 ? "odd" : "even") : "false"}
    >
      <div className="card__accent" />
      <p className="card__prompt">
        {answer
          ? "Regel + Beispiel"
          : incorrectAttempt
            ? "Nicht ganz — versuch es noch einmal"
            : "Welchen Fall verlangt dieses Wort?"}
      </p>

      <p className="rule-card__type">{TYPE_LABELS[example.ruleType]}</p>
      <h1 className="rule-card__governor">{example.governor}</h1>

      <div className="rule-options" role="group" aria-label="Grammatischen Fall auswählen">
        {CASES.map((option) => {
          const correct = answer && option.value === example.grammaticalCase;
          return (
            <button
              key={option.value}
              type="button"
              className={`rule-option${correct ? " rule-option--correct" : ""}`}
              data-case={option.value}
              onClick={() => choose(option.value)}
              disabled={Boolean(answer)}
              aria-pressed={Boolean(correct)}
            >
              {option.label}<kbd>{option.hint}</kbd>
            </button>
          );
        })}
      </div>

      {answer && (
        <div className="case-result" aria-live="polite">
          <p className="case-result__status" data-case={example.grammaticalCase}>
            Richtiger Fall: {LABELS[example.grammaticalCase]}
          </p>
          <p className="rule-card__example">
            {example.before}<mark>{example.target}</mark>{example.after}
          </p>
          <p className="case-result__translation">{example.translation}</p>
          <p className="case-result__trigger">Warum? {example.trigger}</p>
          <table className="rule-reference">
            <caption>Andere Fälle zum Vergleich</caption>
            <tbody>
              {CASES.filter((item) => item.value !== example.grammaticalCase).map((item) => (
                <tr key={item.value}>
                  <th scope="row" data-case={item.value}>{item.label}</th>
                  <td>{example.forms[item.value]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <GradeBar
            label="Wie gut kanntest du die Bedeutung?"
            value={meaningGrade}
            active
            onGrade={(value) => {
              setMeaningGrade(value);
              onComplete(grade, value);
            }}
          />
        </div>
      )}
    </div>
  );
}
