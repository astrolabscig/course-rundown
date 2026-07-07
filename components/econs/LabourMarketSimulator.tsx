"use client";

import { useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

type ScenarioId = "equilibrium" | "real-wage" | "demand-deficient" | "frictional";

interface Scenario {
  id: ScenarioId;
  label: string;
  wageAbove: number; // how far the actual wage sits above the market-clearing wage (0 = at equilibrium)
  demandShift: number; // negative = ADL curve shifted left
  narration: string;
}

const scenarios: Scenario[] = [
  {
    id: "equilibrium",
    label: "Equilibrium (natural) unemployment",
    wageAbove: 0,
    demandShift: 0,
    narration:
      "The wage sits right where aggregate labour supply meets aggregate labour demand. Any unemployment left over here is frictional/structural, not caused by a wage mismatch.",
  },
  {
    id: "real-wage",
    label: "Real-wage (classical) unemployment",
    wageAbove: 22,
    demandShift: 0,
    narration:
      "Trade unions or a minimum wage push the wage above the market-clearing level. More people want jobs at that wage than firms want to hire — a gap opens up between supply and demand.",
  },
  {
    id: "demand-deficient",
    label: "Demand-deficient (cyclical) unemployment",
    wageAbove: 0,
    demandShift: -28,
    narration:
      "Aggregate demand for labour falls (e.g. in a recession) but the wage rate doesn't fall to match. Firms now demand fewer workers at the old wage — unemployment rises.",
  },
  {
    id: "frictional",
    label: "Frictional / structural (search) unemployment",
    wageAbove: 0,
    demandShift: 0,
    narration:
      "The market actually clears — supply equals demand at this wage — but some workers are still between jobs, or their skills don't match available vacancies. This unemployment doesn't show up as a gap between the curves at all.",
  },
];

export default function LabourMarketSimulator() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("equilibrium");
  const [stockU, setStockU] = useState(240);
  const [outflowF, setOutflowF] = useState(40);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function selectScenario(id: ScenarioId) {
    setScenarioId(id);
    markInteracted();
  }

  const scenario = scenarios.find((s) => s.id === scenarioId)!;

  // Baseline supply/demand lines; wageAbove and demandShift nudge things for the diagram.
  const supplyY1 = 55, supplyY2 = 15; // ASL: upward sloping
  const demandBaseY1 = 15, demandBaseY2 = 55; // ADL: downward sloping
  const demandY1 = demandBaseY1 - scenario.demandShift * 0.3;
  const demandY2 = demandBaseY2 - scenario.demandShift * 0.3;
  const equilibriumWageY = 35; // approx crossing point for the baseline curves
  const actualWageY = equilibriumWageY - scenario.wageAbove * 0.5;

  const duration = outflowF > 0 ? (stockU / outflowF).toFixed(2) : "—";

  return (
    <div className="space-y-4">
      <ExplainerBox title="Why doesn't the labour market just always clear itself?">
        <p>
          In theory, wages should fall until every willing worker has a job. In practice, wages
          are often &ldquo;sticky&rdquo; — unions, minimum wages, and contracts stop them falling
          freely — so a gap between how many people want jobs and how many firms want to hire can
          persist. Toggle between the scenarios below to see where that gap comes from each time.
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap gap-2">
        {scenarios.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => selectScenario(s.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              scenarioId === s.id ? "bg-accent text-white" : "bg-muted text-body hover:text-accent"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-card-border bg-muted p-4">
        <svg viewBox="0 0 100 70" className="w-full h-48">
          <line x1="5" y1="5" x2="5" y2="65" stroke="var(--card-border)" strokeWidth="0.5" />
          <line x1="5" y1="65" x2="95" y2="65" stroke="var(--card-border)" strokeWidth="0.5" />
          <line x1="10" y1={supplyY1} x2="90" y2={supplyY2} stroke="var(--accent)" strokeWidth="1.2" />
          <text x="91" y={supplyY2} fontSize="4" fill="var(--accent)">ASL</text>
          <line x1="10" y1={demandY1} x2="90" y2={demandY2} stroke="var(--accent-warm)" strokeWidth="1.2" />
          <text x="91" y={demandY2} fontSize="4" fill="var(--accent-warm)">ADL</text>
          <line x1="5" y1={actualWageY} x2="95" y2={actualWageY} stroke="var(--error)" strokeWidth="0.7" strokeDasharray="2,1" />
          <text x="6" y={actualWageY - 1.5} fontSize="4" fill="var(--error)">Wage rate</text>
          <text x="2" y="4" fontSize="4" fill="var(--secondary)" transform="rotate(-90 2 4)">Wage</text>
          <text x="80" y="70" fontSize="4" fill="var(--secondary)">No. of workers</text>
        </svg>
      </div>

      <div className="rounded-xl bg-card border border-card-border p-4">
        <p className="font-semibold text-heading mb-1">{scenario.label}</p>
        <p className="text-sm text-body">{scenario.narration}</p>
      </div>

      <div className="rounded-xl bg-muted p-4 space-y-2">
        <p className="text-sm font-semibold text-heading">Duration of unemployment calculator</p>
        <p className="text-xs text-secondary">DU = U / F — the stock of unemployed divided by the outflow rate.</p>
        <div className="flex flex-wrap gap-3 items-end">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-secondary">Stock unemployed (U)</span>
            <input
              type="number"
              value={stockU}
              onChange={(e) => {
                setStockU(Number(e.target.value));
                markInteracted();
              }}
              className="rounded-lg border border-card-border px-2 py-1.5 text-sm font-mono w-32"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-secondary">Outflow per period (F)</span>
            <input
              type="number"
              value={outflowF}
              onChange={(e) => {
                setOutflowF(Number(e.target.value));
                markInteracted();
              }}
              className="rounded-lg border border-card-border px-2 py-1.5 text-sm font-mono w-32"
            />
          </label>
          <p className="font-mono text-sm text-heading font-semibold pb-1.5">DU = {duration} periods</p>
        </div>
      </div>
    </div>
  );
}
