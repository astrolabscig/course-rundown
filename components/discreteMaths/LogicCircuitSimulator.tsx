"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { parseLogicAst, evalAst, astVars, type Ast, type Valuation } from "@/lib/discreteMaths/logicEngine";
import { trackInteract } from "@/lib/track";

const presets = [
  { label: "(p ∧ q) ∨ ¬r", expr: "(p & q) | ~r" },
  { label: "¬(p ∨ q)", expr: "~(p | q)" },
  { label: "(p ∨ q) ∧ ¬(p ∧ q)", expr: "(p | q) & ~(p & q)" },
];

const gateLabel: Record<Ast["kind"], string> = {
  var: "",
  not: "NOT",
  and: "AND",
  or: "OR",
  implies: "IMPLIES",
  iff: "IFF",
};

function GateBox({ node, v }: { node: Ast; v: Valuation }) {
  const result = evalAst(node, v);
  const badge = (
    <span
      className={`shrink-0 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold font-mono ${
        result ? "bg-success text-white" : "bg-error text-white"
      }`}
    >
      {result ? "T" : "F"}
    </span>
  );

  if (node.kind === "var") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-card-border bg-card px-3 py-1.5">
        <span className="font-mono text-sm text-heading">{node.name}</span>
        {badge}
      </div>
    );
  }

  const children = node.kind === "not" ? [node.child] : [node.left, node.right];

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col gap-1.5">
        {children.map((child, i) => (
          <GateBox key={i} node={child} v={v} />
        ))}
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="rounded-lg border-2 border-accent bg-muted px-2 py-1 text-[11px] font-bold text-accent whitespace-nowrap">
          {gateLabel[node.kind]}
        </div>
      </div>
      <div className="flex items-center">{badge}</div>
    </div>
  );
}

export default function LogicCircuitSimulator() {
  const [expr, setExpr] = useState("(p & q) | ~r");
  const [values, setValues] = useState<Valuation>({ p: true, q: false, r: true });
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const { ast, vars, error } = useMemo(() => {
    try {
      const parsed = parseLogicAst(expr);
      return { ast: parsed, vars: Array.from(astVars(parsed)).sort(), error: null as string | null };
    } catch (e) {
      return { ast: null, vars: [] as string[], error: e instanceof Error ? e.message : "Invalid expression." };
    }
  }, [expr]);

  function toggleVar(name: string) {
    setValues((v) => ({ ...v, [name]: !v[name] }));
    markInteracted();
  }

  return (
    <div className="space-y-4">
      <ExplainerBox title="A compound proposition is just wired-up logic gates">
        <p>
          Every ∧ is an AND gate, every ∨ is an OR gate, every ¬ is a NOT gate — this is exactly
          how a computer&rsquo;s digital circuits (and every <code>if</code> condition you&rsquo;ve
          ever written) are built underneath. Flip the input switches below and watch the true/false
          &ldquo;signal&rdquo; propagate through the gates to the final output on the right, just
          like Rosen&rsquo;s worked combinatorial-circuit examples (Section 1.2).
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

      <input
        value={expr}
        onChange={(e) => {
          setExpr(e.target.value);
          markInteracted();
        }}
        className="w-full rounded-full border border-card-border px-4 py-2 text-sm font-mono"
        placeholder="e.g. (p & q) | ~r"
      />

      {error ? (
        <p className="text-sm text-error">{error}</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {vars.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => toggleVar(name)}
                className="flex items-center gap-2 rounded-full border border-card-border px-3 py-1.5 text-sm font-mono hover:border-accent transition-colors"
              >
                {name} =
                <span className={values[name] ? "text-success font-semibold" : "text-error font-semibold"}>
                  {values[name] ? "T" : "F"}
                </span>
              </button>
            ))}
            <span className="text-xs text-secondary self-center">Click an input to flip it.</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-card-border bg-background p-4">
            {ast && <GateBox node={ast} v={values} />}
          </div>
        </>
      )}
    </div>
  );
}
