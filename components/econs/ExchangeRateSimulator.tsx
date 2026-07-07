"use client";

import { useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

type ScenarioId = "none" | "demand-up" | "supply-down";

const scenarios: {
  id: ScenarioId;
  label: string;
  demandShift: number;
  supplyShift: number;
  narration: string;
}[] = [
  {
    id: "none",
    label: "Starting equilibrium",
    demandShift: 0,
    supplyShift: 0,
    narration: "Demand and supply of dollars are in balance — this sets today's exchange rate.",
  },
  {
    id: "demand-up",
    label: "Ghana's demand for $ rises",
    demandShift: 14,
    supplyShift: 0,
    narration:
      "More Ghanaians want to buy dollars (e.g. to import more, or because domestic inflation is higher than in the US). Demand for $ shifts right: the dollar appreciates, and the cedi depreciates — more cedis are now needed to buy $1.",
  },
  {
    id: "supply-down",
    label: "US supply of $ falls",
    demandShift: 0,
    supplyShift: -14,
    narration:
      "Fewer dollars are supplied onto the market (e.g. Americans buy fewer Ghanaian exports). Supply of $ shifts left: dollars become scarcer, so the dollar appreciates and the cedi depreciates further.",
  },
];

export default function ExchangeRateSimulator() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("none");
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

  const demandX1 = 15 + scenario.demandShift, demandY1 = 60;
  const demandX2 = 70 + scenario.demandShift, demandY2 = 10;
  const supplyX1 = 15 + scenario.supplyShift, supplyY1 = 10;
  const supplyX2 = 70 + scenario.supplyShift, supplyY2 = 60;

  return (
    <div className="space-y-4">
      <ExplainerBox title="Why does the exchange rate move at all?">
        <p>
          Under a floating exchange rate, the cedi&rsquo;s price against the dollar is set purely
          by demand and supply — just like the price of anything else. When people want more
          dollars than are being offered, the dollar gets more expensive (appreciates), and the
          cedi buys less of it (depreciates). Try the scenarios below to see the diagram move.
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
          <line x1="10" y1="5" x2="10" y2="65" stroke="var(--card-border)" strokeWidth="0.5" />
          <line x1="10" y1="65" x2="95" y2="65" stroke="var(--card-border)" strokeWidth="0.5" />
          <text x="0" y="8" fontSize="4" fill="var(--secondary)">¢ per $</text>
          <text x="78" y="70" fontSize="4" fill="var(--secondary)">Quantity of $</text>

          <line x1={demandX1} y1={demandY1} x2={demandX2} y2={demandY2} stroke="var(--accent)" strokeWidth="1.2" className="transition-all duration-700" />
          <text x={demandX2 + 1} y={demandY2} fontSize="4" fill="var(--accent)">D ($)</text>

          <line x1={supplyX1} y1={supplyY1} x2={supplyX2} y2={supplyY2} stroke="var(--accent-warm)" strokeWidth="1.2" className="transition-all duration-700" />
          <text x={supplyX2 + 1} y={supplyY2} fontSize="4" fill="var(--accent-warm)">S ($)</text>
        </svg>
      </div>

      <div className="rounded-xl bg-card border border-card-border p-4 text-sm text-body">
        <p>{scenario.narration}</p>
      </div>
    </div>
  );
}
