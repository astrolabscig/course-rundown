"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

const denominations = [
  { value: 25, name: "quarter" },
  { value: 10, name: "dime" },
  { value: 5, name: "nickel" },
  { value: 1, name: "penny" },
];

interface Pick {
  coin: number;
  name: string;
  remainingBefore: number;
  remainingAfter: number;
}

function greedyChange(cents: number): Pick[] {
  let remaining = cents;
  const picks: Pick[] = [];
  for (const d of denominations) {
    while (remaining >= d.value) {
      picks.push({ coin: d.value, name: d.name, remainingBefore: remaining, remainingAfter: remaining - d.value });
      remaining -= d.value;
    }
  }
  return picks;
}

export default function GreedyCoinChangeSimulator() {
  const [cents, setCents] = useState(67);
  const [shown, setShown] = useState(1);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const picks = useMemo(() => greedyChange(cents), [cents]);
  const clampedShown = Math.min(shown, picks.length);
  const totals = useMemo(() => {
    const t: Record<number, number> = {};
    picks.slice(0, clampedShown).forEach((p) => (t[p.coin] = (t[p.coin] ?? 0) + 1));
    return t;
  }, [picks, clampedShown]);

  return (
    <div className="space-y-4">
      <ExplainerBox title="Greedy = always grab the biggest piece that still fits">
        <p>
          The greedy change-making algorithm never plans ahead — at every step it just picks the
          largest coin that doesn't overshoot the remaining amount. For US-style coins (25, 10, 5,
          1) this happens to always produce the fewest possible coins, though greedy algorithms
          don't always guarantee the optimal answer for every possible coin system (mirrors Rosen
          3.1, Example 6).
        </p>
      </ExplainerBox>

      <label className="flex items-center gap-2 text-sm text-secondary">
        Amount (cents) =
        <input
          type="number"
          min={0}
          max={999}
          value={cents}
          onChange={(e) => {
            setCents(Math.max(0, Math.min(999, Number(e.target.value) || 0)));
            setShown(1);
            markInteracted();
          }}
          className="w-24 rounded-full border border-card-border px-3 py-1 font-mono"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        {picks.slice(0, clampedShown).map((p, i) => (
          <div key={i} className="flex flex-col items-center rounded-lg border-2 border-accent bg-muted px-3 py-2 font-mono text-xs">
            <span className="font-bold text-heading">{p.coin}¢</span>
            <span className="text-secondary capitalize">{p.name}</span>
          </div>
        ))}
      </div>

      {picks[clampedShown - 1] && (
        <div className="rounded-xl bg-muted p-4 text-sm text-body">
          Remaining {picks[clampedShown - 1].remainingBefore}¢ → largest coin that fits is a{" "}
          {picks[clampedShown - 1].name} ({picks[clampedShown - 1].coin}¢) → {picks[clampedShown - 1].remainingAfter}¢ left.
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          setShown((s) => Math.min(picks.length, s + 1));
          markInteracted();
        }}
        disabled={clampedShown >= picks.length}
        className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Pick next coin
      </button>

      {clampedShown >= picks.length && picks.length > 0 && (
        <div className="rounded-xl border border-success bg-muted p-4 text-sm text-body">
          Total: {Object.entries(totals).map(([coin, count]) => `${count} ${denominations.find((d) => d.value === Number(coin))?.name}${count > 1 ? "s" : ""}`).join(", ")} — {picks.length} coins altogether.
        </div>
      )}
    </div>
  );
}
