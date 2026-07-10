"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export default function ProbabilityRulesCalculator() {
  const [pA, setPA] = useState(0.4);
  const [pB, setPB] = useState(0.5);
  const [pAB, setPAB] = useState(0.2);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const results = useMemo(() => {
    const union = pA + pB - pAB;
    const aNotB = pA - pAB;
    const notAB = pB - pAB;
    const neither = 1 - union;
    const pBGivenA = pA > 0 ? pAB / pA : null;
    const pAGivenB = pB > 0 ? pAB / pB : null;
    const mutuallyExclusive = Math.abs(pAB) < 1e-9;
    const independent = Math.abs(pAB - pA * pB) < 1e-9;
    return { union, aNotB, notAB, neither, pBGivenA, pAGivenB, mutuallyExclusive, independent };
  }, [pA, pB, pAB]);

  const invalid = pAB > Math.min(pA, pB) + 1e-9;

  return (
    <div className="space-y-4">
      <ExplainerBox title="Every set-operation rule, from just three numbers">
        <p>
          Give the calculator P(A), P(B), and P(A ∩ B) — the three numbers that fully describe how
          two events overlap — and every other probability rule (union, complements, conditionals,
          even whether the events are mutually exclusive or independent) falls straight out of
          them.
        </p>
      </ExplainerBox>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-xs text-secondary space-y-1">
          <span className="block font-semibold">P(A)</span>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={pA}
            onChange={(e) => {
              setPA(clamp01(Number(e.target.value) || 0));
              markInteracted();
            }}
            className="w-full rounded-full border border-card-border px-3 py-1.5 font-mono"
          />
        </label>
        <label className="text-xs text-secondary space-y-1">
          <span className="block font-semibold">P(B)</span>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={pB}
            onChange={(e) => {
              setPB(clamp01(Number(e.target.value) || 0));
              markInteracted();
            }}
            className="w-full rounded-full border border-card-border px-3 py-1.5 font-mono"
          />
        </label>
        <label className="text-xs text-secondary space-y-1">
          <span className="block font-semibold">P(A ∩ B)</span>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={pAB}
            onChange={(e) => {
              setPAB(clamp01(Number(e.target.value) || 0));
              markInteracted();
            }}
            className="w-full rounded-full border border-card-border px-3 py-1.5 font-mono"
          />
        </label>
      </div>

      {invalid && (
        <p className="text-xs text-accent-warm font-medium">
          P(A ∩ B) can&apos;t be larger than P(A) or P(B) — the overlap can&apos;t be bigger than
          either group it belongs to.
        </p>
      )}

      <div className="grid gap-2 sm:grid-cols-2 font-mono text-sm">
        <div className="rounded-xl bg-muted p-3">
          <p className="text-xs text-secondary font-sans mb-1">P(A ∪ B) = P(A)+P(B)−P(A∩B)</p>
          <p className="font-bold text-heading">{results.union.toFixed(3)}</p>
        </div>
        <div className="rounded-xl bg-muted p-3">
          <p className="text-xs text-secondary font-sans mb-1">P(A′ ∩ B′) = 1 − P(A∪B)</p>
          <p className="font-bold text-heading">{results.neither.toFixed(3)}</p>
        </div>
        <div className="rounded-xl bg-muted p-3">
          <p className="text-xs text-secondary font-sans mb-1">P(A ∩ B′) = P(A)−P(A∩B)</p>
          <p className="font-bold text-heading">{results.aNotB.toFixed(3)}</p>
        </div>
        <div className="rounded-xl bg-muted p-3">
          <p className="text-xs text-secondary font-sans mb-1">P(A′ ∩ B) = P(B)−P(A∩B)</p>
          <p className="font-bold text-heading">{results.notAB.toFixed(3)}</p>
        </div>
        <div className="rounded-xl bg-muted p-3">
          <p className="text-xs text-secondary font-sans mb-1">P(B | A) = P(A∩B)/P(A)</p>
          <p className="font-bold text-heading">{results.pBGivenA === null ? "undefined" : results.pBGivenA.toFixed(3)}</p>
        </div>
        <div className="rounded-xl bg-muted p-3">
          <p className="text-xs text-secondary font-sans mb-1">P(A | B) = P(A∩B)/P(B)</p>
          <p className="font-bold text-heading">{results.pAGivenB === null ? "undefined" : results.pAGivenB.toFixed(3)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <span
          className={`px-3 py-1 rounded-full font-medium ${results.mutuallyExclusive ? "bg-success/15 text-success" : "bg-muted text-secondary"}`}
        >
          {results.mutuallyExclusive ? "✓ Mutually exclusive" : "✗ Not mutually exclusive"} (P(A∩B) {results.mutuallyExclusive ? "=" : "≠"} 0)
        </span>
        <span
          className={`px-3 py-1 rounded-full font-medium ${results.independent ? "bg-success/15 text-success" : "bg-muted text-secondary"}`}
        >
          {results.independent ? "✓ Independent" : "✗ Not independent"} (P(A∩B) {results.independent ? "=" : "≠"} P(A)·P(B) = {(pA * pB).toFixed(3)})
        </span>
      </div>
    </div>
  );
}
