"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

type DistId = "bernoulli" | "binomial" | "poisson" | "geometric" | "uniform";

function factorial(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
function nCr(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  return factorial(n) / (factorial(r) * factorial(n - r));
}

const distLabels: { id: DistId; label: string }[] = [
  { id: "bernoulli", label: "Bernoulli" },
  { id: "binomial", label: "Binomial" },
  { id: "poisson", label: "Poisson" },
  { id: "geometric", label: "Geometric" },
  { id: "uniform", label: "Discrete Uniform" },
];

export default function DistributionExplorer() {
  const [dist, setDist] = useState<DistId>("binomial");
  const [n, setN] = useState(10);
  const [p, setP] = useState(0.3);
  const [mu, setMu] = useState(3);
  const [geomFromZero, setGeomFromZero] = useState(false);
  const [uniA, setUniA] = useState(1);
  const [uniB, setUniB] = useState(6);
  const [xValue, setXValue] = useState(3);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const { xs, pmf, mean, variance, formulaLabel } = useMemo(() => {
    if (dist === "bernoulli") {
      const xs = [0, 1];
      const pmf = [1 - p, p];
      return { xs, pmf, mean: p, variance: p * (1 - p), formulaLabel: "p(x) = pˣ(1−p)¹⁻ˣ" };
    }
    if (dist === "binomial") {
      const xs = Array.from({ length: n + 1 }, (_, i) => i);
      const pmf = xs.map((x) => nCr(n, x) * Math.pow(p, x) * Math.pow(1 - p, n - x));
      return { xs, pmf, mean: n * p, variance: n * p * (1 - p), formulaLabel: "P(X=x) = nCx·pˣ(1−p)ⁿ⁻ˣ" };
    }
    if (dist === "poisson") {
      const maxX = Math.max(15, Math.ceil(mu * 3) + 5);
      const xs = Array.from({ length: maxX + 1 }, (_, i) => i);
      const pmf = xs.map((x) => (Math.pow(mu, x) * Math.exp(-mu)) / factorial(x));
      return { xs, pmf, mean: mu, variance: mu, formulaLabel: "P(X=x) = μˣe⁻ᵘ / x!" };
    }
    if (dist === "geometric") {
      const start = geomFromZero ? 0 : 1;
      const maxX = start + Math.max(10, Math.ceil(5 / Math.max(p, 0.05)));
      const xs = Array.from({ length: maxX - start + 1 }, (_, i) => start + i);
      const pmf = xs.map((x) => (geomFromZero ? p * Math.pow(1 - p, x) : p * Math.pow(1 - p, x - 1)));
      const mean = geomFromZero ? (1 - p) / p : 1 / p;
      const variance = (1 - p) / (p * p);
      return { xs, pmf, mean, variance, formulaLabel: geomFromZero ? "P(X=x) = p(1−p)ˣ" : "P(X=x) = p(1−p)ˣ⁻¹" };
    }
    // uniform
    const lo = Math.min(uniA, uniB);
    const hi = Math.max(uniA, uniB);
    const count = hi - lo + 1;
    const xs = Array.from({ length: count }, (_, i) => lo + i);
    const pmf = xs.map(() => 1 / count);
    const mean = (lo + hi) / 2;
    const variance = (Math.pow(count, 2) - 1) / 12;
    return { xs, pmf, mean, variance, formulaLabel: "f(x) = 1/n" };
  }, [dist, n, p, mu, geomFromZero, uniA, uniB]);

  const sd = Math.sqrt(variance);

  const pAtX = useMemo(() => {
    const idx = xs.indexOf(xValue);
    return idx >= 0 ? pmf[idx] : 0;
  }, [xs, pmf, xValue]);

  const pLE = useMemo(() => xs.reduce((s, x, i) => (x <= xValue ? s + pmf[i] : s), 0), [xs, pmf, xValue]);

  const maxP = Math.max(...pmf, 0.01);
  const barW = 480 / Math.max(xs.length, 1);
  const chartH = 180;

  return (
    <div className="space-y-4">
      <ExplainerBox title="One live bar chart, five distributions">
        <p>
          Switch distributions and watch the whole PMF redraw — Bernoulli is a single yes/no
          trial, Binomial counts successes across a FIXED number of trials, Poisson counts events
          over an interval given an average rate, Geometric counts trials until the first success,
          and Discrete Uniform spreads probability perfectly evenly. The mean, variance, and any
          P(X=x) or P(X≤x) are all read straight off the same bars.
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap gap-1.5">
        {distLabels.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => {
              setDist(d.id);
              markInteracted();
            }}
            className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
              dist === d.id ? "border-accent bg-muted text-accent" : "border-card-border text-body hover:border-accent"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {dist === "bernoulli" && (
          <label className="flex items-center gap-2 text-xs text-secondary">
            p =
            <input type="number" step="0.01" min={0} max={1} value={p} onChange={(e) => { setP(Math.max(0, Math.min(1, Number(e.target.value) || 0))); markInteracted(); }} className="w-20 rounded-full border border-card-border px-2 py-1 font-mono" />
          </label>
        )}
        {dist === "binomial" && (
          <>
            <label className="flex items-center gap-2 text-xs text-secondary">
              n =
              <input type="number" min={1} max={40} value={n} onChange={(e) => { setN(Math.max(1, Math.min(40, Number(e.target.value) || 1))); markInteracted(); }} className="w-20 rounded-full border border-card-border px-2 py-1 font-mono" />
            </label>
            <label className="flex items-center gap-2 text-xs text-secondary">
              p =
              <input type="number" step="0.01" min={0} max={1} value={p} onChange={(e) => { setP(Math.max(0, Math.min(1, Number(e.target.value) || 0))); markInteracted(); }} className="w-20 rounded-full border border-card-border px-2 py-1 font-mono" />
            </label>
          </>
        )}
        {dist === "poisson" && (
          <label className="flex items-center gap-2 text-xs text-secondary">
            μ =
            <input type="number" step="0.1" min={0.1} value={mu} onChange={(e) => { setMu(Math.max(0.1, Number(e.target.value) || 0.1)); markInteracted(); }} className="w-20 rounded-full border border-card-border px-2 py-1 font-mono" />
          </label>
        )}
        {dist === "geometric" && (
          <>
            <label className="flex items-center gap-2 text-xs text-secondary">
              p =
              <input type="number" step="0.01" min={0.01} max={1} value={p} onChange={(e) => { setP(Math.max(0.01, Math.min(1, Number(e.target.value) || 0.01))); markInteracted(); }} className="w-20 rounded-full border border-card-border px-2 py-1 font-mono" />
            </label>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => { setGeomFromZero(false); markInteracted(); }}
                className={`px-3 py-1 rounded-full border text-xs font-medium ${!geomFromZero ? "border-accent bg-muted text-accent" : "border-card-border text-body"}`}
              >
                trials until success
              </button>
              <button
                type="button"
                onClick={() => { setGeomFromZero(true); markInteracted(); }}
                className={`px-3 py-1 rounded-full border text-xs font-medium ${geomFromZero ? "border-accent bg-muted text-accent" : "border-card-border text-body"}`}
              >
                failures before success
              </button>
            </div>
          </>
        )}
        {dist === "uniform" && (
          <>
            <label className="flex items-center gap-2 text-xs text-secondary">
              a =
              <input type="number" value={uniA} onChange={(e) => { setUniA(Number(e.target.value) || 0); markInteracted(); }} className="w-16 rounded-full border border-card-border px-2 py-1 font-mono" />
            </label>
            <label className="flex items-center gap-2 text-xs text-secondary">
              b =
              <input type="number" value={uniB} onChange={(e) => { setUniB(Number(e.target.value) || 0); markInteracted(); }} className="w-16 rounded-full border border-card-border px-2 py-1 font-mono" />
            </label>
          </>
        )}
      </div>

      <p className="font-mono text-xs text-secondary">{formulaLabel}</p>

      <div className="rounded-2xl border border-card-border bg-muted p-3 overflow-x-auto">
        <svg viewBox={`0 0 480 ${chartH + 30}`} className="w-full" style={{ minWidth: Math.max(480, xs.length * 26) }}>
          {xs.map((x, i) => {
            const h = (pmf[i] / maxP) * chartH;
            const isSelected = x === xValue;
            return (
              <g key={x}>
                <rect
                  x={i * barW + 2}
                  y={chartH - h}
                  width={Math.max(barW - 4, 2)}
                  height={h}
                  fill={isSelected ? "var(--accent)" : "var(--accent)"}
                  fillOpacity={isSelected ? 0.9 : 0.4}
                  className="cursor-pointer"
                  onClick={() => { setXValue(x); markInteracted(); }}
                />
                {xs.length <= 25 && (
                  <text x={i * barW + barW / 2} y={chartH + 14} textAnchor="middle" className="fill-secondary text-[9px] font-mono">
                    {x}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="grid gap-2 sm:grid-cols-3 font-mono text-sm">
        <div className="rounded-xl bg-muted p-3">
          <p className="text-xs text-secondary font-sans mb-1">E(X)</p>
          <p className="font-bold text-heading">{mean.toFixed(4)}</p>
        </div>
        <div className="rounded-xl bg-muted p-3">
          <p className="text-xs text-secondary font-sans mb-1">Var(X)</p>
          <p className="font-bold text-heading">{variance.toFixed(4)}</p>
        </div>
        <div className="rounded-xl bg-muted p-3">
          <p className="text-xs text-secondary font-sans mb-1">SD(X)</p>
          <p className="font-bold text-heading">{sd.toFixed(4)}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-secondary">
          x =
          <input type="number" value={xValue} onChange={(e) => { setXValue(Number(e.target.value) || 0); markInteracted(); }} className="w-16 rounded-full border border-card-border px-2 py-1 font-mono" />
        </label>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 font-mono text-sm">
        <div className="rounded-xl border border-card-border p-3">
          <p className="text-xs text-secondary font-sans mb-1">P(X = {xValue})</p>
          <p className="font-bold text-heading">{pAtX.toFixed(4)}</p>
        </div>
        <div className="rounded-xl border border-card-border p-3">
          <p className="text-xs text-secondary font-sans mb-1">P(X ≤ {xValue})</p>
          <p className="font-bold text-heading">{pLE.toFixed(4)}</p>
        </div>
      </div>
    </div>
  );
}
