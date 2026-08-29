"use client";

import { useState } from "react";
import CodeBlock from "@/components/CodeBlock";
import PassChart from "@/components/passco/PassChart";
import type { EconsPassIndexedQuestion } from "@/lib/econs/passcoBank";

export interface EconsPassAnswerRecord {
  correct: boolean;
  selectedIndex: number;
}

const letters = ["A", "B", "C", "D"];

export default function EconsPassQuestionCard({
  question,
  savedAnswer,
  onAnswered,
}: {
  question: EconsPassIndexedQuestion;
  savedAnswer: EconsPassAnswerRecord | null;
  onAnswered: (record: EconsPassAnswerRecord) => void;
}) {
  const [picked, setPicked] = useState<number | null>(savedAnswer?.selectedIndex ?? null);
  const [submitted, setSubmitted] = useState(savedAnswer !== null);
  const [isCorrect, setIsCorrect] = useState(savedAnswer?.correct ?? false);

  function choose(i: number) {
    if (submitted) return;
    const correct = i === question.correctIndex;
    setPicked(i);
    setIsCorrect(correct);
    setSubmitted(true);
    onAnswered({ correct, selectedIndex: i });
  }

  return (
    <div className="space-y-4 rounded-2xl border border-card-border bg-card p-5 sm:p-6">
      {question.source && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full border border-accent text-accent bg-accent/10 text-[11px] font-semibold uppercase tracking-wide">
            Past Question
          </span>
          <span className="text-xs text-secondary font-mono">
            {question.source.pdf}
            {question.source.page ? ` — p.${question.source.page}` : ""}
            {question.source.originalNumber ? ` — Q${question.source.originalNumber}` : ""}
          </span>
        </div>
      )}

      <p className="text-base font-medium text-heading whitespace-pre-line">{question.question}</p>

      {question.code && <CodeBlock code={question.code} />}

      {question.table && (
        <div className="space-y-1">
          {question.table.caption && <p className="text-xs font-semibold text-secondary">{question.table.caption}</p>}
          <div className="overflow-x-auto rounded-xl border border-card-border">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  {question.table.columns.map((col, i) => (
                    <th key={i} className="text-left p-2 text-heading font-semibold border-b border-card-border bg-muted">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {question.table.rows.map((row, ri) => (
                  <tr key={ri} className="border-b border-card-border last:border-0">
                    {row.map((cell, ci) => (
                      <td key={ci} className="p-2 text-body font-mono whitespace-nowrap">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {question.chartId && <PassChart id={question.chartId} />}

      <div className="space-y-2">
        {question.options.map((opt, i) => {
          const isPicked = picked === i;
          const isCorrectOpt = i === question.correctIndex;
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
              onClick={() => choose(i)}
              disabled={submitted}
              className={`w-full text-left px-4 py-2.5 rounded-xl border-2 text-sm text-body transition-colors flex gap-2.5 ${style} ${
                submitted ? "cursor-default" : "cursor-pointer"
              }`}
            >
              <span className="shrink-0 font-mono font-semibold text-heading">{letters[i]}.</span>
              <span className="whitespace-pre-wrap">{opt}</span>
            </button>
          );
        })}
      </div>

      {submitted && (
        <div className="space-y-3">
          <p className={`text-sm font-semibold ${isCorrect ? "text-success" : "text-error"}`}>
            {isCorrect ? "Correct!" : "Not quite."}
            {!isCorrect && (
              <span className="font-normal text-body"> Correct answer: {letters[question.correctIndex]}.</span>
            )}
          </p>
          <div className="rounded-xl bg-muted p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary mb-1">Explanation</p>
            <p className="text-sm text-body">{question.explanation}</p>
          </div>
          {question.sourceIssue && (
            <div className="rounded-xl border border-accent-warm/40 bg-accent-warm-bg p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent-warm mb-1">
                ⚠ Note on this question&rsquo;s source
              </p>
              <p className="text-sm text-body">{question.sourceIssue}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
