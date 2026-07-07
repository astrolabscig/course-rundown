"use client";

import { useState } from "react";
import CodeBlock from "@/components/CodeBlock";

// Generic Q&A shape shared by every subject's Passco room (lib/passcoBank.ts,
// lib/econs/passcoBank.ts, ...). Each bank's own section union type is a
// string, so it structurally satisfies this.
export interface PassTable {
  caption?: string;
  columns: string[];
  rows: (string | number)[][];
}

export interface PassQuestion {
  id: string;
  section: string;
  question: string;
  code?: string;
  table?: PassTable;
  options?: string[];
  answer: string;
  explanation: string;
}

export default function PassQuestionCard({
  item,
  index,
  onReveal,
}: {
  item: PassQuestion;
  index: number;
  onReveal: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  function selectOption(i: number) {
    if (selected !== null) return;
    setSelected(i);
    onReveal();
  }

  function reveal() {
    if (!revealed) {
      setRevealed(true);
      onReveal();
    }
  }

  const answered = item.options ? selected !== null : revealed;
  const correctOptionIndex = item.options ? item.options.findIndex((o) => o === item.answer) : -1;
  const wasCorrect = selected !== null && selected === correctOptionIndex;

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
              <span className="text-success font-semibold">Answer: </span>
              {item.answer}
            </p>
          )}
          <p className="text-sm text-body">{item.explanation}</p>
        </div>
      ) : !item.options ? (
        <button
          type="button"
          onClick={reveal}
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          Show answer
        </button>
      ) : null}
    </div>
  );
}
