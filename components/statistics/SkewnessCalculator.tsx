"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

export default function SkewnessCalculator() {
  const [mean, setMean] = useState(28);
  const [median, setMedian] = useState(25);
  const [sd, setSd] = useState(4.2);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const skewness = useMemo(() => (sd !== 0 ? (3 * (mean - median)) / sd : 0), [mean, median, sd]);
  const classification = skewness > 0.1 ? "positively skewed" : skewness < -0.1 ? "negatively skewed" : "roughly symmetric";

  return (
    <div className="space-y-4">
      <ExplainerBox title="Skewness: which way does the tail stretch?">
        <p>
          A perfectly symmetric distribution has mean = median = mode. The moment the mean gets
          pulled away from the median, that's skewness talking — a long tail of extreme values on
          one side drags the mean toward it, while the median (which only cares about rank, not
          magnitude) barely moves.
        </p>
      </ExplainerBox>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-xs text-secondary space-y-1">
          <span className="block font-semibold">Mean</span>
          <input
            type="number"
            value={mean}
            onChange={(e) => {
              setMean(Number(e.target.value) || 0);
              markInteracted();
            }}
            className="w-full rounded-full border border-card-border px-3 py-1.5 font-mono"
          />
        </label>
        <label className="text-xs text-secondary space-y-1">
          <span className="block font-semibold">Median</span>
          <input
            type="number"
            value={median}
            onChange={(e) => {
              setMedian(Number(e.target.value) || 0);
              markInteracted();
            }}
            className="w-full rounded-full border border-card-border px-3 py-1.5 font-mono"
          />
        </label>
        <label className="text-xs text-secondary space-y-1">
          <span className="block font-semibold">Standard deviation</span>
          <input
            type="number"
            value={sd}
            onChange={(e) => {
              setSd(Number(e.target.value) || 0);
              markInteracted();
            }}
            className="w-full rounded-full border border-card-border px-3 py-1.5 font-mono"
          />
        </label>
      </div>

      <div className="rounded-xl bg-muted p-4 space-y-1 font-mono text-sm">
        <p>
          Sk = 3(mean − median) / SD = 3({mean} − {median}) / {sd}
        </p>
        <p className="font-bold text-heading">Sk = {skewness.toFixed(2)}</p>
        <p className="text-body font-sans">
          This distribution is <strong>{classification}</strong>.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 text-sm">
        <div className="rounded-xl border border-card-border p-3">
          <p className="font-semibold text-heading">Mesokurtic</p>
          <p className="text-xs text-secondary">Tails similar to a normal distribution — neither too peaked nor too flat.</p>
        </div>
        <div className="rounded-xl border border-card-border p-3">
          <p className="font-semibold text-heading">Leptokurtic</p>
          <p className="text-xs text-secondary">Fatter tails, sharper peak — more extreme values than normal.</p>
        </div>
        <div className="rounded-xl border border-card-border p-3">
          <p className="font-semibold text-heading">Platykurtic</p>
          <p className="text-xs text-secondary">Thinner tails, flatter peak — fewer extreme values than normal.</p>
        </div>
      </div>
    </div>
  );
}
