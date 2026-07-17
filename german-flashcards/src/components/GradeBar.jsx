import React, { useEffect } from "react";
import { RATING } from "../lib/engine.js";

const BUTTONS = [
  { key: "MISSED", label: "Nicht gewusst", grade: RATING.MISSED, hint: "1" },
  { key: "GOT", label: "Gewusst", grade: RATING.GOT, hint: "2" },
  { key: "EASY", label: "Leicht", grade: RATING.EASY, hint: "3" },
];

const KEY_GRADES = Object.fromEntries(BUTTONS.map((button) => [button.hint, button.grade]));

export default function GradeBar({ label, value, active, onGrade }) {
  useEffect(() => {
    function onKey(event) {
      const target = event.target;
      if (!active || value !== null || !(event.key in KEY_GRADES)) return;
      if (target && (target.tagName === "INPUT" || target.tagName === "SELECT" || target.tagName === "TEXTAREA")) return;
      event.preventDefault();
      onGrade(KEY_GRADES[event.key]);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onGrade, value]);

  return (
    <div className={`gradebar${active ? " gradebar--active" : ""}`}>
      <span className="gradebar__label">{label}</span>
      <div className="gradebar__buttons" role="group" aria-label={label}>
        {BUTTONS.map((b) => (
          <button
            key={b.key}
            className={`grade grade--${b.key.toLowerCase()}${
              value === b.grade ? " grade--on" : ""
            }`}
            onClick={() => onGrade(b.grade)}
            aria-pressed={value === b.grade}
          >
            {b.label}
            <kbd>{b.hint}</kbd>
          </button>
        ))}
      </div>
    </div>
  );
}
