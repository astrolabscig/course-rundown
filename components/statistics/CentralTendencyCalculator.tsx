"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";
import { computeCentralTendency } from "@/lib/statistics/centralTendencyModel";

const tutorialData = "12,15,12,18,20,22,15,12,25,30";

export default function CentralTendencyCalculator() {
  const [input, setInput] = useState(tutorialData);
  const [trimPercent, setTrimPercent] = useState(10);
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

  const result = useMemo(() => (data.length > 0 ? computeCentralTendency(data, trimPercent) : null), [data, trimPercent]);

  return (
    <div className="space-y-4">
      <ExplainerBox title="Five different ways to answer 'what's typical here?'">
        <p>
          The mean can be dragged around by a single extreme value — a trimmed mean protects
          against that by dropping the most extreme few percent from each end before averaging. A
          geometric mean is the right tool whenever you're averaging rates, ratios, or growth
          percentages instead of raw amounts. The median is the true middle value, immune to
          outliers entirely. The mode is just whichever value shows up most often.
        </p>
      </ExplainerBox>

      <div className="space-y-1">
        <p className="text-xs text-secondary">Comma-separated dataset (defaults to Tutorial 2, Question 1):</p>
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            markInteracted();
          }}
          className="w-full rounded-full border border-card-border px-4 py-2 text-sm font-mono"
        />
      </div>

      <label className="flex items-center gap-2 text-xs text-secondary">
        Trim %
        <input
          type="number"
          min={0}
          max={40}
          value={trimPercent}
          onChange={(e) => {
            setTrimPercent(Math.max(0, Math.min(40, Number(e.target.value) || 0)));
            markInteracted();
          }}
          className="w-16 rounded-full border border-card-border px-2 py-1 font-mono"
        />
      </label>

      {result && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-card-border p-3 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Arithmetic mean</p>
            <p className="text-sm font-mono text-heading">{result.mean.toFixed(4)}</p>
          </div>
          <div className="rounded-xl border border-card-border p-3 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">{trimPercent}% trimmed mean</p>
            <p className="text-sm font-mono text-heading">{result.trimmedMean.toFixed(4)}</p>
            <p className="text-xs text-secondary">
              (removed {result.trimCount} value{result.trimCount === 1 ? "" : "s"} from each end)
            </p>
          </div>
          <div className="rounded-xl border border-card-border p-3 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Geometric mean</p>
            <p className="text-sm font-mono text-heading">
              {result.geometricMean !== null ? result.geometricMean.toFixed(4) : "n/a (needs all-positive data)"}
            </p>
          </div>
          <div className="rounded-xl border border-card-border p-3 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Median</p>
            <p className="text-sm font-mono text-heading">{result.median}</p>
          </div>
          <div className="rounded-xl border border-card-border p-3 space-y-1 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Mode</p>
            <p className="text-sm font-mono text-heading">{result.mode.join(", ")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
