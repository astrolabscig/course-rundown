"use client";

import { useState } from "react";
import CodeBlock from "../CodeBlock";
import type { QuizQuestion } from "@/lib/discreteMaths/quizBank";

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ").replace(/,/g, "");
}

const difficultyStyle: Record<string, string> = {
  hard: "bg-error/10 text-error border-error",
  medium: "bg-[#FFF6E5] text-[#B8860B] border-[#E0A930]",
  easy: "bg-success/10 text-success border-success",
};

export default function QuizQuestionCard({
  question,
  onAnswered,
}: {
  question: QuizQuestion;
  onAnswered: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  function chooseOption(i: number) {
    if (submitted) return;
    setSelected(i);
    const correct = i === question.correctIndex;
    setIsCorrect(correct);
    setSubmitted(true);
    onAnswered(correct);
  }

  function submitFillIn() {
    if (submitted || inputValue.trim() === "") return;
    const answer = normalize(inputValue);
    const accepted = (question.acceptableAnswers ?? []).map(normalize);
    const correct = accepted.includes(answer);
    setIsCorrect(correct);
    setSubmitted(true);
    onAnswered(correct);
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
          {question.options!.map((opt, i) => {
            const isSelected = selected === i;
            const isCorrectOpt = i === question.correctIndex;
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
