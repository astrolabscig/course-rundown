"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

function useInteract() {
  const ref = useRef(false);
  return () => {
    if (!ref.current) {
      ref.current = true;
      trackInteract();
    }
  };
}

function NumberInput({
  label,
  value,
  onChange,
  step,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-secondary">{label}</span>
      <input
        type="number"
        step={step ?? "1"}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded-lg border border-card-border px-2 py-1.5 text-sm font-mono w-full"
      />
    </label>
  );
}

interface Equilibrium {
  Y: number;
  T: number;
  Yd: number;
  C: number;
  M: number;
  S: number;
  W: number;
  J: number;
  denom: number;
  k: number;
}

function solve(a: number, b: number, T0: number, t: number, I: number, G: number, X: number, M0: number, m: number): Equilibrium {
  const denom = 1 - b * (1 - t) + m;
  const Y = denom !== 0 ? (a - b * T0 + I + G + X - M0) / denom : 0;
  const T = T0 + t * Y;
  const Yd = Y - T;
  const C = a + b * Yd;
  const M = M0 + m * Y;
  const S = Yd - C;
  const W = S + T + M;
  const J = I + G + X;
  const k = denom !== 0 ? 1 / denom : 0;
  return { Y, T, Yd, C, M, S, W, J, denom, k };
}

export default function MultiplierEquilibriumCalculator() {
  const markInteracted = useInteract();
  const [a, setA] = useState(200);
  const [b, setB] = useState(0.8);
  const [T0, setT0] = useState(0);
  const [t, setT] = useState(0.2);
  const [I, setI] = useState(100);
  const [G, setG] = useState(0);
  const [X, setX] = useState(0);
  const [M0, setM0] = useState(0);
  const [m, setM] = useState(0);
  const [deltaI, setDeltaI] = useState(50);

  function onAny(v: number, setter: (v: number) => void) {
    setter(v);
    markInteracted();
  }

  const eq = useMemo(() => solve(a, b, T0, t, I, G, X, M0, m), [a, b, T0, t, I, G, X, M0, m]);
  const shocked = useMemo(() => solve(a, b, T0, t, I + deltaI, G, X, M0, m), [a, b, T0, t, I, deltaI, G, X, M0, m]);
  const deltaY = shocked.Y - eq.Y;
  const predictedDeltaY = eq.k * deltaI;

  return (
    <div className="space-y-4">
      <ExplainerBox title="One equilibrium, two ways to solve it">
        <p>
          Set autonomous consumption, the MPC, the tax function, and the injections — the
          calculator solves for equilibrium income Ye the same way an exam would: substitute the
          tax and import functions into C, set Y = AE (or equivalently W = J), and solve. The
          default numbers reproduce the lecture&rsquo;s own worked example: Ye = 833.33 with a
          multiplier of 1/0.36 ≈ 2.78.
        </p>
      </ExplainerBox>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-muted p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Consumption &amp; tax</p>
          <div className="grid grid-cols-2 gap-2">
            <NumberInput label="Autonomous consumption, a" value={a} onChange={(v) => onAny(v, setA)} />
            <NumberInput label="MPC, b" value={b} step="0.05" onChange={(v) => onAny(v, setB)} />
            <NumberInput label="Fixed tax, T0" value={T0} onChange={(v) => onAny(v, setT0)} />
            <NumberInput label="Tax rate, t" value={t} step="0.05" onChange={(v) => onAny(v, setT)} />
          </div>
        </div>
        <div className="rounded-xl bg-muted p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Injections &amp; imports</p>
          <div className="grid grid-cols-2 gap-2">
            <NumberInput label="Investment, I" value={I} onChange={(v) => onAny(v, setI)} />
            <NumberInput label="Gov't spending, G" value={G} onChange={(v) => onAny(v, setG)} />
            <NumberInput label="Exports, X" value={X} onChange={(v) => onAny(v, setX)} />
            <NumberInput label="Fixed imports, M0" value={M0} onChange={(v) => onAny(v, setM0)} />
            <NumberInput label="MPM, m" value={m} step="0.05" onChange={(v) => onAny(v, setM)} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-card-border overflow-hidden">
        {[
          { label: "Equilibrium income, Ye", value: eq.Y },
          { label: "Tax, T", value: eq.T },
          { label: "Disposable income, Yd", value: eq.Yd },
          { label: "Consumption, C", value: eq.C },
          { label: "Imports, M", value: eq.M },
          { label: "Savings, S", value: eq.S },
        ].map((row, i, arr) => (
          <div
            key={row.label}
            className={`flex items-center justify-between px-4 py-2.5 text-sm bg-card text-body ${i !== arr.length - 1 ? "border-b border-card-border" : ""}`}
          >
            <span>{row.label}</span>
            <span className="font-mono">{row.value.toFixed(2)}</span>
          </div>
        ))}
        <div className="flex items-center justify-between px-4 py-2.5 text-sm bg-accent-warm-bg font-semibold text-heading border-t border-card-border">
          <span>Withdrawals W = S+T+M vs Injections J = I+G+X</span>
          <span className="font-mono">{eq.W.toFixed(2)} = {eq.J.toFixed(2)}</span>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-card-border p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-secondary mb-1">The multiplier</p>
        <p className="font-mono text-sm text-body">mpw (effective) = 1 − b(1−t) + m = {eq.denom.toFixed(4)}</p>
        <p className="font-mono text-lg font-bold text-heading">k = 1 / {eq.denom.toFixed(4)} = {eq.k.toFixed(2)}</p>
      </div>

      <div className="rounded-xl bg-muted p-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
          Shock: bump investment by ΔI and watch the multiplier work
        </p>
        <label className="flex items-center gap-3 text-sm">
          <span className="text-body shrink-0">ΔI =</span>
          <input
            type="range"
            min={-200}
            max={200}
            step={5}
            value={deltaI}
            onChange={(e) => onAny(Number(e.target.value), setDeltaI)}
            className="w-full accent-[var(--accent)]"
          />
          <span className="font-mono font-semibold text-heading w-14 text-right shrink-0">{deltaI}</span>
        </label>
        <div className="grid gap-2 sm:grid-cols-3 text-sm">
          <div className="rounded-lg bg-card border border-card-border p-3">
            <p className="text-xs text-secondary">New equilibrium, Ye&rsquo;</p>
            <p className="font-mono font-semibold text-heading">{shocked.Y.toFixed(2)}</p>
          </div>
          <div className="rounded-lg bg-card border border-card-border p-3">
            <p className="text-xs text-secondary">Actual ΔY</p>
            <p className="font-mono font-semibold text-heading">{deltaY.toFixed(2)}</p>
          </div>
          <div className="rounded-lg bg-card border border-card-border p-3">
            <p className="text-xs text-secondary">Predicted k × ΔI</p>
            <p className="font-mono font-semibold text-heading">{predictedDeltaY.toFixed(2)}</p>
          </div>
        </div>
        <p className="text-xs text-secondary">
          The two ΔY figures match exactly — that&rsquo;s the multiplier formula proving itself.
        </p>
      </div>
    </div>
  );
}
