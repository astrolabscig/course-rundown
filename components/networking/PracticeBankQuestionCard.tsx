"use client";

import { useState } from "react";
import CodeBlock from "../CodeBlock";
import type { PracticeQuestion } from "@/lib/networking/practiceBank";

export interface PracticeAnswerRecord {
  correct: boolean;
  selectedIndices: number[];
}

const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];

const tierStyle: Record<string, string> = {
  A: "bg-success/10 text-success border-success",
  B: "bg-accent-warm/10 text-accent-warm border-accent-warm",
  C: "bg-error/10 text-error border-error",
  Mixed: "bg-accent/10 text-accent border-accent",
};

function sameSet(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((v, i) => v === sb[i]);
}

export default function PracticeBankQuestionCard({
  question,
  savedAnswer,
  onAnswered,
}: {
  question: PracticeQuestion;
  savedAnswer: PracticeAnswerRecord | null;
  onAnswered: (record: PracticeAnswerRecord) => void;
}) {
  const isMultiSelect = question.correctIndices.length > 1;
  const [picked, setPicked] = useState<Set<number>>(new Set(savedAnswer?.selectedIndices ?? []));
  const [submitted, setSubmitted] = useState(savedAnswer !== null);
  const [isCorrect, setIsCorrect] = useState(savedAnswer?.correct ?? false);

  function toggle(i: number) {
    if (submitted) return;
    if (isMultiSelect) {
      setPicked((prev) => {
        const next = new Set(prev);
        if (next.has(i)) next.delete(i);
        else next.add(i);
        return next;
      });
    } else {
      submitSingle(i);
    }
  }

  function submitSingle(i: number) {
    const selected = [i];
    const correct = sameSet(selected, question.correctIndices);
    setPicked(new Set(selected));
    setIsCorrect(correct);
    setSubmitted(true);
    onAnswered({ correct, selectedIndices: selected });
  }

  function submitMulti() {
    if (submitted || picked.size === 0) return;
    const selected = Array.from(picked);
    const correct = sameSet(selected, question.correctIndices);
    setIsCorrect(correct);
    setSubmitted(true);
    onAnswered({ correct, selectedIndices: selected });
  }

  return (
    <div className="space-y-4 rounded-2xl border border-card-border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-semibold uppercase tracking-wide ${tierStyle[question.tier]}`}>
          Tier {question.tier}
        </span>
        <span className="px-2.5 py-0.5 rounded-full border border-card-border text-[11px] font-semibold uppercase tracking-wide text-secondary">
          {isMultiSelect ? "Select all that apply" : "Single answer"}
        </span>
        <span className="text-xs text-secondary font-mono">{question.label}</span>
      </div>

      <p className="text-base font-medium text-heading whitespace-pre-line">{question.question}</p>
      {question.code && <CodeBlock code={question.code} language="text" />}

      <div className="space-y-2">
        {question.options.map((opt, i) => {
          const isPicked = picked.has(i);
          const isCorrectOpt = question.correctIndices.includes(i);
          let style = "border-card-border hover:border-accent";
          if (submitted) {
            if (isCorrectOpt) style = "border-success bg-success/10";
            else if (isPicked) style = "border-error bg-error/10";
            else style = "border-card-border opacity-60";
          } else if (isPicked) {
            style = "border-accent bg-accent/10";
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              disabled={submitted}
              className={`w-full text-left px-4 py-2.5 rounded-xl border-2 text-sm text-body transition-colors flex gap-2.5 ${style} ${
                submitted ? "cursor-default" : "cursor-pointer"
              }`}
            >
              <span className="shrink-0 font-mono font-semibold text-heading">{letters[i]}.</span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {isMultiSelect && !submitted && (
        <button
          type="button"
          onClick={submitMulti}
          disabled={picked.size === 0}
          className="px-6 py-2 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit selection
        </button>
      )}

      {submitted && (
        <div className="space-y-3">
          <p className={`text-sm font-semibold ${isCorrect ? "text-success" : "text-error"}`}>
            {isCorrect ? "Correct!" : "Not quite."}
            {!isCorrect && (
              <span className="font-normal text-body">
                {" "}
                Correct answer{question.correctIndices.length > 1 ? "s" : ""}:{" "}
                {question.correctIndices.map((i) => letters[i]).join(", ")}.
              </span>
            )}
          </p>
          <div className="rounded-xl bg-muted p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary mb-1">Explanation</p>
            <p className="text-sm text-body">{question.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
