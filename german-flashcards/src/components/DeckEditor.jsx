import React, { useState } from "react";

const GENDERS = ["der", "die", "das"];
const EMPTY = { noun: "", gender: "der", en: "" };

export default function DeckEditor({ cards, onAdd, onUpdate, onDelete, onClose }) {
  const [draft, setDraft] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [edit, setEdit] = useState(EMPTY);

  function submitNew(e) {
    e.preventDefault();
    if (!draft.noun.trim() || !draft.en.trim()) return;
    onAdd({ noun: draft.noun.trim(), gender: draft.gender, en: draft.en.trim() });
    setDraft(EMPTY);
  }

  function startEdit(c) {
    setEditingId(c.id);
    setEdit({ noun: c.noun, gender: c.gender, en: c.en });
  }
  function saveEdit(id) {
    if (!edit.noun.trim() || !edit.en.trim()) return;
    onUpdate(id, { noun: edit.noun.trim(), gender: edit.gender, en: edit.en.trim() });
    setEditingId(null);
  }

  return (
    <div className="editor">
      <div className="editor__head">
        <h2>Deck <span className="editor__count">{cards.length}</span></h2>
        <button className="btn btn--ghost" onClick={onClose}>Done</button>
      </div>

      <form className="editor__add" onSubmit={submitNew}>
        <div className="editor__row">
          <select
            className="gpick"
            data-gender={draft.gender}
            value={draft.gender}
            onChange={(e) => setDraft({ ...draft, gender: e.target.value })}
            aria-label="Gender"
          >
            {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          <input
            className="ein"
            placeholder="Noun (e.g. Tisch)"
            value={draft.noun}
            onChange={(e) => setDraft({ ...draft, noun: e.target.value })}
          />
          <input
            className="ein"
            placeholder="Meaning (e.g. table)"
            value={draft.en}
            onChange={(e) => setDraft({ ...draft, en: e.target.value })}
          />
          <button className="btn editor__addbtn" type="submit">Add</button>
        </div>
      </form>

      <ul className="editor__list">
        {cards.map((c) => (
          <li key={c.id} className="editor__item">
            {editingId === c.id ? (
              <div className="editor__row">
                <select
                  className="gpick"
                  data-gender={edit.gender}
                  value={edit.gender}
                  onChange={(e) => setEdit({ ...edit, gender: e.target.value })}
                >
                  {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
                <input className="ein" value={edit.noun} onChange={(e) => setEdit({ ...edit, noun: e.target.value })} />
                <input className="ein" value={edit.en} onChange={(e) => setEdit({ ...edit, en: e.target.value })} />
                <button className="iconbtn" onClick={() => saveEdit(c.id)} title="Save">✓</button>
                <button className="iconbtn" onClick={() => setEditingId(null)} title="Cancel">✕</button>
              </div>
            ) : (
              <>
                <span className="editor__word">
                  <span className="editor__art" data-gender={c.gender}>{c.gender}</span> {c.noun}
                  <span className="editor__en">{c.en}</span>
                </span>
                <span className="editor__actions">
                  <button className="iconbtn" onClick={() => startEdit(c)} title="Edit">✎</button>
                  <button className="iconbtn" onClick={() => onDelete(c.id)} title="Delete">🗑</button>
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
