"use client";

import { useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

interface InductionCase {
  id: string;
  label: string;
  statement: string;
  basis: string;
  hypothesis: string;
  inductiveStep: string[];
  conclusion: string;
}

const cases: InductionCase[] = [
  {
    id: "sum-n",
    label: "Rosen 5.1, Example 1 — sum of the first n positive integers",
    statement: "P(n): 1 + 2 + 3 + ... + n = n(n+1)/2, for every integer n ≥ 1.",
    basis: "P(1): the left side is just 1. The right side is 1(1+1)/2 = 2/2 = 1. They match, so P(1) is true.",
    hypothesis: "Assume P(k) is true for some arbitrary k ≥ 1, i.e. assume 1+2+...+k = k(k+1)/2.",
    inductiveStep: [
      "We must show P(k+1): 1+2+...+k+(k+1) = (k+1)(k+2)/2.",
      "Start from the left side: [1+2+...+k] + (k+1)",
      "By the inductive hypothesis, replace the bracketed part: k(k+1)/2 + (k+1)",
      "Factor out (k+1): (k+1)[k/2 + 1] = (k+1)(k+2)/2",
      "This is exactly the right-hand side of P(k+1) — done.",
    ],
    conclusion: "Since P(1) is true and P(k) ⟹ P(k+1) for every k, by the principle of mathematical induction P(n) is true for all n ≥ 1. ∎",
  },
  {
    id: "sum-odd",
    label: "Rosen 5.1, Exercise 3 (scaffold) — sum of the first n odd integers",
    statement: "P(n): 1 + 3 + 5 + ... + (2n-1) = n², for every integer n ≥ 1.",
    basis: "P(1): the left side is just 1 (the first odd number, 2(1)-1=1). The right side is 1² = 1. They match, so P(1) is true.",
    hypothesis: "Assume P(k) is true for some arbitrary k ≥ 1, i.e. assume 1+3+...+(2k-1) = k².",
    inductiveStep: [
      "We must show P(k+1): 1+3+...+(2k-1)+(2k+1) = (k+1)².",
      "Start from the left side: [1+3+...+(2k-1)] + (2k+1)",
      "By the inductive hypothesis, replace the bracketed part: k² + (2k+1)",
      "Recognize the expansion: k² + 2k + 1 = (k+1)²",
      "This is exactly the right-hand side of P(k+1) — done.",
    ],
    conclusion: "Since P(1) is true and P(k) ⟹ P(k+1) for every k, by induction P(n) is true for all n ≥ 1 — the sum of the first n odd numbers is always a perfect square. ∎",
  },
];

const phases = ["statement", "basis", "hypothesis", "step", "conclusion"] as const;

export default function InductionProofBuilder() {
  const [caseId, setCaseId] = useState(cases[0].id);
  const [revealed, setRevealed] = useState(1);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const item = cases.find((c) => c.id === caseId)!;

  function selectCase(id: string) {
    setCaseId(id);
    setRevealed(1);
    markInteracted();
  }

  function next() {
    setRevealed((r) => Math.min(phases.length, r + 1));
    markInteracted();
  }

  return (
    <div className="space-y-4">
      <ExplainerBox title="Induction is a two-rung ladder that reaches infinity">
        <p>
          If you can (1) reach the first rung (the <strong>basis step</strong>), and (2) show that
          standing on ANY rung k always lets you reach rung k+1 (the <strong>inductive step</strong>),
          then you can climb every rung — all the way to infinity. That's the entire idea behind
          proof by mathematical induction.
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap gap-1.5">
        {cases.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => selectCase(c.id)}
            className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
              caseId === c.id ? "border-accent bg-muted text-accent" : "border-card-border text-body hover:border-accent"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-muted p-4">
        <p className="text-sm font-semibold text-heading">{item.statement}</p>
      </div>

      {revealed >= 2 && (
        <div className="rounded-xl border-2 border-accent bg-card p-4 space-y-1">
          <p className="text-xs font-bold uppercase tracking-wide text-accent">Basis step</p>
          <p className="text-sm text-body">{item.basis}</p>
        </div>
      )}

      {revealed >= 3 && (
        <div className="rounded-xl border-2 border-[#9B59B6] bg-card p-4 space-y-1">
          <p className="text-xs font-bold uppercase tracking-wide text-[#9B59B6]">Inductive hypothesis</p>
          <p className="text-sm text-body">{item.hypothesis}</p>
        </div>
      )}

      {revealed >= 4 && (
        <div className="rounded-xl border-2 border-[#FF7A59] bg-card p-4 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wide text-[#FF7A59]">Inductive step</p>
          {item.inductiveStep.map((line, i) => (
            <p key={i} className="text-sm text-body font-mono">
              {line}
            </p>
          ))}
        </div>
      )}

      {revealed >= 5 && (
        <div className="rounded-xl border border-success bg-muted p-4 space-y-1">
          <p className="text-xs font-bold uppercase tracking-wide text-success">Conclusion</p>
          <p className="text-sm text-body">{item.conclusion}</p>
          <p className="text-sm font-semibold text-success">∎ Proof complete</p>
        </div>
      )}

      {revealed < phases.length ? (
        <button
          type="button"
          onClick={next}
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          {revealed === 1 ? "Show basis step" : revealed === 2 ? "Show inductive hypothesis" : revealed === 3 ? "Show inductive step" : "Show conclusion"}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            setRevealed(1);
            markInteracted();
          }}
          className="text-xs font-medium text-accent hover:underline"
        >
          Restart
        </button>
      )}
    </div>
  );
}
