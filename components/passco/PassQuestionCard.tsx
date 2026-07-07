"use client";

import { useState } from "react";
import CodeBlock from "@/components/CodeBlock";

// Generic Q&A shape shared by every subject's Passco room (lib/passcoBank.ts,
// lib/econs/passcoBank.ts, ...). Each bank's own section union type is a
// string, so it structurally satisfies this.
export interface PassQuestion {
  id: string;
  section: string;
  question: string;
  code?: string;
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
  const [revealed, setRevealed] = useState(false);

  function reveal() {
    if (!revealed) {
      setRevealed(true);
      onReveal();
    }
  }

  return (
    <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 sm:p-6 space-y-3">
      <p className="text-sm text-secondary font-medium">Question {index + 1}</p>
      <p className="text-body font-medium whitespace-pre-wrap">{item.question}</p>

      {item.code && <CodeBlock code={item.code} />}

      {item.options && (
        <ul className="space-y-1">
          {item.options.map((option, i) => (
            <li key={i} className="text-sm text-body flex gap-2">
              <span className="text-secondary shrink-0">{String.fromCharCode(65 + i)}.</span>
              <span className="whitespace-pre-wrap">{option}</span>
            </li>
          ))}
        </ul>
      )}

      {revealed ? (
        <div className="rounded-xl bg-muted p-4 space-y-2">
          <p className="text-sm text-body whitespace-pre-wrap">
            <span className="text-success font-semibold">Answer: </span>
            {item.answer}
          </p>
          <p className="text-sm text-body">{item.explanation}</p>
        </div>
      ) : (
        <button
          type="button"
          onClick={reveal}
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          Show answer
        </button>
      )}
    </div>
  );
}
