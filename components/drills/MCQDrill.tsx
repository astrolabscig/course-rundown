"use client";

import { useRef, useState } from "react";
import { mcqBank } from "@/lib/mcqBank";
import { trackInteract } from "@/lib/track";

export default function MCQDrill() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const interactedRef = useRef(false);

  const total = mcqBank.length;
  const question = mcqBank[index];

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function choose(optionIndex: number) {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === question.correctIndex) setScore((s) => s + 1);
    markInteracted();
  }

  function next() {
    if (index + 1 >= total) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }

  function retry() {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="rounded-xl bg-muted p-6 text-center space-y-3">
        <p className="text-lg font-semibold text-heading">
          You scored {score} / {total}
        </p>
        <button
          type="button"
          onClick={retry}
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-secondary">
        <span>
          Question {index + 1} of {total}
        </span>
        <span>Score: {score}</span>
      </div>

      <p className="text-body font-medium whitespace-pre-wrap">{question.question}</p>

      <div className="space-y-2">
        {question.options.map((option, i) => {
          const isCorrect = i === question.correctIndex;
          const isChosen = i === selected;
          let style = "bg-white text-body border-card-border hover:border-accent";
          if (selected !== null) {
            if (isCorrect) style = "bg-success text-white border-success";
            else if (isChosen) style = "bg-error text-white border-error";
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => choose(i)}
              disabled={selected !== null}
              className={`w-full text-left px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${style} disabled:cursor-default`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="rounded-xl bg-muted p-4 space-y-3">
          <p className="text-sm text-body">
            <span
              className={
                selected === question.correctIndex ? "text-success font-semibold" : "text-error font-semibold"
              }
            >
              {selected === question.correctIndex ? "Correct. " : "Not quite. "}
            </span>
            {question.explanation}
          </p>
          <button
            type="button"
            onClick={next}
            className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            {index + 1 >= total ? "See results" : "Next question"}
          </button>
        </div>
      )}
    </div>
  );
}
