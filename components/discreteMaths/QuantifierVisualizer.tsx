"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

const domain = [1, 2, 3, 4];

interface Predicate {
  id: string;
  label: string;
  fn: (x: number, y: number) => boolean;
}

const predicates: Predicate[] = [
  { id: "sum5", label: "x + y = 5", fn: (x, y) => x + y === 5 },
  { id: "less", label: "x < y", fn: (x, y) => x < y },
  { id: "eq", label: "x = y", fn: (x, y) => x === y },
  { id: "bothEven", label: "x and y are both even", fn: (x, y) => x % 2 === 0 && y % 2 === 0 },
];

type Pattern = "AA" | "AE" | "EA" | "EE";

const patterns: { id: Pattern; label: string }[] = [
  { id: "AA", label: "∀x ∀y P(x,y)" },
  { id: "AE", label: "∀x ∃y P(x,y)" },
  { id: "EA", label: "∃x ∀y P(x,y)" },
  { id: "EE", label: "∃x ∃y P(x,y)" },
];

export default function QuantifierVisualizer() {
  const [predId, setPredId] = useState("less");
  const [pattern, setPattern] = useState<Pattern>("AE");
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const pred = predicates.find((p) => p.id === predId)!;

  const grid = useMemo(
    () => domain.map((x) => domain.map((y) => pred.fn(x, y))),
    [pred]
  );

  const { result, explanation } = useMemo(() => {
    const rowSummary = grid.map((row) => row.some(Boolean));
    const rowAll = grid.map((row) => row.every(Boolean));

    if (pattern === "AA") {
      const ok = rowAll.every(Boolean);
      return {
        result: ok,
        explanation: ok
          ? "Every single (x, y) pair in the domain makes P(x,y) true, so the ∀x∀y statement holds."
          : "At least one (x, y) pair makes P(x,y) false, so ∀x∀y P(x,y) is false — one counterexample is enough to kill a ∀ statement.",
      };
    }
    if (pattern === "AE") {
      const ok = rowSummary.every(Boolean);
      return {
        result: ok,
        explanation: ok
          ? "For every x, we can find at least one y (scanning that x's row) that makes P(x,y) true — so ∀x∃y P(x,y) holds."
          : "There is some x whose entire row is false — no y works for that x — so ∀x∃y P(x,y) fails.",
      };
    }
    if (pattern === "EA") {
      const ok = rowAll.some(Boolean);
      return {
        result: ok,
        explanation: ok
          ? "There is some x whose entire row is true — that single x works for every y — so ∃x∀y P(x,y) holds."
          : "No single row is entirely true, meaning no x works for every y, so ∃x∀y P(x,y) fails.",
      };
    }
    const ok = rowSummary.some(Boolean);
    return {
      result: ok,
      explanation: ok
        ? "At least one cell in the whole grid is true, so ∃x∃y P(x,y) holds — one true pair is all it takes."
        : "Every cell in the grid is false, so ∃x∃y P(x,y) fails.",
    };
  }, [grid, pattern]);

  return (
    <div className="space-y-4">
      <ExplainerBox title="Nested quantifiers are just nested loops">
        <p>
          <code>∀x ∃y P(x,y)</code> reads exactly like code: <code>for each x: for some y: check
          P(x,y)</code>. The order of the quantifiers matters enormously — swapping ∀x∃y to ∃x∀y
          can flip a true statement to a false one, because now ONE y has to work for
          every x, instead of each x getting to pick its own y. This visualizer runs the loop for
          you over the domain {"{"}1,2,3,4{"}"} so you can see exactly why (mirrors Rosen 1.5,
          Examples 3 and 6).
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap gap-1.5">
        {predicates.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setPredId(p.id);
              markInteracted();
            }}
            className={`px-3 py-1.5 rounded-full border text-xs font-mono transition-colors ${
              predId === p.id ? "border-accent bg-muted text-accent" : "border-card-border text-body hover:border-accent"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {patterns.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setPattern(p.id);
              markInteracted();
            }}
            className={`px-3 py-1.5 rounded-full border text-xs font-mono transition-colors ${
              pattern === p.id ? "border-accent bg-muted text-accent" : "border-card-border text-body hover:border-accent"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-card-border">
        <table className="w-full text-sm border-collapse text-center">
          <thead>
            <tr>
              <th className="p-2 bg-muted border-b border-r border-card-border font-mono text-xs text-secondary">x \ y</th>
              {domain.map((y) => (
                <th key={y} className="p-2 bg-muted border-b border-card-border font-mono text-heading">
                  {y}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {domain.map((x, i) => (
              <tr key={x} className="border-b border-card-border last:border-0">
                <td className="p-2 border-r border-card-border font-mono text-heading bg-muted">{x}</td>
                {domain.map((y, j) => (
                  <td
                    key={y}
                    className={`p-2 font-mono font-semibold ${grid[i][j] ? "text-success" : "text-error"}`}
                  >
                    {grid[i][j] ? "T" : "F"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`rounded-xl border p-4 space-y-1 ${result ? "border-success bg-muted" : "border-error bg-muted"}`}>
        <p className="text-sm font-semibold text-heading">
          {patterns.find((p) => p.id === pattern)?.label} with P(x,y) = {pred.label} is{" "}
          <span className={result ? "text-success" : "text-error"}>{result ? "TRUE" : "FALSE"}</span>
        </p>
        <p className="text-sm text-body">{explanation}</p>
      </div>
    </div>
  );
}
