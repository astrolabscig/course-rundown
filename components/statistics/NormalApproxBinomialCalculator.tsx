"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);
  const a1 = 0.254829592,
    a2 = -0.284496736,
    a3 = 1.421413741,
    a4 = -1.453152027,
    a5 = 1.061405429,
    p = 0.3275911;
  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-x * x);
  return sign * y;
}
function stdNormCdf(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

type Mode = "exact" | "atleast" | "atmost" | "less" | "greater";

const modeLabels: { id: Mode; label: string }[] = [
  { id: "exact", label: "P(X = k)" },
  { id: "atleast", label: "P(X ≥ k)" },
  { id: "atmost", label: "P(X ≤ k)" },
  { id: "less", label: "P(X < k)" },
  { id: "greater", label: "P(X > k)" },
];

export default function NormalApproxBinomialCalculator() {
  const [n, setN] = useState(150);
  const [p, setP] = useState(0.5);
  const [k, setK] = useState(75);
  const [mode, setMode] = useState<Mode>("exact");
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const q = 1 - p;
  const mu = n * p;
  const sigma = Math.sqrt(n * p * q);
  const conditionsOk = n * p > 5 && n * q > 5;

  const { result, correctedBounds, steps } = useMemo(() => {
    if (sigma <= 0) return { result: 0, correctedBounds: "", steps: [] as string[] };
    const z = (x: number) => (x - mu) / sigma;
    if (mode === "exact") {
      const lo = k - 0.5,
        hi = k + 0.5;
      const val = stdNormCdf(z(hi)) - stdNormCdf(z(lo));
      return {
        result: val,
        correctedBounds: `P(${lo} < X < ${hi})`,
        steps: [`z₁ = (${lo}−${mu.toFixed(2)})/${sigma.toFixed(3)} = ${z(lo).toFixed(3)}`, `z₂ = (${hi}−${mu.toFixed(2)})/${sigma.toFixed(3)} = ${z(hi).toFixed(3)}`],
      };
    }
    if (mode === "atleast") {
      const lo = k - 0.5;
      const val = 1 - stdNormCdf(z(lo));
      return { result: val, correctedBounds: `P(X > ${lo})`, steps: [`z = (${lo}−${mu.toFixed(2)})/${sigma.toFixed(3)} = ${z(lo).toFixed(3)}`] };
    }
    if (mode === "atmost") {
      const hi = k + 0.5;
      const val = stdNormCdf(z(hi));
      return { result: val, correctedBounds: `P(X < ${hi})`, steps: [`z = (${hi}−${mu.toFixed(2)})/${sigma.toFixed(3)} = ${z(hi).toFixed(3)}`] };
    }
    if (mode === "less") {
      const hi = k - 0.5;
      const val = stdNormCdf(z(hi));
      return { result: val, correctedBounds: `P(X < ${hi})`, steps: [`z = (${hi}−${mu.toFixed(2)})/${sigma.toFixed(3)} = ${z(hi).toFixed(3)}`] };
    }
    const lo = k + 0.5;
    const val = 1 - stdNormCdf(z(lo));
    return { result: val, correctedBounds: `P(X > ${lo})`, steps: [`z = (${lo}−${mu.toFixed(2)})/${sigma.toFixed(3)} = ${z(lo).toFixed(3)}`] };
  }, [mode, k, mu, sigma]);

  return (
    <div className="space-y-4">
      <ExplainerBox title="Discrete Binomial, continuous Normal — the continuity correction bridges them">
        <p>
          When n is large, computing exact binomial probabilities term-by-term gets impractical —
          use μ=np and σ=√(npq) instead, but only after checking np&gt;5 AND nq&gt;5. Since X is
          discrete but the normal curve is continuous, every boundary gets widened or shifted by
          0.5 first (the continuity correction) before converting to a z-score.
        </p>
      </ExplainerBox>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-xs text-secondary space-y-1">
          <span className="block font-semibold">n (trials)</span>
          <input
            type="number"
            min={1}
            value={n}
            onChange={(e) => {
              setN(Math.max(1, Number(e.target.value) || 1));
              markInteracted();
            }}
            className="w-full rounded-full border border-card-border px-3 py-1.5 font-mono"
          />
        </label>
        <label className="text-xs text-secondary space-y-1">
          <span className="block font-semibold">p (success)</span>
          <input
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={p}
            onChange={(e) => {
              setP(Math.max(0, Math.min(1, Number(e.target.value) || 0)));
              markInteracted();
            }}
            className="w-full rounded-full border border-card-border px-3 py-1.5 font-mono"
          />
        </label>
        <label className="text-xs text-secondary space-y-1">
          <span className="block font-semibold">k</span>
          <input
            type="number"
            value={k}
            onChange={(e) => {
              setK(Number(e.target.value) || 0);
              markInteracted();
            }}
            className="w-full rounded-full border border-card-border px-3 py-1.5 font-mono"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {modeLabels.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              setMode(m.id);
              markInteracted();
            }}
            className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
              mode === m.id ? "border-accent bg-muted text-accent" : "border-card-border text-body hover:border-accent"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <p className={`text-xs font-medium ${conditionsOk ? "text-success" : "text-accent-warm"}`}>
        {conditionsOk
          ? `✓ np=${mu.toFixed(2)} > 5 and nq=${(n * q).toFixed(2)} > 5 — normal approximation is appropriate`
          : `✗ np=${mu.toFixed(2)}, nq=${(n * q).toFixed(2)} — one is ≤ 5, so the normal approximation may be unreliable here`}
      </p>

      <div className="rounded-xl bg-muted p-4 space-y-1 font-mono text-sm">
        <p className="text-body">μ = np = {mu.toFixed(3)}</p>
        <p className="text-body">σ = √(npq) = {sigma.toFixed(3)}</p>
        <p className="text-body">Continuity correction → {correctedBounds}</p>
        {steps.map((s, i) => (
          <p key={i} className="text-body">
            {s}
          </p>
        ))}
        <p className="font-bold text-heading text-lg">≈ {result.toFixed(4)}</p>
      </div>
    </div>
  );
}
