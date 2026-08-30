import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { RATING } from "../lib/engine.js";
import GradeBar from "./GradeBar.jsx";

const CASES = [
  { value: "nominative", label: "Nominativ", hint: "1" },
  { value: "dative", label: "Dativ", hint: "2" },
  { value: "accusative", label: "Akkusativ", hint: "3" },
];

const CASE_LABELS = Object.fromEntries(CASES.map((item) => [item.value, item.label]));

function CaseOption({ form, option, correct, answer, onChoose }) {
  const buttonRef = useRef(null);
  const formRef = useRef(null);

  useLayoutEffect(() => {
    const button = buttonRef.current;
    const label = formRef.current;
    if (!button || !label) return undefined;

    let active = true;
    const fitLabel = () => {
      label.style.fontSize = "";
      const availableWidth = button.clientWidth - 22;
      const renderedWidth = label.scrollWidth;
      if (!availableWidth || renderedWidth <= availableWidth) return;
      const baseSize = Number.parseFloat(window.getComputedStyle(label).fontSize);
      label.style.fontSize = `${Math.max(10, baseSize * (availableWidth / renderedWidth) * 0.97)}px`;
    };

    fitLabel();
    const observer = new ResizeObserver(fitLabel);
    observer.observe(button);
    document.fonts?.ready.then(() => {
      if (active) fitLabel();
    });
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [form]);

  return (
    <div className="case-choice" data-case={option.value}>
      <button
        ref={buttonRef}
        type="button"
        className={`case-option${correct ? " case-option--correct" : ""}`}
        data-case={option.value}
        onClick={() => onChoose(option.value)}
        disabled={Boolean(answer)}
        aria-pressed={Boolean(correct)}
        aria-describedby={`case-label-${option.value}`}
      >
        <span ref={formRef} className="case-option__form">{form}</span><kbd>{option.hint}</kbd>
      </button>
      <span className="case-choice__label" id={`case-label-${option.value}`}>
        {option.label}
      </span>
    </div>
  );
}

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
      if (answer || !["1", "2", "3"].includes(event.key)) return;
      event.preventDefault();
      chooseCase(CASES[Number(event.key) - 1].value);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answer]);

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
        {answer ? <mark>{example.displayTarget || example.target}</mark> : <span className="case-card__blank" aria-label="Lücke" />}
        {example.after}
      </p>

      <div className="case-options" role="group" aria-label="Passende Deklination auswählen">
        {CASES.map((option) => {
          const correct = answer && option.value === example.grammaticalCase;
          return (
            <CaseOption
              key={option.value}
              form={example.forms[option.value]}
              option={option}
              correct={correct}
              answer={answer}
              onChoose={chooseCase}
            />
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
