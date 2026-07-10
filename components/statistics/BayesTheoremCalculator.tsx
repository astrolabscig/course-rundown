"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

interface Row {
  label: string;
  prior: number;
  conditional: number;
}

const presets: Record<string, Row[]> = {
  "Assembly plant (machines)": [
    { label: "Machine A", prior: 0.3, conditional: 0.02 },
    { label: "Machine B", prior: 0.45, conditional: 0.03 },
    { label: "Machine C", prior: 0.25, conditional: 0.02 },
  ],
  "Car rental (agencies)": [
    { label: "Agency A", prior: 0.3, conditional: 0.15 },
    { label: "Agency B", prior: 0.2, conditional: 0.1 },
    { label: "Agency C", prior: 0.5, conditional: 0.06 },
  ],
};

export default function BayesTheoremCalculator() {
  const [presetName, setPresetName] = useState<keyof typeof presets>("Assembly plant (machines)");
  const [rows, setRows] = useState<Row[]>(presets["Assembly plant (machines)"]);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function applyPreset(name: keyof typeof presets) {
    setPresetName(name);
    setRows(presets[name].map((r) => ({ ...r })));
    markInteracted();
  }

  function updateRow(i: number, field: "label" | "prior" | "conditional", value: string) {
    setRows((prev) =>
      prev.map((r, idx) =>
        idx === i
          ? { ...r, [field]: field === "label" ? value : Math.max(0, Math.min(1, Number(value) || 0)) }
          : r
      )
    );
    markInteracted();
  }

  function addRow() {
    setRows((prev) => [...prev, { label: `Group ${prev.length + 1}`, prior: 0, conditional: 0 }]);
    markInteracted();
  }

  function removeRow(i: number) {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
    markInteracted();
  }

  const priorSum = useMemo(() => rows.reduce((s, r) => s + r.prior, 0), [rows]);
  const pB = useMemo(() => rows.reduce((s, r) => s + r.prior * r.conditional, 0), [rows]);
  const posteriors = useMemo(
    () => rows.map((r) => (pB > 0 ? (r.conditional * r.prior) / pB : 0)),
    [rows, pB]
  );

  const priorsInvalid = Math.abs(priorSum - 1) > 0.005;

  return (
    <div className="space-y-4">
      <ExplainerBox title="Total Probability + Bayes' Theorem: forward and backward in one table">
        <p>
          Each row is one piece of a partition — a machine, an agency, a source — with its own
          prior probability P(Aᵢ) and its own conditional rate P(B | Aᵢ). The Total Probability
          Rule combines them forward into the overall P(B); Bayes&apos; Theorem then runs it
          backward, turning each row&apos;s prior into a posterior P(Aᵢ | B) once B is observed.
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(presets) as (keyof typeof presets)[]).map((name) => (
          <button
            key={name}
            onClick={() => applyPreset(name)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              presetName === name
                ? "bg-accent text-white border-accent"
                : "border-card-border text-body hover:border-accent"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-xs text-secondary">
              <th className="p-2 font-semibold">Source Aᵢ</th>
              <th className="p-2 font-semibold">Prior P(Aᵢ)</th>
              <th className="p-2 font-semibold">P(B | Aᵢ)</th>
              <th className="p-2 font-semibold">Posterior P(Aᵢ | B)</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-card-border last:border-0">
                <td className="p-2">
                  <input
                    type="text"
                    value={r.label}
                    onChange={(e) => updateRow(i, "label", e.target.value)}
                    className="w-full rounded-lg border border-card-border px-2 py-1 font-mono text-xs"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={r.prior}
                    onChange={(e) => updateRow(i, "prior", e.target.value)}
                    className="w-20 rounded-lg border border-card-border px-2 py-1 font-mono text-xs"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={r.conditional}
                    onChange={(e) => updateRow(i, "conditional", e.target.value)}
                    className="w-20 rounded-lg border border-card-border px-2 py-1 font-mono text-xs"
                  />
                </td>
                <td className="p-2 font-mono font-bold text-heading">{posteriors[i]?.toFixed(4)}</td>
                <td className="p-2">
                  {rows.length > 2 && (
                    <button
                      onClick={() => removeRow(i)}
                      className="text-xs text-secondary hover:text-accent-warm"
                      aria-label={`Remove ${r.label}`}
                    >
                      ✕
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={addRow}
        className="text-xs font-medium text-accent hover:underline"
      >
        + Add another source
      </button>

      {priorsInvalid && (
        <p className="text-xs text-accent-warm font-medium">
          Priors sum to {priorSum.toFixed(3)}, not 1 — a valid partition&apos;s priors must add up
          to exactly 1.
        </p>
      )}

      <div className="rounded-xl bg-muted p-4 font-mono text-sm">
        <p className="text-xs text-secondary font-sans mb-1">
          P(B) = Σ P(B | Aᵢ)·P(Aᵢ)  (Total Probability Rule)
        </p>
        <p className="font-bold text-heading">P(B) = {pB.toFixed(4)}</p>
      </div>
    </div>
  );
}
