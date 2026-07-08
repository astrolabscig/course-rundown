"use client";

import { useRef, useState } from "react";
import { trackInteract } from "@/lib/track";

export interface ProofStep {
  statement: string;
  reason: string;
}

export default function ProofWalkthrough({
  title,
  goal,
  given,
  steps,
  conclusion,
}: {
  title: string;
  goal: string;
  given?: string;
  steps: ProofStep[];
  conclusion: string;
}) {
  const [revealed, setRevealed] = useState(0);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function revealNext() {
    setRevealed((r) => Math.min(steps.length, r + 1));
    markInteracted();
  }

  function reset() {
    setRevealed(0);
    markInteracted();
  }

  const done = revealed >= steps.length;

  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-muted p-4 space-y-1">
        <p className="text-sm font-semibold text-heading">{title}</p>
        {given && (
          <p className="text-sm text-body whitespace-pre-line">
            <span className="font-semibold text-secondary">Given: </span>
            {given}
          </p>
        )}
        <p className="text-sm text-body">
          <span className="font-semibold text-secondary">Goal: </span>
          {goal}
        </p>
      </div>

      <div className="space-y-2">
        {steps.slice(0, revealed).map((step, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 rounded-xl border border-card-border bg-card p-3"
          >
            <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white text-xs font-bold">
              {i + 1}
            </span>
            <span className="flex-1 text-sm text-body font-mono">{step.statement}</span>
            <span className="shrink-0 text-xs text-secondary sm:text-right sm:w-48">{step.reason}</span>
          </div>
        ))}
      </div>

      {done ? (
        <div className="rounded-xl bg-muted border border-success p-4 space-y-2">
          <p className="text-sm text-body">{conclusion}</p>
          <p className="text-sm font-semibold text-success">∎ Proof complete</p>
          <button
            type="button"
            onClick={reset}
            className="text-xs font-medium text-accent hover:underline"
          >
            Restart
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={revealNext}
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          {revealed === 0 ? "Show first step" : "Show next step"}
        </button>
      )}
    </div>
  );
}
