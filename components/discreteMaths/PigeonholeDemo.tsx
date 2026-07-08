"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

const presets = [
  { label: "Sock drawer: 3 socks, 2 colors", pigeons: 3, holes: 2 },
  { label: "Birthday problem: 367 people, 366 days", pigeons: 367, holes: 366 },
  { label: "Custom", pigeons: 10, holes: 4 },
];

export default function PigeonholeDemo() {
  const [pigeons, setPigeons] = useState(10);
  const [holes, setHoles] = useState(4);
  const [shown, setShown] = useState(0);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const displayHoles = Math.min(holes, 20);
  const counts = useMemo(() => {
    const c = Array(displayHoles).fill(0);
    for (let i = 0; i < Math.min(shown, pigeons); i++) c[i % displayHoles]++;
    return c;
  }, [shown, pigeons, displayHoles]);

  const guaranteed = Math.ceil(pigeons / holes);
  const maxInAnyHole = Math.max(...counts, 0);

  function applyPreset(p: (typeof presets)[number]) {
    setPigeons(p.pigeons);
    setHoles(p.holes);
    setShown(0);
    markInteracted();
  }

  return (
    <div className="space-y-4">
      <ExplainerBox title="If you have more pigeons than holes, some hole gets crowded">
        <p>
          The Pigeonhole Principle: if you place P pigeons into H holes and P &gt; H, at least one
          hole must contain more than one pigeon — no clever arrangement can avoid it. More
          precisely, some hole must contain at least ⌈P/H⌉ pigeons. Drop pigeons one at a time
          below (spread as evenly as possible — the BEST case) and watch a hole still get crowded
          once you run out of room (Rosen 6.2, Example 1).
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-full border border-card-border text-xs font-medium text-body hover:border-accent transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-secondary">
          Pigeons =
          <input
            type="number"
            min={1}
            max={1000}
            value={pigeons}
            onChange={(e) => {
              setPigeons(Math.max(1, Number(e.target.value) || 1));
              setShown(0);
              markInteracted();
            }}
            className="w-20 rounded-full border border-card-border px-2 py-1 font-mono"
          />
        </label>
        <label className="flex items-center gap-2 text-xs text-secondary">
          Holes =
          <input
            type="number"
            min={1}
            max={999}
            value={holes}
            onChange={(e) => {
              setHoles(Math.max(1, Number(e.target.value) || 1));
              setShown(0);
              markInteracted();
            }}
            className="w-20 rounded-full border border-card-border px-2 py-1 font-mono"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        {counts.map((c, i) => (
          <div
            key={i}
            className={`flex flex-col items-center justify-center rounded-lg border-2 min-w-[44px] h-14 px-2 font-mono text-sm ${
              c >= guaranteed ? "border-error bg-muted text-error font-bold" : "border-card-border text-heading"
            }`}
          >
            <span className="text-[10px] text-secondary">hole {i + 1}</span>
            {c}
          </div>
        ))}
        {holes > displayHoles && <span className="text-xs text-secondary self-center">(+{holes - displayHoles} more holes not shown)</span>}
      </div>

      <button
        type="button"
        onClick={() => {
          setShown((s) => Math.min(pigeons, s + Math.max(1, Math.floor(pigeons / 20))));
          markInteracted();
        }}
        disabled={shown >= pigeons}
        className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Drop more pigeons ({Math.min(shown, pigeons)}/{pigeons} placed)
      </button>

      <div className="rounded-xl bg-muted p-4 text-sm text-body">
        With {pigeons} pigeons in {holes} holes, the pigeonhole principle guarantees at least one
        hole has ≥ ⌈{pigeons}/{holes}⌉ = <strong>{guaranteed}</strong> pigeons.
        {shown >= pigeons && (
          <> Even spreading them as evenly as possible, the fullest hole ended up with <strong>{maxInAnyHole}</strong>.</>
        )}
      </div>
    </div>
  );
}
