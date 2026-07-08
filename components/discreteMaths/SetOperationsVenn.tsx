"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

function parseSet(input: string): string[] {
  const items = input
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return Array.from(new Set(items));
}

export default function SetOperationsVenn() {
  const [universeInput, setUniverseInput] = useState("1,2,3,4,5,6,7,8,9,10");
  const [aInput, setAInput] = useState("1,2,3,4,5");
  const [bInput, setBInput] = useState("4,5,6,7,8");
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const universe = useMemo(() => parseSet(universeInput), [universeInput]);
  const setA = useMemo(() => parseSet(aInput), [aInput]);
  const setB = useMemo(() => parseSet(bInput), [bInput]);

  const { onlyA, onlyB, both, neither, union, intersection, aMinusB, bMinusA, aComplement, bComplement } =
    useMemo(() => {
      const both = setA.filter((x) => setB.includes(x));
      const onlyA = setA.filter((x) => !setB.includes(x));
      const onlyB = setB.filter((x) => !setA.includes(x));
      const union = [...setA, ...setB.filter((x) => !setA.includes(x))];
      const neither = universe.filter((x) => !union.includes(x));
      return {
        onlyA,
        onlyB,
        both,
        neither,
        union,
        intersection: both,
        aMinusB: onlyA,
        bMinusA: onlyB,
        aComplement: universe.filter((x) => !setA.includes(x)),
        bComplement: universe.filter((x) => !setB.includes(x)),
      };
    }, [universe, setA, setB]);

  function renderList(items: string[]) {
    return items.length > 0 ? `{ ${items.join(", ")} }` : "∅ (empty set)";
  }

  return (
    <div className="space-y-4">
      <ExplainerBox title="A Venn diagram is just a picture of which list each item is on">
        <p>
          Every element is either in A only, in B only, in both, or in neither. That's it — every
          set operation (union, intersection, difference, complement) is just a different way of
          asking &ldquo;which of those four regions do I want?&rdquo; Edit the sets below (comma-
          separated) and watch the diagram and the results update live.
        </p>
      </ExplainerBox>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-xs text-secondary space-y-1">
          <span className="font-semibold">Universal set U</span>
          <input
            value={universeInput}
            onChange={(e) => {
              setUniverseInput(e.target.value);
              markInteracted();
            }}
            className="w-full rounded-full border border-card-border px-3 py-1.5 text-sm font-mono"
          />
        </label>
        <label className="text-xs text-secondary space-y-1">
          <span className="font-semibold">Set A</span>
          <input
            value={aInput}
            onChange={(e) => {
              setAInput(e.target.value);
              markInteracted();
            }}
            className="w-full rounded-full border border-card-border px-3 py-1.5 text-sm font-mono"
          />
        </label>
        <label className="text-xs text-secondary space-y-1">
          <span className="font-semibold">Set B</span>
          <input
            value={bInput}
            onChange={(e) => {
              setBInput(e.target.value);
              markInteracted();
            }}
            className="w-full rounded-full border border-card-border px-3 py-1.5 text-sm font-mono"
          />
        </label>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox="0 0 400 240" className="w-full max-w-md mx-auto">
          <rect x="4" y="4" width="392" height="232" rx="12" fill="none" stroke="var(--card-border)" strokeWidth="2" />
          <text x="16" y="24" className="fill-secondary text-[11px] font-mono">U</text>
          <circle cx="160" cy="120" r="90" fill="#4F7CFF" fillOpacity="0.15" stroke="#4F7CFF" strokeWidth="2" />
          <circle cx="240" cy="120" r="90" fill="#FF7A59" fillOpacity="0.15" stroke="#FF7A59" strokeWidth="2" />
          <text x="105" y="45" className="fill-[#4F7CFF] text-sm font-bold">A</text>
          <text x="285" y="45" className="fill-[#FF7A59] text-sm font-bold">B</text>
          <foreignObject x="90" y="80" width="90" height="80">
            <div className="text-[10px] font-mono text-heading text-center leading-tight break-words">
              {onlyA.join(", ")}
            </div>
          </foreignObject>
          <foreignObject x="160" y="80" width="80" height="80">
            <div className="text-[10px] font-mono text-heading text-center leading-tight break-words">
              {both.join(", ")}
            </div>
          </foreignObject>
          <foreignObject x="230" y="80" width="90" height="80">
            <div className="text-[10px] font-mono text-heading text-center leading-tight break-words">
              {onlyB.join(", ")}
            </div>
          </foreignObject>
          <foreignObject x="10" y="190" width="380" height="40">
            <div className="text-[10px] font-mono text-secondary text-center leading-tight break-words">
              outside both: {neither.join(", ") || "(none)"}
            </div>
          </foreignObject>
        </svg>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 text-sm font-mono">
        <div className="rounded-lg border border-card-border p-2.5">
          <span className="text-secondary">A ∪ B = </span>
          <span className="text-heading">{renderList(union)}</span>
        </div>
        <div className="rounded-lg border border-card-border p-2.5">
          <span className="text-secondary">A ∩ B = </span>
          <span className="text-heading">{renderList(intersection)}</span>
        </div>
        <div className="rounded-lg border border-card-border p-2.5">
          <span className="text-secondary">A − B = </span>
          <span className="text-heading">{renderList(aMinusB)}</span>
        </div>
        <div className="rounded-lg border border-card-border p-2.5">
          <span className="text-secondary">B − A = </span>
          <span className="text-heading">{renderList(bMinusA)}</span>
        </div>
        <div className="rounded-lg border border-card-border p-2.5">
          <span className="text-secondary">A&#772; (complement) = </span>
          <span className="text-heading">{renderList(aComplement)}</span>
        </div>
        <div className="rounded-lg border border-card-border p-2.5">
          <span className="text-secondary">B&#772; (complement) = </span>
          <span className="text-heading">{renderList(bComplement)}</span>
        </div>
      </div>
    </div>
  );
}
