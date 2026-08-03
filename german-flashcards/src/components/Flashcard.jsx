import React, { useLayoutEffect, useRef, useState } from "react";
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
  const nounRef = useRef(null);
  const needsNounFit = card.noun.length > 14;

  useLayoutEffect(() => {
    const noun = nounRef.current;
    if (!noun) return undefined;
    noun.style.fontSize = "";
    if (!needsNounFit) return undefined;

    let active = true;

    const fitNoun = () => {
      noun.style.fontSize = "";
      const availableWidth = noun.clientWidth;
      const renderedWidth = noun.scrollWidth;
      if (!availableWidth || renderedWidth <= availableWidth) return;

      const baseSize = Number.parseFloat(window.getComputedStyle(noun).fontSize);
      const fittedSize = Math.max(18, baseSize * (availableWidth / renderedWidth) * 0.98);
      noun.style.fontSize = `${fittedSize}px`;
    };

    fitNoun();
    const observer = new ResizeObserver(fitNoun);
    observer.observe(noun.parentElement);
    document.fonts?.ready.then(() => {
      if (active) fitNoun();
    });
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [card.noun, needsNounFit, revealed]);

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

        <h1
          ref={nounRef}
          className={`card__noun${needsNounFit ? " card__noun--fit" : ""}`}
        >
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
