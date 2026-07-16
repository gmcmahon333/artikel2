import React from "react";

const MODES = [
  { id: "article", label: "Artikel", aria: "Artikelkarten" },
  { id: "case", label: "Fälle", aria: "Fallkarten" },
  { id: "rules", label: "Regeln", aria: "Regelkarten" },
];

export default function StudyModeSwitch({ value, onChange }) {
  return (
    <div className="mode-switch" role="tablist" aria-label="Übungsmodus">
      {MODES.map((mode) => (
        <button
          key={mode.id}
          type="button"
          role="tab"
          aria-label={mode.aria}
          aria-selected={value === mode.id}
          className={`mode-switch__option${value === mode.id ? " mode-switch__option--active" : ""}`}
          onClick={() => onChange(mode.id)}
        >
          {mode.label}
          {mode.id === "case" && <span className="mode-switch__preview">Vorschau</span>}
        </button>
      ))}
    </div>
  );
}
