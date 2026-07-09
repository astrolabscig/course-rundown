"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";
import { computeDispersion } from "@/lib/statistics/dispersionModel";

const presets: Record<string, string> = {
  "Group 1": "38,91,45,65,39,48,78,34,65,59",
  "Group 2": "83,45,65,54,44,49,91,55,57",
  "Group 3": "66,59,71,59,61,59,73,56,61",
};

export default function DispersionCalculator() {
  const [input, setInput] = useState(presets["Group 1"]);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const data = useMemo(
    () =>
      input
        .split(",")
        .map((s) => Number(s.trim()))
        .filter((n) => !Number.isNaN(n)),
    [input]
  );

  const result = useMemo(() => (data.length > 1 ? computeDispersion(data) : null), [data]);

  return (
    <div className="space-y-4">
      <ExplainerBox title="How spread out is the data, really?">
        <p>
          Two datasets can share the exact same mean and still tell very different stories — one
          tightly clustered, one wildly spread out. Range is the crudest measure (just the two
          extremes). Mean deviation averages how far every point sits from the mean. Variance and
          standard deviation do the same thing but square the distances first (which punishes big
          outliers harder) — and there are two versions: population (divide by n) when you have the
          entire population, sample (divide by n−1) when you're estimating from a sample.
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap gap-1.5">
        {Object.keys(presets).map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => {
              setInput(presets[name]);
              markInteracted();
            }}
            className="px-3 py-1.5 rounded-full border border-card-border text-xs font-medium text-body hover:border-accent transition-colors"
          >
            {name}
          </button>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          markInteracted();
        }}
        className="w-full rounded-full border border-card-border px-4 py-2 text-sm font-mono"
      />

      {result && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-card-border p-3 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Range</p>
            <p className="text-sm font-mono text-heading">{result.range}</p>
          </div>
          <div className="rounded-xl border border-card-border p-3 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Mean deviation</p>
            <p className="text-sm font-mono text-heading">{result.meanDeviation.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-card-border p-3 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Population variance / SD</p>
            <p className="text-sm font-mono text-heading">
              σ² = {result.populationVariance.toFixed(2)}, σ = {result.populationSD.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border border-card-border p-3 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Sample variance / SD</p>
            <p className="text-sm font-mono text-heading">
              s² = {result.sampleVariance.toFixed(2)}, s = {result.sampleSD.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border border-card-border p-3 space-y-1 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Coefficient of variation</p>
            <p className="text-sm font-mono text-heading">{result.coefficientOfVariation.toFixed(1)}%</p>
          </div>
        </div>
      )}
    </div>
  );
}
