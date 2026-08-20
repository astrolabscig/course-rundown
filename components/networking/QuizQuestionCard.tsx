"use client";

import { useMemo, useState } from "react";
import CodeBlock from "../CodeBlock";
import type { QuizQuestion } from "@/lib/networking/quizBank";

export interface AnswerRecord {
  correct: boolean;
  selectedIndex?: number;
  inputValue?: string;
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ").replace(/,/g, "");
}

// Deterministic per-question shuffle so option order stays stable across
// re-renders and re-visits (navigating away and back must not scramble a
// question the user already answered), while avoiding the correct answer
// always landing in the same position across the bank. FNV-1a gives a
// well-distributed seed from the id string; mulberry32 is a small, solid
// PRNG that turns that seed into a good Fisher-Yates shuffle.
function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle(seedStr: string, length: number): number[] {
  const rand = mulberry32(fnv1a(seedStr));
  const order = Array.from({ length }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

const difficultyStyle: Record<string, string> = {
  hard: "bg-error/10 text-error border-error",
  medium: "bg-accent-warm/10 text-accent-warm border-accent-warm",
  easy: "bg-success/10 text-success border-success",
};

export default function QuizQuestionCard({
  question,
  savedAnswer,
  onAnswered,
}: {
  question: QuizQuestion;
  savedAnswer: AnswerRecord | null;
  onAnswered: (record: AnswerRecord) => void;
}) {
  const [selected, setSelected] = useState<number | null>(savedAnswer?.selectedIndex ?? null);
  const [inputValue, setInputValue] = useState(savedAnswer?.inputValue ?? "");
  const [submitted, setSubmitted] = useState(savedAnswer !== null);
  const [isCorrect, setIsCorrect] = useState(savedAnswer?.correct ?? false);

  const shuffleOrder = useMemo(() => {
    if (question.type !== "mcq" || !question.options) return null;
    return seededShuffle(question.id, question.options.length);
  }, [question.id, question.type, question.options]);

  const displayOptions = shuffleOrder ? shuffleOrder.map((i) => question.options![i]) : question.options;
  const correctDisplayIndex = shuffleOrder ? shuffleOrder.indexOf(question.correctIndex!) : question.correctIndex;

  function chooseOption(i: number) {
    if (submitted) return;
    setSelected(i);
    const correct = i === correctDisplayIndex;
    setIsCorrect(correct);
    setSubmitted(true);
    onAnswered({ correct, selectedIndex: i });
  }

  function submitFillIn() {
    if (submitted || inputValue.trim() === "") return;
    const answer = normalize(inputValue);
    const accepted = (question.acceptableAnswers ?? []).map(normalize);
    const correct = accepted.includes(answer);
    setIsCorrect(correct);
    setSubmitted(true);
    onAnswered({ correct, inputValue });
  }

  return (
    <div className="space-y-4 rounded-2xl border border-card-border bg-card p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-semibold uppercase tracking-wide ${difficultyStyle[question.difficulty]}`}>
          {question.difficulty}
        </span>
        <span className="px-2.5 py-0.5 rounded-full border border-card-border text-[11px] font-semibold uppercase tracking-wide text-secondary">
          {question.type === "mcq" ? "Multiple choice" : "Fill in the blank"}
        </span>
      </div>

      <p className="text-base font-medium text-heading">{question.question}</p>
      {question.code && <CodeBlock code={question.code} language="text" />}

      {question.type === "mcq" ? (
        <div className="space-y-2">
          {displayOptions!.map((opt, i) => {
            const isSelected = selected === i;
            const isCorrectOpt = i === correctDisplayIndex;
            let style = "border-card-border hover:border-accent";
            if (submitted) {
              if (isCorrectOpt) style = "border-success bg-success/10";
              else if (isSelected) style = "border-error bg-error/10";
              else style = "border-card-border opacity-60";
            }
            return (
              <button
                key={i}
                type="button"
                onClick={() => chooseOption(i)}
                disabled={submitted}
                className={`w-full text-left px-4 py-2.5 rounded-xl border-2 text-sm text-body transition-colors ${style} ${
                  submitted ? "cursor-default" : "cursor-pointer"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitFillIn();
            }}
            disabled={submitted}
            placeholder="Type your answer"
            className={`flex-1 min-w-[180px] rounded-full border-2 px-4 py-2 text-sm font-mono ${
              submitted ? (isCorrect ? "border-success bg-success/10" : "border-error bg-error/10") : "border-card-border"
            }`}
          />
          {!submitted && (
            <button
              type="button"
              onClick={submitFillIn}
              className="px-4 py-2 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
            >
              Submit
            </button>
          )}
        </div>
      )}

      {submitted && (
        <div className="space-y-3">
          <p className={`text-sm font-semibold ${isCorrect ? "text-success" : "text-error"}`}>
            {isCorrect ? "Correct!" : "Not quite."}
            {question.type === "fill-in" && !isCorrect && (
              <span className="font-normal text-body"> The accepted answer was: {question.acceptableAnswers?.[0]}.</span>
            )}
          </p>

          {question.steps && question.steps.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Step-by-step solution</p>
              {question.steps.map((step, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 rounded-xl border border-card-border bg-muted p-3">
                  <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm text-body font-mono">{step.statement}</span>
                  <span className="shrink-0 text-xs text-secondary sm:text-right sm:w-48">{step.reason}</span>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-xl bg-muted p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary mb-1">Explanation</p>
            <p className="text-sm text-body">{question.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
