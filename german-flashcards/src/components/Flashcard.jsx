import React, { useState } from "react";
import GradeBar from "./GradeBar.jsx";
import { nounImageUrl } from "../lib/nounImages.js";

const ARTICLE_LABEL = { der: "der", die: "die", das: "das" };

export default function Flashcard({
  card,
  revealed,
  selectedArticle,
  incorrectAttempt,
  mGrade,
  onChooseArticle,
  onGradeMeaning,
}) {
  const imageUrl = nounImageUrl(card);
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div
      className="card"
      data-revealed={revealed ? "true" : "false"}
      data-gender={revealed ? card.gender : "none"}
      data-incorrect={incorrectAttempt ? (incorrectAttempt % 2 ? "odd" : "even") : "false"}
    >
      <div className="card__accent" />

      <div className="card__face">
        <p className="card__prompt">
          {revealed
            ? "Artikel + Bedeutung"
            : incorrectAttempt
              ? "Nicht ganz — versuch es noch einmal"
              : "Welcher Artikel?"}
        </p>

        {imageUrl && !imageFailed && (
          <div className="card__visual">
            <img
              className="card__image"
              src={imageUrl}
              alt=""
              loading="eager"
              decoding="async"
              onError={() => setImageFailed(true)}
            />
          </div>
        )}

        <h1 className="card__noun">
          {revealed && <span className="card__article">{ARTICLE_LABEL[card.gender]} </span>}
          {card.noun}
        </h1>

        <div className="card__answer" aria-hidden={!revealed}>
          <span className="card__en">{card.en}</span>
        </div>
      </div>

      <div className="articles" role="group" aria-label="Deutschen Artikel auswählen">
        {Object.keys(ARTICLE_LABEL).map((article, index) => {
          const chosen = selectedArticle === article;
          const correct = revealed && article === card.gender;
          const showChosen = chosen && (!revealed || article === card.gender);
          return (
            <button
              key={article}
              className={`article-choice${showChosen ? " article-choice--chosen" : ""}${correct ? " article-choice--correct" : ""}`}
              data-gender={article}
              onClick={() => onChooseArticle(article)}
              disabled={revealed}
              aria-pressed={chosen}
            >
              {article}<kbd>{index + 1}</kbd>
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="grades">
          <p className="article-result" data-gender={card.gender}>
            {selectedArticle === card.gender ? "Richtiger Artikel" : `Richtiger Artikel: ${card.gender}`}
          </p>
          <GradeBar
            label="Wie gut kanntest du die Bedeutung?"
            value={mGrade}
            active
            onGrade={onGradeMeaning}
          />
        </div>
      )}
    </div>
  );
}
