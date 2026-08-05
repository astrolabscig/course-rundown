"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

interface Row {
  x: number;
  p: number;
}

const defaultRows: Row[] = [
  { x: 1, p: 0.25 },
  { x: 2, p: 0.5 },
  { x: 3, p: 0.25 },
];

export default function DiscreteRandomVariableCalculator() {
  const [rows, setRows] = useState<Row[]>(defaultRows);
  const [threshold, setThreshold] = useState(2);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function updateRow(i: number, field: "x" | "p", value: string) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: Number(value) || 0 } : r)));
    markInteracted();
  }

  function addRow() {
    setRows((prev) => [...prev, { x: prev.length ? prev[prev.length - 1].x + 1 : 0, p: 0 }]);
    markInteracted();
  }

  function removeRow(i: number) {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
    markInteracted();
  }

  const stats = useMemo(() => {
    const sumP = rows.reduce((s, r) => s + r.p, 0);
    const eX = rows.reduce((s, r) => s + r.x * r.p, 0);
    const eX2 = rows.reduce((s, r) => s + r.x * r.x * r.p, 0);
    const varX = eX2 - eX * eX;
    const sdX = varX >= 0 ? Math.sqrt(varX) : NaN;
    const pLE = rows.filter((r) => r.x <= threshold).reduce((s, r) => s + r.p, 0);
    const pGT = 1 - pLE;
    return { sumP, eX, eX2, varX, sdX, pLE, pGT };
  }, [rows, threshold]);

  const validPmf = Math.abs(stats.sumP - 1) < 0.005 && rows.every((r) => r.p >= 0);

  return (
    <div className="space-y-4">
      <ExplainerBox title="A PMF is just a lookup table — this checks it, then computes everything from it">
        <p>
          Every row is one possible value of X and its probability. For this to be a valid
          probability mass function, every probability must be non-negative and they must all sum
          to exactly 1. Once that checks out, E(X), Var(X), and any P(X ≤ k) fall straight out of
          the same table — no separate formula needed, just careful weighted summing.
        </p>
      </ExplainerBox>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-xs text-secondary">
              <th className="p-2 font-semibold">x</th>
              <th className="p-2 font-semibold">P(X = x)</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-card-border last:border-0">
                <td className="p-2">
                  <input
                    type="number"
                    value={r.x}
                    onChange={(e) => updateRow(i, "x", e.target.value)}
                    className="w-20 rounded-lg border border-card-border px-2 py-1 font-mono text-xs"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    step="0.01"
                    value={r.p}
                    onChange={(e) => updateRow(i, "p", e.target.value)}
                    className="w-24 rounded-lg border border-card-border px-2 py-1 font-mono text-xs"
                  />
                </td>
                <td className="p-2">
                  {rows.length > 1 && (
                    <button onClick={() => removeRow(i)} className="text-xs text-secondary hover:text-accent-warm" aria-label={`Remove row ${i}`}>
                      ✕
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={addRow} className="text-xs font-medium text-accent hover:underline">
        + Add another value
      </button>

      <p className={`text-xs font-medium ${validPmf ? "text-success" : "text-accent-warm"}`}>
        {validPmf
          ? `✓ Valid PMF — probabilities sum to ${stats.sumP.toFixed(3)}`
          : `✗ Not yet a valid PMF — probabilities sum to ${stats.sumP.toFixed(3)}, not 1`}
      </p>

      <div className="grid gap-2 sm:grid-cols-2 font-mono text-sm">
        <div className="rounded-xl bg-muted p-3">
          <p className="text-xs text-secondary font-sans mb-1">E(X) = Σ x·f(x)</p>
          <p className="font-bold text-heading">{stats.eX.toFixed(4)}</p>
        </div>
        <div className="rounded-xl bg-muted p-3">
          <p className="text-xs text-secondary font-sans mb-1">Var(X) = E(X²) − [E(X)]²</p>
          <p className="font-bold text-heading">{stats.varX.toFixed(4)}</p>
        </div>
        <div className="rounded-xl bg-muted p-3">
          <p className="text-xs text-secondary font-sans mb-1">SD(X) = √Var(X)</p>
          <p className="font-bold text-heading">{Number.isNaN(stats.sdX) ? "—" : stats.sdX.toFixed(4)}</p>
        </div>
        <div className="rounded-xl bg-muted p-3">
          <p className="text-xs text-secondary font-sans mb-1">E(X²) = Σ x²·f(x)</p>
          <p className="font-bold text-heading">{stats.eX2.toFixed(4)}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-secondary">
          Threshold k =
          <input
            type="number"
            value={threshold}
            onChange={(e) => {
              setThreshold(Number(e.target.value) || 0);
              markInteracted();
            }}
            className="w-16 rounded-full border border-card-border px-2 py-1 font-mono"
          />
        </label>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 font-mono text-sm">
        <div className="rounded-xl border border-card-border p-3">
          <p className="text-xs text-secondary font-sans mb-1">P(X ≤ {threshold})</p>
          <p className="font-bold text-heading">{stats.pLE.toFixed(4)}</p>
        </div>
        <div className="rounded-xl border border-card-border p-3">
          <p className="text-xs text-secondary font-sans mb-1">P(X &gt; {threshold})</p>
          <p className="font-bold text-heading">{stats.pGT.toFixed(4)}</p>
        </div>
      </div>
    </div>
  );
}
