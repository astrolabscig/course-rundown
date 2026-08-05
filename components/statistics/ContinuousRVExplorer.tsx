"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

interface Preset {
  id: string;
  label: string;
  formula: string;
  domainMin: number;
  domainMax: number;
  f: (x: number) => number;
  defaultA: number;
  defaultB: number;
}

const presets: Preset[] = [
  {
    id: "quadratic",
    label: "f(x) = x²/9  on 0 < x < 3",
    formula: "f(x) = x²/9",
    domainMin: 0,
    domainMax: 3,
    f: (x) => (x * x) / 9,
    defaultA: 0,
    defaultB: 2,
  },
  {
    id: "exponential",
    label: "f(x) = (1/10)e^(−x/10)  for x > 0 (call duration)",
    formula: "f(x) = (1/10)e^(−x/10)",
    domainMin: 0,
    domainMax: 60,
    f: (x) => (1 / 10) * Math.exp(-x / 10),
    defaultA: 0,
    defaultB: 7,
  },
  {
    id: "uniform",
    label: "f(x) = 1/10  on 0 < x < 10 (continuous uniform)",
    formula: "f(x) = 1/10",
    domainMin: 0,
    domainMax: 10,
    f: () => 1 / 10,
    defaultA: 5,
    defaultB: 8,
  },
];

function trapz(f: (x: number) => number, a: number, b: number, n = 1000) {
  if (b <= a) return 0;
  const h = (b - a) / n;
  let s = 0.5 * (f(a) + f(b));
  for (let i = 1; i < n; i++) s += f(a + i * h);
  return s * h;
}

const W = 480;
const H = 220;
const left = 30;
const right = 460;
const bottom = 190;
const top = 20;

export default function ContinuousRVExplorer() {
  const [presetId, setPresetId] = useState("quadratic");
  const preset = presets.find((p) => p.id === presetId) ?? presets[0];
  const [a, setA] = useState(preset.defaultA);
  const [b, setB] = useState(preset.defaultB);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function selectPreset(p: Preset) {
    setPresetId(p.id);
    setA(p.defaultA);
    setB(p.defaultB);
    markInteracted();
  }

  const maxF = useMemo(() => {
    let m = 0;
    const n = 200;
    for (let i = 0; i <= n; i++) {
      const x = preset.domainMin + (i / n) * (preset.domainMax - preset.domainMin);
      m = Math.max(m, preset.f(x));
    }
    return m * 1.15;
  }, [preset]);

  const toX = useCallback(
    (x: number) => left + ((x - preset.domainMin) / (preset.domainMax - preset.domainMin)) * (right - left),
    [preset]
  );
  const toY = useCallback((y: number) => bottom - (y / maxF) * (bottom - top), [maxF]);

  const curvePath = useMemo(() => {
    const n = 200;
    const pts: string[] = [];
    for (let i = 0; i <= n; i++) {
      const x = preset.domainMin + (i / n) * (preset.domainMax - preset.domainMin);
      pts.push(`${toX(x).toFixed(1)},${toY(preset.f(x)).toFixed(1)}`);
    }
    return `M ${pts.join(" L ")}`;
  }, [preset, toX, toY]);

  const clampedA = Math.max(preset.domainMin, Math.min(preset.domainMax, a));
  const clampedB = Math.max(preset.domainMin, Math.min(preset.domainMax, b));
  const lo = Math.min(clampedA, clampedB);
  const hi = Math.max(clampedA, clampedB);

  const areaPath = useMemo(() => {
    const n = 100;
    const pts: string[] = [`${toX(lo).toFixed(1)},${bottom}`];
    for (let i = 0; i <= n; i++) {
      const x = lo + (i / n) * (hi - lo);
      pts.push(`${toX(x).toFixed(1)},${toY(preset.f(x)).toFixed(1)}`);
    }
    pts.push(`${toX(hi).toFixed(1)},${bottom}`);
    return `M ${pts.join(" L ")} Z`;
  }, [lo, hi, preset, toX, toY]);

  const probability = useMemo(() => trapz(preset.f, lo, hi), [preset, lo, hi]);
  const totalArea = useMemo(() => trapz(preset.f, preset.domainMin, preset.domainMax), [preset]);

  return (
    <div className="space-y-4">
      <ExplainerBox title="For a continuous random variable, probability IS area">
        <p>
          There&rsquo;s no P(X = single point) worth asking about here — it&rsquo;s always exactly
          0. Instead, P(a &lt; X &lt; b) is the shaded AREA under the curve between a and b. Move
          the bounds and watch the shaded region — and the probability number — change together.
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => selectPreset(p)}
            className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
              presetId === p.id ? "border-accent bg-muted text-accent" : "border-card-border text-body hover:border-accent"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <p className="font-mono text-sm text-heading">
        {preset.formula}, total area under the curve ≈ {totalArea.toFixed(4)}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-secondary">
          a =
          <input
            type="number"
            step="0.1"
            value={a}
            onChange={(e) => {
              setA(Number(e.target.value) || 0);
              markInteracted();
            }}
            className="w-20 rounded-full border border-card-border px-2 py-1 font-mono"
          />
        </label>
        <label className="flex items-center gap-2 text-xs text-secondary">
          b =
          <input
            type="number"
            step="0.1"
            value={b}
            onChange={(e) => {
              setB(Number(e.target.value) || 0);
              markInteracted();
            }}
            className="w-20 rounded-full border border-card-border px-2 py-1 font-mono"
          />
        </label>
        <span className="text-xs text-secondary">domain: [{preset.domainMin}, {preset.domainMax}]</span>
      </div>

      <div className="rounded-2xl border border-card-border bg-muted p-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-56">
          <path d={areaPath} fill="var(--accent)" fillOpacity="0.25" stroke="none" />
          <path d={curvePath} fill="none" stroke="var(--accent)" strokeWidth="2" />
          <line x1={left} y1={bottom} x2={right} y2={bottom} stroke="var(--secondary)" strokeWidth="1" />
          <text x={toX(lo)} y={bottom + 16} textAnchor="middle" className="fill-heading text-[10px] font-mono font-bold">
            {lo.toFixed(1)}
          </text>
          <text x={toX(hi)} y={bottom + 16} textAnchor="middle" className="fill-heading text-[10px] font-mono font-bold">
            {hi.toFixed(1)}
          </text>
        </svg>
      </div>

      <div className="rounded-xl bg-muted p-4 font-mono text-sm">
        <p className="text-xs text-secondary font-sans mb-1">
          P({lo.toFixed(1)} &lt; X &lt; {hi.toFixed(1)}) = ∫ f(x) dx over [{lo.toFixed(1)}, {hi.toFixed(1)}]
        </p>
        <p className="font-bold text-heading text-lg">{probability.toFixed(4)}</p>
      </div>
    </div>
  );
}
