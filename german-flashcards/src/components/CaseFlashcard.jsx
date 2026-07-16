import React, { useEffect, useState } from "react";
import { RATING } from "../lib/engine.js";
import GradeBar from "./GradeBar.jsx";

const CASES = [
  { value: "nominative", label: "Nominativ", hint: "1" },
  { value: "dative", label: "Dativ", hint: "2" },
  { value: "accusative", label: "Akkusativ", hint: "3" },
];

const CASE_LABELS = Object.fromEntries(CASES.map((item) => [item.value, item.label]));
const KEY_RATINGS = { "1": RATING.MISSED, "2": RATING.GOT, "3": RATING.EASY };

export default function CaseFlashcard({ example, onComplete }) {
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

  function chooseCase(value) {
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
      if (!KEY_RATINGS[event.key] || meaningGrade !== null) return;
      event.preventDefault();
      if (!answer) {
        chooseCase(CASES[Number(event.key) - 1].value);
        return;
      }
      const value = KEY_RATINGS[event.key];
      setMeaningGrade(value);
      onComplete(grade, value);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answer, grade, meaningGrade, onComplete]);

  return (
    <div
      className="card case-card"
      data-revealed={answer ? "true" : "false"}
      data-case={answer ? example.grammaticalCase : "none"}
      data-incorrect={incorrectAttempt ? (incorrectAttempt % 2 ? "odd" : "even") : "false"}
    >
      <div className="card__accent" />
      <p className="card__prompt">
        {answer
          ? "Deklination + Bedeutung"
          : incorrectAttempt
            ? "Nicht ganz — versuch es noch einmal"
            : "Welche Deklination passt?"}
      </p>

      <p className="case-card__sentence">
        {example.before}
        {answer ? <mark>{example.target}</mark> : <span className="case-card__blank" aria-label="Lücke" />}
        {example.after}
      </p>

      <div className="case-options" role="group" aria-label="Passende Deklination auswählen">
        {CASES.map((option) => {
          const correct = answer && option.value === example.grammaticalCase;
          return (
            <div className="case-choice" key={option.value} data-case={option.value}>
              <button
                type="button"
                className={`case-option${correct ? " case-option--correct" : ""}`}
                data-case={option.value}
                onClick={() => chooseCase(option.value)}
                disabled={Boolean(answer)}
                aria-pressed={Boolean(correct)}
                aria-describedby={`case-label-${option.value}`}
              >
                {example.forms[option.value]}<kbd>{option.hint}</kbd>
              </button>
              <span className="case-choice__label" id={`case-label-${option.value}`}>
                {option.label}
              </span>
            </div>
          );
        })}
      </div>

      {answer && (
        <div className="case-result" aria-live="polite">
          <p className="case-result__status" data-case={example.grammaticalCase}>
            Richtiger Fall: {CASE_LABELS[example.grammaticalCase]}
          </p>
          <p className="case-result__translation">{example.translation}</p>
          <p className="case-result__trigger">Warum? {example.trigger}</p>
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
