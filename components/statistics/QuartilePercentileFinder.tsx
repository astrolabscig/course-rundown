"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";
import { buildGroupedClasses, computeGroupedPercentile, computeUngroupedQuartiles } from "@/lib/statistics/positionModel";

const defaultGroupedRows = [
  { lower: 118, upper: 126, frequency: 3 },
  { lower: 127, upper: 135, frequency: 5 },
  { lower: 136, upper: 144, frequency: 9 },
  { lower: 145, upper: 153, frequency: 12 },
  { lower: 154, upper: 162, frequency: 5 },
  { lower: 163, upper: 171, frequency: 4 },
  { lower: 172, upper: 180, frequency: 2 },
];

export default function QuartilePercentileFinder() {
  const [mode, setMode] = useState<"grouped" | "ungrouped">("grouped");
  const [percentile, setPercentile] = useState(10);
  const [rawInput, setRawInput] = useState("12,15,12,18,20,22,15,12,25,30");
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const classes = useMemo(() => buildGroupedClasses(defaultGroupedRows), []);
  const percentileResult = useMemo(() => computeGroupedPercentile(classes, percentile / 100), [classes, percentile]);

  const rawData = useMemo(
    () =>
      rawInput
        .split(",")
        .map((s) => Number(s.trim()))
        .filter((n) => !Number.isNaN(n)),
    [rawInput]
  );
  const quartiles = useMemo(() => (rawData.length > 0 ? computeUngroupedQuartiles(rawData) : null), [rawData]);

  return (
    <div className="space-y-4">
      <ExplainerBox title="Position tells you WHERE a value sits in the pack">
        <p>
          Quartiles split ranked data into 4 equal chunks, percentiles into 100. Q1 is the 25th
          percentile, Q2 (the median) is the 50th, Q3 is the 75th. For grouped data, there's no
          single "17th value" to point at directly — instead you interpolate: find the class that
          contains the target rank, then estimate a fractional position inside it.
        </p>
      </ExplainerBox>

      <div className="flex gap-1.5">
        {(["grouped", "ungrouped"] as const).map((m) => (
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
            {m} data
          </button>
        ))}
      </div>

      {mode === "grouped" ? (
        <>
          <div className="overflow-x-auto rounded-xl border border-card-border">
            <table className="w-full text-sm border-collapse text-center">
              <thead>
                <tr className="bg-muted">
                  <th className="p-2 border-b border-card-border">Length (mm)</th>
                  <th className="p-2 border-b border-card-border">Frequency</th>
                  <th className="p-2 border-b border-card-border">Cum. Freq.</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((c, i) => (
                  <tr
                    key={i}
                    className={`border-b border-card-border last:border-0 font-mono ${
                      c === percentileResult.targetClass ? "bg-accent/10" : ""
                    }`}
                  >
                    <td className="p-2">
                      {c.lower}-{c.upper}
                    </td>
                    <td className="p-2">{c.frequency}</td>
                    <td className="p-2">{c.cumulativeFrequency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <label className="flex items-center gap-2 text-sm text-secondary">
            Percentile
            <input
              type="number"
              min={1}
              max={99}
              value={percentile}
              onChange={(e) => {
                setPercentile(Math.max(1, Math.min(99, Number(e.target.value) || 1)));
                markInteracted();
              }}
              className="w-16 rounded-full border border-card-border px-2 py-1 font-mono"
            />
            th
          </label>

          <div className="rounded-xl bg-muted p-4 space-y-1 font-mono text-sm">
            <p>
              n{percentile} = {percentile}% × 40 = {percentileResult.nk}
            </p>
            <p>
              P{percentile} = l + (c/f)(nk − F) = {percentileResult.l} + ({percentileResult.c}/{percentileResult.f})(
              {percentileResult.nk} − {percentileResult.F})
            </p>
            <p className="font-bold text-heading">P{percentile} = {percentileResult.value.toFixed(2)}</p>
          </div>
        </>
      ) : (
        <>
          <input
            value={rawInput}
            onChange={(e) => {
              setRawInput(e.target.value);
              markInteracted();
            }}
            className="w-full rounded-full border border-card-border px-4 py-2 text-sm font-mono"
          />
          {quartiles && (
            <div className="grid gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-card-border p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Q1</p>
                <p className="text-sm font-mono text-heading">{quartiles.q1.toFixed(2)}</p>
              </div>
              <div className="rounded-xl border border-card-border p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Q2 (median)</p>
                <p className="text-sm font-mono text-heading">{quartiles.q2.toFixed(2)}</p>
              </div>
              <div className="rounded-xl border border-card-border p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Q3</p>
                <p className="text-sm font-mono text-heading">{quartiles.q3.toFixed(2)}</p>
              </div>
              <div className="rounded-xl border border-card-border p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-secondary">IQR</p>
                <p className="text-sm font-mono text-heading">{quartiles.iqr.toFixed(2)}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
