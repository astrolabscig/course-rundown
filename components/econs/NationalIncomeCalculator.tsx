"use client";

import { useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

function useInteract() {
  const ref = useRef(false);
  return () => {
    if (!ref.current) {
      ref.current = true;
      trackInteract();
    }
  };
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-secondary">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded-lg border border-card-border px-2 py-1.5 text-sm font-mono w-full"
      />
    </label>
  );
}

function NominalRealGdp() {
  const markInteracted = useInteract();
  const [p1a, setP1a] = useState(1);
  const [q1a, setQ1a] = useState(10);
  const [p1b, setP1b] = useState(10);
  const [q1b, setQ1b] = useState(3);
  const [p2a, setP2a] = useState(2);
  const [q2a, setQ2a] = useState(15);
  const [p2b, setP2b] = useState(15);
  const [q2b, setQ2b] = useState(4);

  function onAny(v: number, setter: (v: number) => void) {
    setter(v);
    markInteracted();
  }

  const nominalYear1 = p1a * q1a + p1b * q1b;
  const nominalYear2 = p2a * q2a + p2b * q2b;
  const realYear1 = p1a * q1a + p1b * q1b; // base year, so nominal = real
  const realYear2 = p1a * q2a + p1b * q2b; // year 2 quantities priced at year-1 (base) prices

  return (
    <div className="space-y-4">
      <p className="text-sm text-body">
        Two goods, two years. Year 1 is the <strong>base year</strong>. Fill in prices (P) and
        quantities (Q) for each good in each year.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-muted p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Year 1 (base year)</p>
          <div className="grid grid-cols-2 gap-2">
            <NumberInput label="Good A price" value={p1a} onChange={(v) => onAny(v, setP1a)} />
            <NumberInput label="Good A qty" value={q1a} onChange={(v) => onAny(v, setQ1a)} />
            <NumberInput label="Good B price" value={p1b} onChange={(v) => onAny(v, setP1b)} />
            <NumberInput label="Good B qty" value={q1b} onChange={(v) => onAny(v, setQ1b)} />
          </div>
        </div>
        <div className="rounded-xl bg-muted p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Year 2</p>
          <div className="grid grid-cols-2 gap-2">
            <NumberInput label="Good A price" value={p2a} onChange={(v) => onAny(v, setP2a)} />
            <NumberInput label="Good A qty" value={q2a} onChange={(v) => onAny(v, setQ2a)} />
            <NumberInput label="Good B price" value={p2b} onChange={(v) => onAny(v, setP2b)} />
            <NumberInput label="Good B qty" value={q2b} onChange={(v) => onAny(v, setQ2b)} />
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-card border border-card-border p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary mb-1">Nominal GDP</p>
          <p className="font-mono text-sm text-body">Year 1: ${nominalYear1.toFixed(2)}</p>
          <p className="font-mono text-sm text-body">Year 2: ${nominalYear2.toFixed(2)}</p>
          <p className="text-xs text-secondary mt-1">Each year's own prices × that year's quantities.</p>
        </div>
        <div className="rounded-xl bg-card border border-card-border p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary mb-1">Real GDP (base-year prices)</p>
          <p className="font-mono text-sm text-body">Year 1: ${realYear1.toFixed(2)}</p>
          <p className="font-mono text-sm text-body">Year 2: ${realYear2.toFixed(2)}</p>
          <p className="text-xs text-secondary mt-1">Year 2's quantities priced at Year 1's (base) prices.</p>
        </div>
      </div>
      <div className="rounded-xl bg-accent-warm-bg p-4 text-sm text-heading">
        Nominal GDP grew by{" "}
        <span className="font-semibold">{(((nominalYear2 - nominalYear1) / nominalYear1) * 100).toFixed(1)}%</span>,
        but real GDP only grew by{" "}
        <span className="font-semibold">{(((realYear2 - realYear1) / realYear1) * 100).toFixed(1)}%</span>. The
        gap between them is purely due to price changes, not more stuff actually being produced.
      </div>
    </div>
  );
}

function GdpToNnpWaterfall() {
  const markInteracted = useInteract();
  const [gdpMarketPrice, setGdp] = useState(1000);
  const [nfia, setNfia] = useState(20);
  const [indirectTaxes, setIndirectTaxes] = useState(80);
  const [subsidies, setSubsidies] = useState(30);
  const [depreciation, setDepreciation] = useState(60);

  function onAny(v: number, setter: (v: number) => void) {
    setter(v);
    markInteracted();
  }

  const gnpMarketPrice = gdpMarketPrice + nfia;
  const gnpFactorCost = gnpMarketPrice - indirectTaxes + subsidies;
  const nnpFactorCost = gnpFactorCost - depreciation;

  const steps = [
    { label: "GDP at market prices", value: gdpMarketPrice, note: "Output method total" },
    { label: "+ Net factor income from abroad", value: nfia, note: "Income earned by citizens abroad − income earned by foreigners here" },
    { label: "= GNP at market prices", value: gnpMarketPrice, note: null },
    { label: "− Indirect taxes, + Subsidies", value: subsidies - indirectTaxes, note: null },
    { label: "= GNP at factor cost", value: gnpFactorCost, note: null },
    { label: "− Depreciation", value: -depreciation, note: "Wear and tear on capital" },
    { label: "= NNP at factor cost", value: nnpFactorCost, note: "The final national income figure" },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-body">
        Start from GDP at market prices and adjust it step by step to reach NNP at factor cost —
        exactly the chain examiners ask you to walk through.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        <NumberInput label="GDP at market prices" value={gdpMarketPrice} onChange={(v) => onAny(v, setGdp)} />
        <NumberInput label="Net factor income from abroad" value={nfia} onChange={(v) => onAny(v, setNfia)} />
        <NumberInput label="Indirect taxes" value={indirectTaxes} onChange={(v) => onAny(v, setIndirectTaxes)} />
        <NumberInput label="Subsidies" value={subsidies} onChange={(v) => onAny(v, setSubsidies)} />
        <NumberInput label="Depreciation" value={depreciation} onChange={(v) => onAny(v, setDepreciation)} />
      </div>

      <div className="rounded-xl border border-card-border overflow-hidden">
        {steps.map((s, i) => (
          <div
            key={i}
            className={`flex items-center justify-between px-4 py-2.5 text-sm ${
              s.label.startsWith("=") ? "bg-accent-warm-bg font-semibold text-heading" : "bg-card text-body"
            } ${i !== steps.length - 1 ? "border-b border-card-border" : ""}`}
          >
            <span>{s.label}{s.note && <span className="block text-xs text-secondary font-normal">{s.note}</span>}</span>
            <span className="font-mono shrink-0 ml-3">{s.value >= 0 && !s.label.startsWith("=") ? "+" : ""}{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NationalIncomeCalculator() {
  const [tab, setTab] = useState<"nominal-real" | "waterfall">("nominal-real");

  return (
    <div className="space-y-4">
      <ExplainerBox title="Why bother with all these different 'GDP' names?">
        <p>
          GDP just counts everything produced inside the country. But some of that income belongs
          to foreigners, some of it is inflated by taxes, some goods are subsidised below their
          true cost, and machines wear out while producing it. Each adjustment gets you a slightly
          more accurate picture of what citizens actually, truly earned — ending at NNP at factor
          cost.
        </p>
      </ExplainerBox>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("nominal-real")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            tab === "nominal-real" ? "bg-accent text-white" : "bg-muted text-body hover:text-accent"
          }`}
        >
          Nominal vs Real GDP
        </button>
        <button
          type="button"
          onClick={() => setTab("waterfall")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            tab === "waterfall" ? "bg-accent text-white" : "bg-muted text-body hover:text-accent"
          }`}
        >
          GDP → GNP → NNP
        </button>
      </div>

      {tab === "nominal-real" ? <NominalRealGdp /> : <GdpToNnpWaterfall />}
    </div>
  );
}
