import React from "react";
import { RATING } from "../lib/engine.js";

const BUTTONS = [
  { key: "MISSED", label: "Nicht gewusst", grade: RATING.MISSED, hint: "1" },
  { key: "GOT", label: "Gewusst", grade: RATING.GOT, hint: "2" },
  { key: "EASY", label: "Leicht", grade: RATING.EASY, hint: "3" },
];

export default function GradeBar({ label, value, active, onGrade }) {
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
