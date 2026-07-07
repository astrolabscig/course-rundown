"use client";

import { useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

interface YearRow {
  year: string;
  cocoaPrice: number;
  ricePrice: number;
}

const initialRows: YearRow[] = [
  { year: "2009", cocoaPrice: 10, ricePrice: 15 },
  { year: "2010", cocoaPrice: 11, ricePrice: 15 },
  { year: "2011", cocoaPrice: 12, ricePrice: 16 },
  { year: "2012", cocoaPrice: 13, ricePrice: 15 },
];

export default function CPICalculator() {
  const [cocoaQty, setCocoaQty] = useState(20);
  const [riceQty, setRiceQty] = useState(10);
  const [rows, setRows] = useState<YearRow[]>(initialRows);
  const [baseIndex, setBaseIndex] = useState(0);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function updateRow(i: number, field: "cocoaPrice" | "ricePrice", value: number) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));
    markInteracted();
  }

  const basketCosts = rows.map((r) => cocoaQty * r.cocoaPrice + riceQty * r.ricePrice);
  const baseCost = basketCosts[baseIndex];
  const cpis = basketCosts.map((c) => (baseCost > 0 ? (c / baseCost) * 100 : 0));
  const inflationRates = cpis.map((cpi, i) => (i === 0 ? null : ((cpi - cpis[i - 1]) / cpis[i - 1]) * 100));

  return (
    <div className="space-y-4">
      <ExplainerBox title="What is the CPI actually measuring?">
        <p>
          Imagine a fixed shopping basket — say, a set amount of cocoa and rice. Every year you
          price that exact same basket. If it costs more this year than in the base year, prices
          have risen — that&rsquo;s inflation. The Consumer Price Index just turns &ldquo;cost of
          the basket this year&rdquo; into a tidy index number, always 100 in the base year.
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-secondary">Cocoa in basket (bags)</span>
          <input
            type="number"
            value={cocoaQty}
            onChange={(e) => {
              setCocoaQty(Number(e.target.value));
              markInteracted();
            }}
            className="rounded-lg border border-card-border px-2 py-1.5 text-sm font-mono w-28"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-secondary">Rice in basket (bags)</span>
          <input
            type="number"
            value={riceQty}
            onChange={(e) => {
              setRiceQty(Number(e.target.value));
              markInteracted();
            }}
            className="rounded-lg border border-card-border px-2 py-1.5 text-sm font-mono w-28"
          />
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2 text-heading font-semibold border-b border-card-border">Year</th>
              <th className="text-left p-2 text-heading font-semibold border-b border-card-border">Cocoa Gh¢/bag</th>
              <th className="text-left p-2 text-heading font-semibold border-b border-card-border">Rice Gh¢/bag</th>
              <th className="text-left p-2 text-heading font-semibold border-b border-card-border">Basket cost</th>
              <th className="text-left p-2 text-heading font-semibold border-b border-card-border">CPI</th>
              <th className="text-left p-2 text-heading font-semibold border-b border-card-border">Inflation</th>
              <th className="text-left p-2 text-heading font-semibold border-b border-card-border">Base year</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.year} className="border-b border-card-border last:border-0">
                <td className="p-2 font-mono text-body">{r.year}</td>
                <td className="p-2">
                  <input
                    type="number"
                    value={r.cocoaPrice}
                    onChange={(e) => updateRow(i, "cocoaPrice", Number(e.target.value))}
                    className="rounded-lg border border-card-border px-2 py-1 text-sm font-mono w-16"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={r.ricePrice}
                    onChange={(e) => updateRow(i, "ricePrice", Number(e.target.value))}
                    className="rounded-lg border border-card-border px-2 py-1 text-sm font-mono w-16"
                  />
                </td>
                <td className="p-2 font-mono text-body">Gh¢{basketCosts[i].toFixed(0)}</td>
                <td className="p-2 font-mono font-semibold text-heading">{cpis[i].toFixed(1)}</td>
                <td className="p-2 font-mono text-body">
                  {inflationRates[i] === null ? "—" : `${inflationRates[i]!.toFixed(1)}%`}
                </td>
                <td className="p-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBaseIndex(i);
                      markInteracted();
                    }}
                    className={`px-2 py-1 rounded-full text-xs font-medium border transition-colors ${
                      baseIndex === i
                        ? "bg-accent text-white border-accent"
                        : "bg-white text-body border-card-border hover:border-accent"
                    }`}
                  >
                    {baseIndex === i ? "Base ✓" : "Set as base"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-secondary">
        CPI = (cost of basket this year ÷ cost of basket in base year) × 100. Inflation rate =
        percentage change in CPI from the previous year.
      </p>
    </div>
  );
}
