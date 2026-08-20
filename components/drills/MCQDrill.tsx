"use client";

import { useRef, useState } from "react";
import type { MCQ } from "@/lib/mcqBank";
import { trackInteract } from "@/lib/track";

interface AnswerRecord {
  correct: boolean;
  selectedIndex: number;
}

export default function MCQDrill({ questions }: { questions: MCQ[] }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(AnswerRecord | null)[]>(() => new Array(questions.length).fill(null));
  const [finished, setFinished] = useState(false);
  const interactedRef = useRef(false);

  const total = questions.length;
  const question = questions[index];
  const currentAnswer = answers[index];

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function choose(optionIndex: number) {
    if (currentAnswer !== null) return;
    const correct = optionIndex === question.correctIndex;
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = { correct, selectedIndex: optionIndex };
      return next;
    });
    markInteracted();
  }

  function goTo(i: number) {
    setIndex(Math.max(0, Math.min(total - 1, i)));
    markInteracted();
  }

  function finish() {
    setFinished(true);
    markInteracted();
  }

  function retry() {
    setIndex(0);
    setAnswers(new Array(total).fill(null));
    setFinished(false);
  }

  const answeredCount = answers.filter((a) => a !== null).length;
  const score = answers.filter((a) => a?.correct).length;

  if (finished) {
    return (
      <div className="rounded-xl bg-muted p-6 text-center space-y-3">
        <p className="text-lg font-semibold text-heading">
          You scored {score} / {answeredCount}
        </p>
        {answeredCount < total && (
          <p className="text-sm text-secondary">
            {total - answeredCount} question{total - answeredCount === 1 ? "" : "s"} left unanswered out of {total}.
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setFinished(false)}
            className="px-4 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors"
          >
            Review answers
          </button>
          <button
            type="button"
            onClick={retry}
            className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-secondary">
        <span>
          Question {index + 1} of {total}
        </span>
        <span>
          Score: {score} ({answeredCount} answered)
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto rounded-xl border border-card-border bg-card p-3">
        {questions.map((_, i) => {
          const rec = answers[i];
          const isCurrent = i === index;
          let style = "border-card-border text-secondary hover:border-accent";
          if (isCurrent) style = "border-accent bg-accent text-white font-semibold";
          else if (rec) style = rec.correct ? "border-success bg-success/10 text-success" : "border-error bg-error/10 text-error";
          return (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              title={`Question ${i + 1}${rec ? (rec.correct ? " — answered correctly" : " — answered incorrectly") : " — unanswered"}`}
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-[11px] font-mono transition-colors ${style}`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <p className="text-body font-medium whitespace-pre-wrap">{question.question}</p>

      <div className="space-y-2">
        {question.options.map((option, i) => {
          const isCorrect = i === question.correctIndex;
          const isChosen = currentAnswer?.selectedIndex === i;
          let style = "bg-card text-body border-card-border hover:border-accent";
          if (currentAnswer !== null) {
            if (isCorrect) style = "bg-success text-white border-success";
            else if (isChosen) style = "bg-error text-white border-error";
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => choose(i)}
              disabled={currentAnswer !== null}
              className={`w-full text-left px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${style} disabled:cursor-default`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {currentAnswer !== null && (
        <div className="rounded-xl bg-muted p-4">
          <p className="text-sm text-body">
            <span
              className={currentAnswer.correct ? "text-success font-semibold" : "text-error font-semibold"}
            >
              {currentAnswer.correct ? "Correct. " : "Not quite. "}
            </span>
            {question.explanation}
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="px-4 py-2 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ◀ Previous
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={index === total - 1}
          className="px-4 py-2 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next ▶
        </button>
        <button
          type="button"
          onClick={finish}
          className="ml-auto px-6 py-2 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors"
        >
          Finish quiz
        </button>
      </div>
    </div>
  );
}
