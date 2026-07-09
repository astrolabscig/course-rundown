"use client";

import { useState } from "react";
import CodeBlock from "@/components/CodeBlock";
import PassChart from "./PassChart";

// Generic Q&A shape shared by every subject's Passco room (lib/passcoBank.ts,
// lib/econs/passcoBank.ts, ...). Each bank's own section union type is a
// string, so it structurally satisfies this.
export interface PassTable {
  caption?: string;
  columns: string[];
  rows: (string | number)[][];
}

export interface PassStep {
  statement: string;
  reason: string;
}

export interface PassQuestion {
  id: string;
  section: string;
  question: string;
  code?: string;
  table?: PassTable;
  chartId?: string;
  options?: string[];
  answer: string;
  acceptableAnswers?: string[];
  explanation: string;
  steps?: PassStep[];
  analogy?: string;
}

function normalizeAnswer(s: string): string {
  return s.trim().toLowerCase().replace(/,/g, "").replace(/\s+/g, " ");
}

export default function PassQuestionCard({
  item,
  index,
  onAnswered,
}: {
  item: PassQuestion;
  index: number;
  onAnswered: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [fillInCorrect, setFillInCorrect] = useState(false);

  function selectOption(i: number) {
    if (selected !== null) return;
    setSelected(i);
    const correctIndex = item.options!.findIndex((o) => o === item.answer);
    onAnswered(i === correctIndex);
  }

  function submitFillIn() {
    if (submitted || inputValue.trim() === "") return;
    const accepted = (item.acceptableAnswers ?? [item.answer]).map(normalizeAnswer);
    const correct = accepted.includes(normalizeAnswer(inputValue));
    setFillInCorrect(correct);
    setSubmitted(true);
    onAnswered(correct);
  }

  const answered = item.options ? selected !== null : submitted;
  const correctOptionIndex = item.options ? item.options.findIndex((o) => o === item.answer) : -1;
  const wasCorrect = item.options ? selected !== null && selected === correctOptionIndex : fillInCorrect;

  return (
    <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6 space-y-3">
      <p className="text-sm text-secondary font-medium">Question {index + 1}</p>
      <p className="text-body font-medium whitespace-pre-wrap">{item.question}</p>

      {item.code && <CodeBlock code={item.code} />}

      {item.table && (
        <div className="space-y-1">
          {item.table.caption && <p className="text-xs font-semibold text-secondary">{item.table.caption}</p>}
          <div className="overflow-x-auto rounded-xl border border-card-border">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  {item.table.columns.map((col, i) => (
                    <th key={i} className="text-left p-2 text-heading font-semibold border-b border-card-border bg-muted">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {item.table.rows.map((row, ri) => (
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

      {item.chartId && <PassChart id={item.chartId} />}

      {!item.options && (
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
              submitted ? (fillInCorrect ? "border-success bg-success/10" : "border-error bg-error/10") : "border-card-border"
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

      {item.options && (
        <div className="space-y-2">
          {item.options.map((option, i) => {
            const isCorrect = i === correctOptionIndex;
            const isChosen = i === selected;
            let style = "bg-white text-body border-card-border hover:border-accent";
            if (answered) {
              if (isCorrect) style = "bg-success text-white border-success";
              else if (isChosen) style = "bg-error text-white border-error";
              else style = "bg-white text-body border-card-border opacity-60";
            }
            return (
              <button
                key={i}
                type="button"
                onClick={() => selectOption(i)}
                disabled={answered}
                className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors break-words disabled:cursor-default ${style}`}
              >
                <span className="text-secondary mr-1">{String.fromCharCode(65 + i)}.</span>
                <span className="whitespace-pre-wrap">{option}</span>
              </button>
            );
          })}
        </div>
      )}

      {answered ? (
        <div className="rounded-xl bg-muted p-4 space-y-2">
          {item.options ? (
            <p className="text-sm text-body">
              <span className={wasCorrect ? "text-success font-semibold" : "text-error font-semibold"}>
                {correctOptionIndex === -1
                  ? "Answer: "
                  : wasCorrect
                    ? "Correct. "
                    : "Not quite. "}
              </span>
              {correctOptionIndex === -1 && item.answer}
            </p>
          ) : (
            <p className="text-sm text-body whitespace-pre-wrap">
              <span className={fillInCorrect ? "text-success font-semibold" : "text-error font-semibold"}>
                {fillInCorrect ? "Correct. " : "Not quite. "}
              </span>
              <span className="text-success font-semibold">Answer: </span>
              {item.answer}
            </p>
          )}
          {item.steps && item.steps.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Step-by-step solution</p>
              {item.steps.map((step, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 rounded-xl border border-card-border bg-card p-3">
                  <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm text-body font-mono whitespace-pre-wrap">{step.statement}</span>
                  <span className="shrink-0 text-xs text-secondary sm:text-right sm:w-48">{step.reason}</span>
                </div>
              ))}
            </div>
          )}
          <p className="text-sm text-body">{item.explanation}</p>
          {item.analogy && (
            <div className="rounded-xl border border-accent/30 bg-[#EAF2FF] p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-1">
                Spotting this pattern next time
              </p>
              <p className="text-sm text-body">{item.analogy}</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
