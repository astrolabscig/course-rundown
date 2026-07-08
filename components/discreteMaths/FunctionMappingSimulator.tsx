"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

const domainItems = ["a", "b", "c", "d"];
const codomainItems = ["1", "2", "3", "4"];

const presets: Record<string, Record<string, string>> = {
  bijective: { a: "1", b: "2", c: "3", d: "4" },
  "not injective": { a: "1", b: "1", c: "2", d: "3" },
  "not surjective": { a: "1", b: "1", c: "2", d: "2" },
};

export default function FunctionMappingSimulator() {
  const [mapping, setMapping] = useState<Record<string, string>>(presets.bijective);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function pickDomain(d: string) {
    setSelectedDomain(d);
    markInteracted();
  }

  function pickCodomain(c: string) {
    if (selectedDomain) {
      setMapping((m) => ({ ...m, [selectedDomain]: c }));
      setSelectedDomain(null);
      markInteracted();
    }
  }

  const { isTotal, isInjective, isSurjective, isBijective, hit } = useMemo(() => {
    const total = domainItems.every((d) => mapping[d] !== undefined);
    const values = domainItems.map((d) => mapping[d]).filter(Boolean);
    const injective = new Set(values).size === values.length && total;
    const hitSet = new Set(values);
    const surjective = codomainItems.every((c) => hitSet.has(c)) && total;
    return {
      isTotal: total,
      isInjective: injective,
      isSurjective: surjective,
      isBijective: injective && surjective,
      hit: hitSet,
    };
  }, [mapping]);

  return (
    <div className="space-y-4">
      <ExplainerBox title="A function is just an arrow from every input to exactly one output">
        <p>
          Click a letter on the left, then a number on the right, to point that letter's arrow at
          it. A mapping is <strong>injective</strong> (one-to-one) if no two letters share an
          arrow-target, <strong>surjective</strong> (onto) if every number gets hit by at least one
          arrow, and <strong>bijective</strong> if it's both — which is exactly when an{" "}
          <strong>inverse function</strong> exists (mirrors Rosen 2.3, Example 19).
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap gap-1.5">
        {Object.keys(presets).map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => {
              setMapping(presets[name]);
              setSelectedDomain(null);
              markInteracted();
            }}
            className="px-3 py-1.5 rounded-full border border-card-border text-xs font-medium text-body hover:border-accent transition-colors capitalize"
          >
            {name}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-16 py-4">
        <div className="flex flex-col gap-3">
          {domainItems.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => pickDomain(d)}
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-mono text-sm font-bold transition-colors ${
                selectedDomain === d ? "border-accent bg-muted text-accent" : "border-card-border text-heading hover:border-accent"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {codomainItems.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => pickCodomain(c)}
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-mono text-sm font-bold transition-colors ${
                hit.has(c) ? "border-success bg-muted text-success" : "border-card-border text-heading hover:border-accent"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-card-border p-3 space-y-1 text-sm font-mono">
        {domainItems.map((d) => (
          <p key={d} className="text-body">
            f({d}) = {mapping[d] ?? <span className="text-error">undefined</span>}
          </p>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-center">
        <div className={`rounded-lg border p-2 ${isTotal ? "border-success text-success" : "border-error text-error"}`}>
          {isTotal ? "Total ✓" : "Not total ✗"}
        </div>
        <div className={`rounded-lg border p-2 ${isInjective ? "border-success text-success" : "border-error text-error"}`}>
          {isInjective ? "Injective ✓" : "Not injective ✗"}
        </div>
        <div className={`rounded-lg border p-2 ${isSurjective ? "border-success text-success" : "border-error text-error"}`}>
          {isSurjective ? "Surjective ✓" : "Not surjective ✗"}
        </div>
        <div className={`rounded-lg border p-2 ${isBijective ? "border-success text-success" : "border-error text-error"}`}>
          {isBijective ? "Bijective ✓" : "Not bijective ✗"}
        </div>
      </div>

      {isBijective && (
        <div className="rounded-xl bg-muted p-3 text-sm font-mono text-body">
          Inverse f⁻¹: {codomainItems.map((c) => `${c}→${domainItems.find((d) => mapping[d] === c)}`).join(", ")}
        </div>
      )}
    </div>
  );
}
