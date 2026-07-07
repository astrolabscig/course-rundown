"use client";

import { useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

type Mode = "demand-pull" | "cost-push";

export default function ADASInflationSimulator() {
  const [mode, setMode] = useState<Mode>("demand-pull");
  const [shifted, setShifted] = useState(false);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function selectMode(m: Mode) {
    setMode(m);
    setShifted(false);
    markInteracted();
  }

  function toggleShift() {
    setShifted((s) => !s);
    markInteracted();
  }

  // Base curve endpoints; shifting AD moves it right/up, shifting AS moves it left/up.
  const asX1 = 20, asY1 = 60, asX2 = 55, asY2 = 10;
  const adX1BaseFrom = 15, adY1Base = 12, adX2Base = 60, adY2Base = 62;

  const adShiftAmount = mode === "demand-pull" && shifted ? 18 : 0;
  const asShiftAmount = mode === "cost-push" && shifted ? -14 : 0;

  const adX1 = adX1BaseFrom + adShiftAmount;
  const adX2 = adX2Base + adShiftAmount;
  const asX1Shifted = asX1 + asShiftAmount;
  const asX2Shifted = asX2 + asShiftAmount;

  return (
    <div className="space-y-4">
      <ExplainerBox title="Two different roads to the same destination: higher prices">
        <p>
          Inflation can come from two different directions. Demand-pull happens when everyone
          wants to buy more than the economy can supply — too much money chasing too few goods.
          Cost-push happens when it simply becomes more expensive for firms to produce anything —
          rising costs get passed on as higher prices, even if demand hasn&rsquo;t changed.
        </p>
      </ExplainerBox>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => selectMode("demand-pull")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            mode === "demand-pull" ? "bg-accent text-white" : "bg-muted text-body hover:text-accent"
          }`}
        >
          Demand-Pull
        </button>
        <button
          type="button"
          onClick={() => selectMode("cost-push")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            mode === "cost-push" ? "bg-accent text-white" : "bg-muted text-body hover:text-accent"
          }`}
        >
          Cost-Push
        </button>
        <button
          type="button"
          onClick={toggleShift}
          className="px-3 py-1.5 rounded-full bg-accent text-white text-xs font-semibold hover:bg-accent-hover transition-colors"
        >
          {shifted ? "Reset" : mode === "demand-pull" ? "Shift AD right →" : "Shift AS left ↑"}
        </button>
      </div>

      <div className="rounded-2xl border border-card-border bg-muted p-4">
        <svg viewBox="0 0 100 70" className="w-full h-48">
          <line x1="10" y1="5" x2="10" y2="65" stroke="var(--card-border)" strokeWidth="0.5" />
          <line x1="10" y1="65" x2="95" y2="65" stroke="var(--card-border)" strokeWidth="0.5" />
          <text x="1" y="10" fontSize="4" fill="var(--secondary)">Price</text>
          <text x="80" y="70" fontSize="4" fill="var(--secondary)">Output</text>

          <line x1={asX1Shifted} y1={asY1} x2={asX2Shifted} y2={asY2} stroke="var(--accent)" strokeWidth="1.2" className="transition-all duration-700" />
          <text x={asX2Shifted + 1} y={asY2} fontSize="4" fill="var(--accent)">AS</text>

          <line x1={adX1} y1={adY1Base} x2={adX2} y2={adY2Base} stroke="var(--accent-warm)" strokeWidth="1.2" className="transition-all duration-700" />
          <text x={adX2 + 1} y={adY2Base} fontSize="4" fill="var(--accent-warm)">AD</text>
        </svg>
      </div>

      <div className="rounded-xl bg-card border border-card-border p-4 text-sm text-body">
        {!shifted ? (
          <p>Starting position: aggregate demand and supply are in equilibrium at the current price level and output.</p>
        ) : mode === "demand-pull" ? (
          <p>
            <span className="font-semibold text-heading">AD shifts right.</span> Causes: war,
            rising exports, rapid industrialisation, or wages/population rising faster than
            output. Result: both the price level AND output tend to rise.
          </p>
        ) : (
          <p>
            <span className="font-semibold text-heading">AS shifts left (up).</span> Causes:
            wage-push, import-price-push, tax-push, or exhaustion of natural resources. Result:
            the price level rises but output tends to FALL — the worst combination for
            policymakers.
          </p>
        )}
      </div>
    </div>
  );
}
