"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

const domain = [1, 2, 3, 4];

const presets: { label: string; pairs: string }[] = [
  { label: "R1 (reflexive + transitive, not symmetric)", pairs: "1,1 1,2 2,1 2,2 3,4 4,1 4,4" },
  { label: "R2 (symmetric only)", pairs: "1,1 1,2 2,1" },
  { label: "R3 (antisymmetric + transitive)", pairs: "1,1 1,2 1,4 2,2 3,3 4,4" },
  { label: "R6 (empty-ish, vacuously many)", pairs: "3,4" },
];

function parsePairs(text: string): [number, number][] {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((tok) => {
      const [a, b] = tok.split(",").map((s) => Number(s.trim()));
      return [a, b] as [number, number];
    })
    .filter(([a, b]) => domain.includes(a) && domain.includes(b));
}

export default function RelationPropertyChecker() {
  const [pairsInput, setPairsInput] = useState(presets[0].pairs);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const pairs = useMemo(() => parsePairs(pairsInput), [pairsInput]);
  const has = (a: number, b: number) => pairs.some(([x, y]) => x === a && y === b);

  const analysis = useMemo(() => {
    const missingReflexive = domain.filter((a) => !has(a, a));
    const asymmetricPairs = pairs.filter(([a, b]) => a !== b && !has(b, a));
    const notAntisymmetricPairs = pairs.filter(([a, b]) => a !== b && has(b, a));
    const notTransitive: [number, number, number][] = [];
    for (const [a, b] of pairs) {
      for (const [c, d] of pairs) {
        if (b === c && !has(a, d)) notTransitive.push([a, b, d]);
      }
    }
    return {
      reflexive: missingReflexive.length === 0,
      missingReflexive,
      symmetric: asymmetricPairs.length === 0,
      asymmetricPairs,
      antisymmetric: notAntisymmetricPairs.length === 0,
      notAntisymmetricPairs,
      transitive: notTransitive.length === 0,
      notTransitive,
    };
  }, [pairs]);

  function applyPreset(p: string) {
    setPairsInput(p);
    markInteracted();
  }

  return (
    <div className="space-y-4">
      <ExplainerBox title="A relation's properties are just pattern-checks over its pairs">
        <p>
          A relation on a set is just a collection of ordered pairs. <strong>Reflexive</strong>{" "}
          means every element relates to itself. <strong>Symmetric</strong> means the pairs always
          come in (a,b)/(b,a) matching sets. <strong>Antisymmetric</strong> means (a,b) and (b,a)
          can only both appear if a=b. <strong>Transitive</strong> means whenever a relates to b
          and b relates to c, a must also relate to c directly (Rosen 9.1).
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => applyPreset(p.pairs)}
            className="px-3 py-1.5 rounded-full border border-card-border text-xs font-medium text-body hover:border-accent transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="space-y-1">
        <p className="text-xs text-secondary">
          Relation on {"{"}1,2,3,4{"}"}, as space-separated pairs like <code>1,2 2,3</code>:
        </p>
        <input
          value={pairsInput}
          onChange={(e) => {
            setPairsInput(e.target.value);
            markInteracted();
          }}
          className="w-full rounded-full border border-card-border px-4 py-2 text-sm font-mono"
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className={`rounded-lg border p-3 text-sm ${analysis.reflexive ? "border-success bg-muted" : "border-error bg-muted"}`}>
          <p className={`font-semibold ${analysis.reflexive ? "text-success" : "text-error"}`}>
            {analysis.reflexive ? "Reflexive ✓" : "Not reflexive ✗"}
          </p>
          {!analysis.reflexive && (
            <p className="text-xs text-secondary font-mono">missing: {analysis.missingReflexive.map((a) => `(${a},${a})`).join(", ")}</p>
          )}
        </div>
        <div className={`rounded-lg border p-3 text-sm ${analysis.symmetric ? "border-success bg-muted" : "border-error bg-muted"}`}>
          <p className={`font-semibold ${analysis.symmetric ? "text-success" : "text-error"}`}>
            {analysis.symmetric ? "Symmetric ✓" : "Not symmetric ✗"}
          </p>
          {!analysis.symmetric && (
            <p className="text-xs text-secondary font-mono">
              {analysis.asymmetricPairs.map(([a, b]) => `(${a},${b}) has no matching (${b},${a})`).join("; ")}
            </p>
          )}
        </div>
        <div className={`rounded-lg border p-3 text-sm ${analysis.antisymmetric ? "border-success bg-muted" : "border-error bg-muted"}`}>
          <p className={`font-semibold ${analysis.antisymmetric ? "text-success" : "text-error"}`}>
            {analysis.antisymmetric ? "Antisymmetric ✓" : "Not antisymmetric ✗"}
          </p>
          {!analysis.antisymmetric && (
            <p className="text-xs text-secondary font-mono">
              both ({analysis.notAntisymmetricPairs[0]?.[0]},{analysis.notAntisymmetricPairs[0]?.[1]}) and reverse present, with a≠b
            </p>
          )}
        </div>
        <div className={`rounded-lg border p-3 text-sm ${analysis.transitive ? "border-success bg-muted" : "border-error bg-muted"}`}>
          <p className={`font-semibold ${analysis.transitive ? "text-success" : "text-error"}`}>
            {analysis.transitive ? "Transitive ✓" : "Not transitive ✗"}
          </p>
          {!analysis.transitive && analysis.notTransitive[0] && (
            <p className="text-xs text-secondary font-mono">
              ({analysis.notTransitive[0][0]},{analysis.notTransitive[0][1]}) and ({analysis.notTransitive[0][1]},
              {analysis.notTransitive[0][2]}) present, but ({analysis.notTransitive[0][0]},{analysis.notTransitive[0][2]}) is missing
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
