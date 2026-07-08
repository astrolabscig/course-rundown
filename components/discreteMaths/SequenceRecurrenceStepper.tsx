"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

interface RecurrencePreset {
  id: string;
  label: string;
  a0: number;
  rule: (prev: number, n: number) => number;
  ruleText: string;
}

const recurrences: RecurrencePreset[] = [
  { id: "arith", label: "aₙ = aₙ₋₁ + 3, a₀ = 2", a0: 2, rule: (prev) => prev + 3, ruleText: "add 3 to the previous term" },
  { id: "geom", label: "aₙ = 2·aₙ₋₁, a₀ = 1", a0: 1, rule: (prev) => prev * 2, ruleText: "double the previous term" },
  { id: "fib", label: "Fibonacci-style: aₙ = aₙ₋₁ + aₙ₋₂, a₀=0, a₁=1", a0: 0, rule: () => 0, ruleText: "add the two previous terms" },
];

function buildFibonacci(count: number): number[] {
  const terms = [0, 1];
  for (let i = 2; i <= count; i++) terms.push(terms[i - 1] + terms[i - 2]);
  return terms.slice(0, count + 1);
}

const summationPresets = [
  { id: "k", label: "Σ k, k=1 to n", fn: (k: number) => k },
  { id: "k2", label: "Σ k², k=1 to n", fn: (k: number) => k * k },
];

export default function SequenceRecurrenceStepper() {
  const [recId, setRecId] = useState("arith");
  const [shown, setShown] = useState(1);
  const [sumId, setSumId] = useState("k");
  const [n, setN] = useState(5);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const preset = recurrences.find((r) => r.id === recId)!;

  const terms = useMemo(() => {
    if (recId === "fib") return buildFibonacci(9);
    const list = [preset.a0];
    for (let i = 1; i <= 9; i++) list.push(preset.rule(list[i - 1], i));
    return list;
  }, [recId, preset]);

  const sumPreset = summationPresets.find((s) => s.id === sumId)!;
  const sumTerms = useMemo(() => Array.from({ length: n }, (_, i) => sumPreset.fn(i + 1)), [sumPreset, n]);
  const runningTotal = useMemo(() => sumTerms.reduce((acc, v) => acc + v, 0), [sumTerms]);

  return (
    <div className="space-y-4">
      <ExplainerBox title="A recurrence is a formula that only knows how to look one step backward">
        <p>
          Instead of a direct formula for the n-th term, a recurrence tells you how to build the
          next term FROM the previous one(s) — exactly like a loop that updates a running variable.
          Step through the terms one at a time below, then try the summation calculator, which is
          just a recurrence in disguise (running_total = running_total + next_term).
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap gap-1.5">
        {recurrences.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => {
              setRecId(r.id);
              setShown(1);
              markInteracted();
            }}
            className={`px-3 py-1.5 rounded-full border text-xs font-mono transition-colors ${
              recId === r.id ? "border-accent bg-muted text-accent" : "border-card-border text-body hover:border-accent"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {terms.slice(0, shown).map((t, i) => (
          <div key={i} className="rounded-lg border-2 border-accent bg-muted px-3 py-2 text-center font-mono text-sm min-w-[52px]">
            <div className="text-xs text-secondary">a{i}</div>
            <div className="font-bold text-heading">{t}</div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          setShown((s) => Math.min(terms.length, s + 1));
          markInteracted();
        }}
        disabled={shown >= terms.length}
        className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Compute next term
      </button>
      <p className="text-xs text-secondary">Rule: {preset.ruleText}.</p>

      <div className="border-t border-card-border pt-4 space-y-3">
        <p className="text-sm font-semibold text-heading">Summation calculator</p>
        <div className="flex flex-wrap items-center gap-2">
          {summationPresets.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setSumId(s.id);
                markInteracted();
              }}
              className={`px-3 py-1.5 rounded-full border text-xs font-mono transition-colors ${
                sumId === s.id ? "border-accent bg-muted text-accent" : "border-card-border text-body hover:border-accent"
              }`}
            >
              {s.label}
            </button>
          ))}
          <label className="flex items-center gap-2 text-xs text-secondary">
            n =
            <input
              type="number"
              min={1}
              max={12}
              value={n}
              onChange={(e) => {
                setN(Math.max(1, Math.min(12, Number(e.target.value) || 1)));
                markInteracted();
              }}
              className="w-16 rounded-full border border-card-border px-2 py-1 font-mono"
            />
          </label>
        </div>
        <p className="text-sm font-mono text-body">
          {sumTerms.join(" + ")} = <span className="font-bold text-heading">{runningTotal}</span>
        </p>
      </div>
    </div>
  );
}
