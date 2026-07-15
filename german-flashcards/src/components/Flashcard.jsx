import React, { useState } from "react";
import GradeBar from "./GradeBar.jsx";
import { nounImageUrl } from "../lib/nounImages.js";

const ARTICLE_LABEL = { der: "der", die: "die", das: "das" };

export default function Flashcard({
  card,
  revealed,
  onReveal,
  aGrade,
  mGrade,
  activeAxis,
  onGradeArticle,
  onGradeMeaning,
}) {
  const imageUrl = nounImageUrl(card);
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div
      className="card"
      data-revealed={revealed ? "true" : "false"}
      data-gender={revealed ? card.gender : "none"}
    >
      <div className="card__accent" />

      <div className="card__face">
        <p className="card__prompt">
          {revealed ? "Artikel + Bedeutung" : "Welcher Artikel? Welche Bedeutung?"}
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

      {!revealed ? (
        <button className="reveal" onClick={onReveal}>
          Reveal <kbd>Space</kbd>
        </button>
      ) : (
        <div className="grades">
          <GradeBar
            label="Article"
            value={aGrade}
            active={activeAxis === "article"}
            onGrade={onGradeArticle}
          />
          <GradeBar
            label="Meaning"
            value={mGrade}
            active={activeAxis === "meaning"}
            onGrade={onGradeMeaning}
          />
        </div>
      )}
    </div>
  );
}
