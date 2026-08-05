"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

function factorial(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

type Mode = "permutation" | "combination" | "repetition";

const presets: { label: string; mode: Mode; n: number; r: number }[] = [
  { label: "P(5,3) — 3 of 5 books on a shelf", mode: "permutation", n: 5, r: 3 },
  { label: "C(5,3) — choose 3 friends from 5", mode: "combination", n: 5, r: 3 },
];

function letterFrequencies(word: string): Record<string, number> {
  const freq: Record<string, number> = {};
  for (const ch of word.toUpperCase()) {
    if (ch === " ") continue;
    freq[ch] = (freq[ch] ?? 0) + 1;
  }
  return freq;
}

export default function PermutationCombinationCalculator() {
  const [mode, setMode] = useState<Mode>("permutation");
  const [n, setN] = useState(5);
  const [r, setR] = useState(3);
  const [word, setWord] = useState("MAMMAL");
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const valid = r >= 0 && n >= 0 && r <= n;
  const { steps } = useMemo(() => {
    if (mode === "permutation") {
      if (!valid) return { value: 0, steps: [] as string[] };
      const v = factorial(n) / factorial(n - r);
      return {
        value: v,
        steps: [`P(${n},${r}) = ${n}! / (${n}−${r})!`, `= ${factorial(n)} / ${factorial(n - r)}`, `= ${v}`],
      };
    }
    if (mode === "combination") {
      if (!valid) return { value: 0, steps: [] as string[] };
      const v = factorial(n) / (factorial(r) * factorial(n - r));
      return {
        value: v,
        steps: [
          `C(${n},${r}) = ${n}! / (${r}! × (${n}−${r})!)`,
          `= ${factorial(n)} / (${factorial(r)} × ${factorial(n - r)})`,
          `= ${v}`,
        ],
      };
    }
    // repetition mode
    const freq = letterFrequencies(word);
    const letters = Object.keys(freq).sort();
    const total = letters.reduce((s, l) => s + freq[l], 0);
    if (total === 0) return { value: 0, steps: [] };
    const denomParts = letters.map((l) => `${freq[l]}!`);
    const denomValue = letters.reduce((p, l) => p * factorial(freq[l]), 1);
    const v = factorial(total) / denomValue;
    return {
      value: v,
      steps: [
        `letters: ${letters.map((l) => `${l}×${freq[l]}`).join(", ")}  (n=${total})`,
        `${total}! / (${denomParts.join(" × ")})`,
        `= ${factorial(total)} / ${denomValue}`,
        `= ${v}`,
      ],
    };
  }, [mode, n, r, valid, word]);

  function applyPreset(p: (typeof presets)[number]) {
    setMode(p.mode);
    setN(p.n);
    setR(p.r);
    markInteracted();
  }

  return (
    <div className="space-y-4">
      <ExplainerBox title="Order matters (permutation), doesn't matter (combination), or repeats (permutation with repetition)">
        <p>
          nPr counts arrangements of r items chosen from n WHEN ORDER MATTERS. nCr counts
          selections of r items from n WHEN ORDER DOESN&rsquo;T MATTER — always nPr divided by r!,
          since every combination can itself be arranged r! different ways. When the objects being
          arranged aren&rsquo;t all distinct (repeated letters in a word), divide n! by the
          factorial of each repeated group&rsquo;s count to remove the identical-looking duplicates.
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-full border border-card-border text-xs font-medium text-body hover:border-accent transition-colors"
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            setMode("repetition");
            markInteracted();
          }}
          className="px-3 py-1.5 rounded-full border border-card-border text-xs font-medium text-body hover:border-accent transition-colors"
        >
          MAMMAL — permutation with repetition
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5">
          {(["permutation", "combination", "repetition"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                markInteracted();
              }}
              className={`px-3 py-1.5 rounded-full border text-xs font-medium capitalize transition-colors ${
                mode === m ? "border-accent bg-muted text-accent" : "border-card-border text-body hover:border-accent"
              }`}
            >
              {m === "repetition" ? "with repetition" : m}
            </button>
          ))}
        </div>

        {mode !== "repetition" ? (
          <>
            <label className="flex items-center gap-2 text-xs text-secondary">
              n =
              <input
                type="number"
                min={0}
                max={12}
                value={n}
                onChange={(e) => {
                  setN(Math.max(0, Math.min(12, Number(e.target.value) || 0)));
                  markInteracted();
                }}
                className="w-16 rounded-full border border-card-border px-2 py-1 font-mono"
              />
            </label>
            <label className="flex items-center gap-2 text-xs text-secondary">
              r =
              <input
                type="number"
                min={0}
                max={12}
                value={r}
                onChange={(e) => {
                  setR(Math.max(0, Math.min(12, Number(e.target.value) || 0)));
                  markInteracted();
                }}
                className="w-16 rounded-full border border-card-border px-2 py-1 font-mono"
              />
            </label>
          </>
        ) : (
          <label className="flex items-center gap-2 text-xs text-secondary">
            word =
            <input
              type="text"
              value={word}
              onChange={(e) => {
                setWord(e.target.value.slice(0, 12));
                markInteracted();
              }}
              className="w-32 rounded-full border border-card-border px-3 py-1 font-mono uppercase"
            />
          </label>
        )}
      </div>

      {mode !== "repetition" && !valid ? (
        <p className="text-sm text-error">r must be between 0 and n.</p>
      ) : (
        <div className="rounded-xl bg-muted p-4 space-y-1 font-mono text-sm">
          {steps.map((s, i) => (
            <p key={i} className={i === steps.length - 1 ? "font-bold text-heading" : "text-body"}>
              {s}
            </p>
          ))}
          {steps.length === 0 && <p className="text-body">Type a word above.</p>}
        </div>
      )}
    </div>
  );
}
