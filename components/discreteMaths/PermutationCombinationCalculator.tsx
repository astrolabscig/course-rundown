"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

function factorial(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

const presets = [
  { label: "P(5,3) — 3 of 5 students in line", mode: "permutation" as const, n: 5, r: 3 },
  { label: "C(4,3) — choose a 3-person committee of 4", mode: "combination" as const, n: 4, r: 3 },
];

export default function PermutationCombinationCalculator() {
  const [mode, setMode] = useState<"permutation" | "combination">("permutation");
  const [n, setN] = useState(5);
  const [r, setR] = useState(3);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const valid = r >= 0 && n >= 0 && r <= n;
  const { value, steps } = useMemo(() => {
    if (!valid) return { value: 0, steps: [] as string[] };
    if (mode === "permutation") {
      const v = factorial(n) / factorial(n - r);
      return {
        value: v,
        steps: [
          `P(${n},${r}) = ${n}! / (${n}-${r})!`,
          `= ${factorial(n)} / ${factorial(n - r)}`,
          `= ${v}`,
        ],
      };
    }
    const v = factorial(n) / (factorial(r) * factorial(n - r));
    return {
      value: v,
      steps: [
        `C(${n},${r}) = ${n}! / (${r}! × (${n}-${r})!)`,
        `= ${factorial(n)} / (${factorial(r)} × ${factorial(n - r)})`,
        `= ${factorial(n)} / ${factorial(r) * factorial(n - r)}`,
        `= ${v}`,
      ],
    };
  }, [mode, n, r, valid]);

  function applyPreset(p: (typeof presets)[number]) {
    setMode(p.mode);
    setN(p.n);
    setR(p.r);
    markInteracted();
  }

  return (
    <div className="space-y-4">
      <ExplainerBox title="Permutation cares about order, combination doesn't">
        <p>
          P(n,r) counts arrangements of r items chosen from n WHEN ORDER MATTERS (like assigning
          1st/2nd/3rd place). C(n,r) counts selections of r items from n WHEN ORDER DOESN&rsquo;T
          MATTER (like choosing a committee). Since every combination of r items can be arranged in
          r! different orders, C(n,r) is always P(n,r) divided by r! (Rosen 6.3, Examples 1 &amp;
          8).
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
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5">
          {(["permutation", "combination"] as const).map((m) => (
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
              {m}
            </button>
          ))}
        </div>
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
      </div>

      {!valid ? (
        <p className="text-sm text-error">r must be between 0 and n.</p>
      ) : (
        <div className="rounded-xl bg-muted p-4 space-y-1 font-mono text-sm">
          {steps.map((s, i) => (
            <p key={i} className={i === steps.length - 1 ? "font-bold text-heading" : "text-body"}>
              {s}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
