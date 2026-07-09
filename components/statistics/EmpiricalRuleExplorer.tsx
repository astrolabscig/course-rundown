"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

const width = 500;
const height = 220;
const plotLeft = 20;
const plotRight = 480;
const plotBottom = 190;
const plotTop = 20;

function normalPdf(z: number): number {
  return Math.exp((-z * z) / 2) / Math.sqrt(2 * Math.PI);
}

function bellPath(): string {
  const points: string[] = [];
  for (let z = -4; z <= 4; z += 0.1) {
    const x = plotLeft + ((z + 4) / 8) * (plotRight - plotLeft);
    const y = plotBottom - (normalPdf(z) / normalPdf(0)) * (plotBottom - plotTop);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `M ${points.join(" L ")}`;
}

function toX(z: number) {
  return plotLeft + ((z + 4) / 8) * (plotRight - plotLeft);
}

const bands = [
  { sigma: 1, pct: "68%", color: "var(--accent)" },
  { sigma: 2, pct: "95%", color: "var(--accent-warm)" },
  { sigma: 3, pct: "99.7%", color: "var(--success)" },
];

export default function EmpiricalRuleExplorer() {
  const [mean, setMean] = useState(150);
  const [sd, setSd] = useState(20);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const path = useMemo(bellPath, []);

  return (
    <div className="space-y-4">
      <ExplainerBox title="For a bell-shaped distribution, the spread is remarkably predictable">
        <p>
          You don't need to check every data point to know roughly how spread out a symmetric,
          bell-shaped distribution is — the Empirical Rule (68-95-99.7 rule) says about 68% of
          observations fall within 1 standard deviation of the mean, about 95% within 2, and
          almost all (99.7%) within 3.
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap gap-4">
        <label className="text-xs text-secondary space-y-1">
          <span className="block font-semibold">Mean</span>
          <input
            type="number"
            value={mean}
            onChange={(e) => {
              setMean(Number(e.target.value) || 0);
              markInteracted();
            }}
            className="w-24 rounded-full border border-card-border px-3 py-1.5 font-mono"
          />
        </label>
        <label className="text-xs text-secondary space-y-1">
          <span className="block font-semibold">Standard deviation</span>
          <input
            type="number"
            value={sd}
            onChange={(e) => {
              setSd(Math.max(0.01, Number(e.target.value) || 0.01));
              markInteracted();
            }}
            className="w-24 rounded-full border border-card-border px-3 py-1.5 font-mono"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-card-border bg-muted p-3">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56">
          {[...bands].reverse().map((b) => (
            <rect key={b.sigma} x={toX(-b.sigma)} y={plotTop} width={toX(b.sigma) - toX(-b.sigma)} height={plotBottom - plotTop} fill={b.color} fillOpacity="0.12" />
          ))}
          <path d={path} fill="none" stroke="var(--heading)" strokeWidth="2" />
          <line x1={plotLeft} y1={plotBottom} x2={plotRight} y2={plotBottom} stroke="var(--secondary)" strokeWidth="1" />
          {bands.map((b) => (
            <g key={b.sigma}>
              <line x1={toX(-b.sigma)} y1={plotTop} x2={toX(-b.sigma)} y2={plotBottom} stroke={b.color} strokeWidth="1" strokeDasharray="3,2" />
              <line x1={toX(b.sigma)} y1={plotTop} x2={toX(b.sigma)} y2={plotBottom} stroke={b.color} strokeWidth="1" strokeDasharray="3,2" />
            </g>
          ))}
          <text x={toX(0)} y={plotBottom + 16} textAnchor="middle" className="fill-heading text-[10px] font-mono font-bold">
            {mean}
          </text>
        </svg>
      </div>

      <div className="grid gap-2">
        {bands.map((b) => (
          <div key={b.sigma} className="flex items-center justify-between rounded-lg border border-card-border p-2.5 text-sm">
            <span className="font-semibold" style={{ color: b.color }}>
              ±{b.sigma}σ ({b.pct})
            </span>
            <span className="font-mono text-body">
              {(mean - b.sigma * sd).toFixed(1)} to {(mean + b.sigma * sd).toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
