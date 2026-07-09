"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";
import { buildFrequencyDistribution } from "@/lib/statistics/frequencyModel";

const kotsahData =
  "8,7,10,5,23,4,16,9,62,28,14,53,29,11,34,33,68,75,12,78,22,54,67,55,13,32,41,58,36,2,26,77,65,38,52,71,2,16,36,40,18,24,52,64,76,16,6,18,28,40";

export default function FrequencyDistributionBuilder() {
  const [input, setInput] = useState(kotsahData);
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

  const dist = useMemo(() => (data.length > 1 ? buildFrequencyDistribution(data) : null), [data]);

  return (
    <div className="space-y-4">
      <ExplainerBox title="How many classes should a frequency table have?">
        <p>
          Raw data is just a wall of numbers — meaningless until it's grouped. Two rules do the
          grouping for you: pick the smallest number of classes k such that 2^k ≥ n (the number of
          data points), then set the class width to (highest − lowest) ÷ k, rounded up. Everything
          else — limits, boundaries, midpoints, frequencies — falls out mechanically once those two
          numbers are fixed.
        </p>
      </ExplainerBox>

      <div className="space-y-1">
        <p className="text-xs text-secondary">Comma-separated raw data (defaults to the Kotsah Island 50-value dataset):</p>
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            markInteracted();
          }}
          rows={3}
          className="w-full rounded-xl border border-card-border px-3 py-2 text-sm font-mono"
        />
      </div>

      {dist ? (
        <>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="text-secondary">
              n = <strong className="text-heading font-mono">{dist.n}</strong>
            </span>
            <span className="text-secondary">
              Range = <strong className="text-heading font-mono">{dist.max}</strong> − <strong className="text-heading font-mono">{dist.min}</strong> = <strong className="text-heading font-mono">{dist.max - dist.min}</strong>
            </span>
            <span className="text-secondary">
              k (2^k ≥ n) = <strong className="text-heading font-mono">{dist.k}</strong>
            </span>
            <span className="text-secondary">
              width = <strong className="text-heading font-mono">{dist.width}</strong>
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-card-border">
            <table className="w-full text-sm border-collapse text-center">
              <thead>
                <tr className="bg-muted">
                  <th className="p-2 border-b border-card-border">Class limit</th>
                  <th className="p-2 border-b border-card-border">Class boundary</th>
                  <th className="p-2 border-b border-card-border">Midpoint</th>
                  <th className="p-2 border-b border-card-border">Frequency</th>
                  <th className="p-2 border-b border-card-border">Rel. Freq.</th>
                  <th className="p-2 border-b border-card-border">Cum. Freq.</th>
                </tr>
              </thead>
              <tbody>
                {dist.classes.map((c, i) => (
                  <tr key={i} className="border-b border-card-border last:border-0 font-mono">
                    <td className="p-2">
                      {c.lower} - {c.upper}
                    </td>
                    <td className="p-2">
                      {c.boundaryLower} - {c.boundaryUpper}
                    </td>
                    <td className="p-2">{c.midpoint}</td>
                    <td className="p-2">{c.frequency}</td>
                    <td className="p-2">{c.relativeFrequency.toFixed(2)}</td>
                    <td className="p-2">{c.cumulativeFrequency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className="text-sm text-error">Enter at least 2 comma-separated numbers.</p>
      )}
    </div>
  );
}
