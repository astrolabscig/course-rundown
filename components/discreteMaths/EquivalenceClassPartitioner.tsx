"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

const colors = ["#4F7CFF", "#FF7A59", "#2FA86A", "#9B59B6", "#E0455A", "#E0A930"];

export default function EquivalenceClassPartitioner() {
  const [mode, setMode] = useState<"mod" | "length">("mod");
  const [modN, setModN] = useState(4);
  const [words, setWords] = useState("cat,dog,fish,bird,ox,ant,owl,bear");
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const classes = useMemo(() => {
    if (mode === "mod") {
      const domain = Array.from({ length: 12 }, (_, i) => i);
      const groups = new Map<number, number[]>();
      for (const n of domain) {
        const key = ((n % modN) + modN) % modN;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(n);
      }
      return Array.from(groups.entries())
        .sort(([a], [b]) => a - b)
        .map(([key, items]) => ({ label: `[${key}] (n ≡ ${key} mod ${modN})`, items: items.map(String) }));
    }
    const items = words
      .split(",")
      .map((w) => w.trim())
      .filter(Boolean);
    const groups = new Map<number, string[]>();
    for (const w of items) {
      const key = w.length;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(w);
    }
    return Array.from(groups.entries())
      .sort(([a], [b]) => a - b)
      .map(([key, group]) => ({ label: `length = ${key}`, items: group }));
  }, [mode, modN, words]);

  return (
    <div className="space-y-4">
      <ExplainerBox title="An equivalence relation always slices a set into non-overlapping groups">
        <p>
          Whenever a relation is reflexive, symmetric, AND transitive, it automatically partitions
          the whole set into <strong>equivalence classes</strong> — every element lands in exactly
          one group, and everything inside a group is &ldquo;equivalent&rdquo; to everything else
          in it. &ldquo;Same remainder mod n&rdquo; and &ldquo;same string length&rdquo; are two
          classic examples (Rosen 9.5, Examples 8 &amp; 9).
        </p>
      </ExplainerBox>

      <div className="flex gap-1.5">
        {(["mod", "length"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              markInteracted();
            }}
            className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
              mode === m ? "border-accent bg-muted text-accent" : "border-card-border text-body hover:border-accent"
            }`}
          >
            {m === "mod" ? "Congruence mod n" : "Same string length"}
          </button>
        ))}
      </div>

      {mode === "mod" ? (
        <label className="flex items-center gap-2 text-sm text-secondary">
          n =
          <input
            type="number"
            min={2}
            max={6}
            value={modN}
            onChange={(e) => {
              setModN(Math.max(2, Math.min(6, Number(e.target.value) || 2)));
              markInteracted();
            }}
            className="w-16 rounded-full border border-card-border px-2 py-1 font-mono"
          />
          <span className="text-xs">(partitions the integers 0-11)</span>
        </label>
      ) : (
        <input
          value={words}
          onChange={(e) => {
            setWords(e.target.value);
            markInteracted();
          }}
          className="w-full rounded-full border border-card-border px-4 py-2 text-sm font-mono"
        />
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {classes.map((c, i) => (
          <div key={c.label} className="rounded-xl border-2 p-3 space-y-1" style={{ borderColor: colors[i % colors.length] }}>
            <p className="text-xs font-bold font-mono" style={{ color: colors[i % colors.length] }}>
              {c.label}
            </p>
            <p className="text-sm font-mono text-body">{"{ " + c.items.join(", ") + " }"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
