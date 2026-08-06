"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

// Standard normal CDF via the Abramowitz-Stegun erf approximation (accurate to ~1e-7).
function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);
  const a1 = 0.254829592,
    a2 = -0.284496736,
    a3 = 1.421413741,
    a4 = -1.453152027,
    a5 = 1.061405429,
    p = 0.3275911;
  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-x * x);
  return sign * y;
}
function stdNormCdf(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

const presets = [
  { label: "μ=40.5, σ=5.5 — random measurement", mu: 40.5, sigma: 5.5, a: 31.15, b: 51.5 },
  { label: "μ=24, σ=2 — commute time (minutes)", mu: 24, sigma: 2, a: 24, b: 28 },
];

const W = 460;
const H = 200;
const left = 20;
const right = 440;
const bottom = 170;
const top = 15;

function normalPdf(z: number) {
  return Math.exp((-z * z) / 2);
}

export default function NormalDistributionCalculator() {
  const [mu, setMu] = useState(40.5);
  const [sigma, setSigma] = useState(5.5);
  const [a, setA] = useState(31.15);
  const [b, setB] = useState(51.5);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function applyPreset(p: (typeof presets)[number]) {
    setMu(p.mu);
    setSigma(p.sigma);
    setA(p.a);
    setB(p.b);
    markInteracted();
  }

  const safeSigma = sigma > 0 ? sigma : 0.01;
  const za = (a - mu) / safeSigma;
  const zb = (b - mu) / safeSigma;
  const loZ = Math.min(za, zb);
  const hiZ = Math.max(za, zb);

  const pBetween = stdNormCdf(hiZ) - stdNormCdf(loZ);
  const pLessA = stdNormCdf(za);
  const pGreaterA = 1 - stdNormCdf(za);
  const pLessB = stdNormCdf(zb);
  const pGreaterB = 1 - stdNormCdf(zb);

  function toX(z: number) {
    return left + ((z + 4) / 8) * (right - left);
  }
  function toY(y: number) {
    return bottom - y * (bottom - top);
  }
  const curvePath = useMemo(() => {
    const pts: string[] = [];
    for (let z = -4; z <= 4; z += 0.1) {
      pts.push(`${toX(z).toFixed(1)},${toY(normalPdf(z)).toFixed(1)}`);
    }
    return `M ${pts.join(" L ")}`;
  }, []);
  const shadedZLo = Math.max(-4, Math.min(4, loZ));
  const shadedZHi = Math.max(-4, Math.min(4, hiZ));
  const areaPath = useMemo(() => {
    const pts: string[] = [`${toX(shadedZLo).toFixed(1)},${bottom}`];
    for (let z = shadedZLo; z <= shadedZHi; z += 0.05) {
      pts.push(`${toX(z).toFixed(1)},${toY(normalPdf(z)).toFixed(1)}`);
    }
    pts.push(`${toX(shadedZHi).toFixed(1)},${bottom}`);
    return `M ${pts.join(" L ")} Z`;
  }, [shadedZLo, shadedZHi]);

  return (
    <div className="space-y-4">
      <ExplainerBox title="Standardize, look up, subtract — the three-step pattern for every normal probability">
        <p>
          Convert both bounds to z-scores with z=(x−μ)/σ, find the standard-normal area up to each
          one (Φ(z)), then subtract to get the probability between them. The same three steps
          answer P(X&lt;a), P(X&gt;b), and everything in between.
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-full border border-card-border text-xs font-medium text-body hover:border-accent transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <label className="text-xs text-secondary space-y-1">
          <span className="block font-semibold">μ (mean)</span>
          <input
            type="number"
            step="0.1"
            value={mu}
            onChange={(e) => {
              setMu(Number(e.target.value) || 0);
              markInteracted();
            }}
            className="w-full rounded-full border border-card-border px-3 py-1.5 font-mono"
          />
        </label>
        <label className="text-xs text-secondary space-y-1">
          <span className="block font-semibold">σ (SD)</span>
          <input
            type="number"
            step="0.1"
            min="0.01"
            value={sigma}
            onChange={(e) => {
              setSigma(Math.max(0.01, Number(e.target.value) || 0.01));
              markInteracted();
            }}
            className="w-full rounded-full border border-card-border px-3 py-1.5 font-mono"
          />
        </label>
        <label className="text-xs text-secondary space-y-1">
          <span className="block font-semibold">a</span>
          <input
            type="number"
            step="0.1"
            value={a}
            onChange={(e) => {
              setA(Number(e.target.value) || 0);
              markInteracted();
            }}
            className="w-full rounded-full border border-card-border px-3 py-1.5 font-mono"
          />
        </label>
        <label className="text-xs text-secondary space-y-1">
          <span className="block font-semibold">b</span>
          <input
            type="number"
            step="0.1"
            value={b}
            onChange={(e) => {
              setB(Number(e.target.value) || 0);
              markInteracted();
            }}
            className="w-full rounded-full border border-card-border px-3 py-1.5 font-mono"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-card-border bg-muted p-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-52">
          <path d={areaPath} fill="var(--accent)" fillOpacity="0.25" stroke="none" />
          <path d={curvePath} fill="none" stroke="var(--accent)" strokeWidth="2" />
          <line x1={left} y1={bottom} x2={right} y2={bottom} stroke="var(--secondary)" strokeWidth="1" />
          <text x={toX(0)} y={bottom + 16} textAnchor="middle" className="fill-heading text-[10px] font-mono font-bold">
            μ
          </text>
        </svg>
      </div>

      <div className="rounded-xl bg-muted p-4 space-y-1 font-mono text-sm">
        <p className="text-body">
          zₐ = ({a} − {mu}) / {sigma} = {za.toFixed(3)}
        </p>
        <p className="text-body">
          z_b = ({b} − {mu}) / {sigma} = {zb.toFixed(3)}
        </p>
        <p className="font-bold text-heading">P(a &lt; X &lt; b) = {pBetween.toFixed(4)}</p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 font-mono text-sm">
        <div className="rounded-xl border border-card-border p-3">
          <p className="text-xs text-secondary font-sans mb-1">P(X &lt; a)</p>
          <p className="font-bold text-heading">{pLessA.toFixed(4)}</p>
        </div>
        <div className="rounded-xl border border-card-border p-3">
          <p className="text-xs text-secondary font-sans mb-1">P(X &gt; a)</p>
          <p className="font-bold text-heading">{pGreaterA.toFixed(4)}</p>
        </div>
        <div className="rounded-xl border border-card-border p-3">
          <p className="text-xs text-secondary font-sans mb-1">P(X &lt; b)</p>
          <p className="font-bold text-heading">{pLessB.toFixed(4)}</p>
        </div>
        <div className="rounded-xl border border-card-border p-3">
          <p className="text-xs text-secondary font-sans mb-1">P(X &gt; b)</p>
          <p className="font-bold text-heading">{pGreaterB.toFixed(4)}</p>
        </div>
      </div>
    </div>
  );
}
