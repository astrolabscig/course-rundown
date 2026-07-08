"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { parseLogicExpression, allValuations } from "@/lib/discreteMaths/logicEngine";
import { trackInteract } from "@/lib/track";

const presets = [
  { label: "p ∧ ¬p", expr: "p & ~p" },
  { label: "p ∨ ¬p", expr: "p | ~p" },
  { label: "(p ∨ ¬q) → q", expr: "(p | ~q) -> q" },
  { label: "(p ∨ q) → (p ∧ q)", expr: "(p | q) -> (p & q)" },
  { label: "(p → q) ↔ (¬q → ¬p)", expr: "(p -> q) <-> (~q -> ~p)" },
  { label: "(p → q) → (q → p)", expr: "(p -> q) -> (q -> p)" },
];

const symbolButtons = ["¬", "∧", "∨", "→", "↔", "(", ")"];

export default function TruthTableSimulator() {
  const [expr, setExpr] = useState("(p | ~q) -> q");
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function insertSymbol(sym: string) {
    setExpr((e) => e + sym);
    markInteracted();
  }

  const { rows, varNames, error } = useMemo(() => {
    try {
      const node = parseLogicExpression(expr);
      const names = Array.from(node.vars).sort();
      const valuations = allValuations(names);
      const computed = valuations.map((v) => ({ v, result: node.eval(v) }));
      return { rows: computed, varNames: names, error: null as string | null };
    } catch (e) {
      return { rows: [], varNames: [], error: e instanceof Error ? e.message : "Invalid expression." };
    }
  }, [expr]);

  const isTautology = rows.length > 0 && rows.every((r) => r.result);
  const isContradiction = rows.length > 0 && rows.every((r) => !r.result);

  return (
    <div className="space-y-4">
      <ExplainerBox title="Why bother building a whole table of true/false?">
        <p>
          A compound statement like &ldquo;(p or not-q) implies q&rdquo; might be true for some
          combinations of p and q and false for others — or it might turn out to be true no
          matter what (a <strong>tautology</strong>), or false no matter what (a{" "}
          <strong>contradiction</strong>). A truth table simply checks every possible
          combination, mechanically, so there's no doubt.
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setExpr(p.expr);
              markInteracted();
            }}
            className="px-3 py-1.5 rounded-full border border-card-border text-xs font-mono text-body hover:border-accent transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={expr}
            onChange={(e) => {
              setExpr(e.target.value);
              markInteracted();
            }}
            className="flex-1 min-w-[200px] rounded-full border border-card-border px-4 py-2 text-sm font-mono"
            placeholder="e.g. (p | ~q) -> q"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {symbolButtons.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => insertSymbol(s)}
              className="px-3 py-1 rounded-lg border border-card-border text-sm font-mono text-body hover:border-accent transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
        <p className="text-xs text-secondary">
          Variables are single letters (p, q, r). ASCII also works: ~ or ! for ¬, &amp; for ∧,
          | for ∨, -&gt; for →, &lt;-&gt; for ↔.
        </p>
      </div>

      {error ? (
        <p className="text-sm text-error">{error}</p>
      ) : (
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-xl border border-card-border">
            <table className="w-full text-sm border-collapse text-center">
              <thead>
                <tr>
                  {varNames.map((name) => (
                    <th key={name} className="p-2 text-heading font-semibold border-b border-card-border bg-muted font-mono">
                      {name}
                    </th>
                  ))}
                  <th className="p-2 text-heading font-semibold border-b border-card-border bg-muted font-mono">
                    {expr || "result"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-b border-card-border last:border-0">
                    {varNames.map((name) => (
                      <td key={name} className="p-2 font-mono text-body">
                        {row.v[name] ? "T" : "F"}
                      </td>
                    ))}
                    <td className={`p-2 font-mono font-semibold ${row.result ? "text-success" : "text-error"}`}>
                      {row.result ? "T" : "F"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {isTautology && (
            <p className="text-sm text-success font-medium">
              This is a <strong>tautology</strong> — true for every combination of truth values.
            </p>
          )}
          {isContradiction && (
            <p className="text-sm text-error font-medium">
              This is a <strong>contradiction</strong> — false for every combination of truth
              values.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
