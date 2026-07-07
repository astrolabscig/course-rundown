"use client";

import { useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

export default function CircularFlowSimulator() {
  const [savings, setSavings] = useState(20);
  const [taxes, setTaxes] = useState(25);
  const [imports, setImports] = useState(15);
  const [investment, setInvestment] = useState(20);
  const [govSpending, setGovSpending] = useState(25);
  const [exports, setExports] = useState(20);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function slider(
    label: string,
    value: number,
    setValue: (v: number) => void,
    color: string
  ) {
    return (
      <div>
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="font-medium text-heading">{label}</span>
          <span className={`font-mono font-semibold ${color}`}>{value}</span>
        </div>
        <input
          type="range"
          min={0}
          max={60}
          value={value}
          onChange={(e) => {
            setValue(Number(e.target.value));
            markInteracted();
          }}
          className="w-full accent-[var(--accent)]"
        />
      </div>
    );
  }

  const withdrawals = savings + taxes + imports;
  const injections = investment + govSpending + exports;
  const gap = injections - withdrawals;
  const state = gap > 0 ? "expansion" : gap < 0 ? "contraction" : "equilibrium";

  return (
    <div className="space-y-4">
      <ExplainerBox title="Why does money leaving and entering the flow matter?">
        <p>
          Picture money constantly moving in a loop between households and firms. Some of it
          leaks out along the way — into savings, taxes, and imports (withdrawals) — while fresh
          money is injected back in from investment, government spending, and exports
          (injections). If more comes in than leaks out, the whole loop grows (expansion). If
          more leaks out than comes in, the loop shrinks (contraction).
        </p>
      </ExplainerBox>

      <div className="rounded-2xl border border-card-border bg-muted p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10">
          <div className="rounded-xl border-2 border-accent bg-white px-5 py-4 text-center">
            <p className="font-semibold text-heading">Households</p>
          </div>
          <div className="text-2xl text-secondary">⇄</div>
          <div className="rounded-xl border-2 border-accent-warm bg-white px-5 py-4 text-center">
            <p className="font-semibold text-heading">Firms</p>
          </div>
        </div>
        <p className="text-center text-xs text-secondary mt-3">The inner flow of spending and income</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-error-bg p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-error">Withdrawals (W) — leak out</p>
          {slider("Savings (S)", savings, setSavings, "text-error")}
          {slider("Net taxes (T)", taxes, setTaxes, "text-error")}
          {slider("Imports (M)", imports, setImports, "text-error")}
          <p className="text-sm font-mono font-semibold text-heading">Total W = {withdrawals}</p>
        </div>
        <div className="rounded-xl bg-accent-warm-bg p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-warm">Injections (J) — flow back in</p>
          {slider("Investment (I)", investment, setInvestment, "text-accent-warm")}
          {slider("Government spending (G)", govSpending, setGovSpending, "text-accent-warm")}
          {slider("Exports (X)", exports, setExports, "text-accent-warm")}
          <p className="text-sm font-mono font-semibold text-heading">Total J = {injections}</p>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-card-border p-4 space-y-2">
        <p className="font-mono text-sm text-body">
          J − W = {injections} − {withdrawals} = <span className="font-semibold">{gap}</span>
        </p>
        {state === "equilibrium" && (
          <p className="text-sm text-body">
            <span className="font-semibold text-heading">Equilibrium.</span> Injections equal
            withdrawals — national income has no tendency to change.
          </p>
        )}
        {state === "expansion" && (
          <p className="text-sm text-body">
            <span className="font-semibold text-success">Injections exceed withdrawals →
            expansion.</span> Aggregate demand rises, so: unemployment tends to fall, inflation
            tends to rise, the balance of payments tends to worsen (more imports as incomes
            rise), and there is economic growth.
          </p>
        )}
        {state === "contraction" && (
          <p className="text-sm text-body">
            <span className="font-semibold text-error">Withdrawals exceed injections →
            contraction.</span> Aggregate demand falls, so: unemployment tends to rise, inflation
            pressure eases, the balance of payments tends to improve, and growth slows or
            reverses.
          </p>
        )}
      </div>
    </div>
  );
}
