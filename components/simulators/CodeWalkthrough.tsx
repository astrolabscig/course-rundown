"use client";

import { useRef, useState } from "react";
import OutputPanel from "../OutputPanel";
import { trackInteract } from "@/lib/track";

export interface WalkthroughStep {
  highlightLine: number;
  narration: string;
  state: { label: string; value: string }[];
  output?: string;
}

export default function CodeWalkthrough({
  lines,
  steps,
}: {
  lines: string[];
  steps: WalkthroughStep[];
}) {
  const [index, setIndex] = useState(0);
  const interactedRef = useRef(false);
  const step = steps[index];

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function go(delta: number) {
    setIndex((i) => Math.min(steps.length - 1, Math.max(0, i + delta)));
    markInteracted();
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-card-border bg-code-bg p-4 font-mono text-sm overflow-x-auto">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`px-2 py-0.5 rounded ${
              i === step.highlightLine ? "bg-accent/15 border-l-4 border-accent" : "border-l-4 border-transparent"
            }`}
          >
            <span className="text-secondary mr-3 select-none">{i + 1}</span>
            <span className="text-body whitespace-pre">{line || " "}</span>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-muted p-4">
        <p className="text-sm text-body">{step.narration}</p>
      </div>

      {step.state.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {step.state.map((s, i) => (
            <div key={i} className="rounded-lg border-2 border-accent px-3 py-2 text-sm font-mono bg-white">
              <div className="font-semibold text-heading">{s.label}</div>
              <div className="text-body text-xs">{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {step.output && <OutputPanel output={step.output} />}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={index === 0}
          className="px-4 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ◀ Back
        </button>
        <span className="text-sm text-secondary">
          Step {index + 1} of {steps.length}
        </span>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={index === steps.length - 1}
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
