"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

const W = 480;
const H = 260;
const left = 46;
const right = 460;
const bottom = 220;
const top = 20;

export default function ConsumptionSavingsExplorer() {
  const [a, setA] = useState(200);
  const [b, setB] = useState(0.8);
  const [y, setY] = useState(600);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const breakEven = a / (1 - b);
  const axisMax = useMemo(() => Math.max(Math.ceil((breakEven * 1.6) / 100) * 100, 300), [breakEven]);

  const toX = useCallback((v: number) => left + (v / axisMax) * (right - left), [axisMax]);
  const toY = useCallback((v: number) => bottom - (v / axisMax) * (bottom - top), [axisMax]);

  const clampedY = Math.max(0, Math.min(axisMax, y));
  const cAtY = a + b * clampedY;
  const sAtY = clampedY - cAtY;
  const mps = 1 - b;

  const consumptionPath = `M ${toX(0)},${toY(a)} L ${toX(axisMax)},${toY(a + b * axisMax)}`;
  const fortyFivePath = `M ${toX(0)},${toY(0)} L ${toX(axisMax)},${toY(axisMax)}`;

  return (
    <div className="space-y-4">
      <ExplainerBox title="Why plot consumption against a 45° reference line?">
        <p>
          The 45° line is just every point where spending equals income (C = Y) — a ruler, not a
          real economic curve. Wherever the consumption line sits ABOVE the 45° line, people are
          spending more than they earn (dissaving); wherever it sits BELOW, they&rsquo;re saving.
          The crossing point is the break-even income — the one income level where saving is
          exactly zero.
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap gap-4">
        <label className="flex flex-col gap-1 text-xs text-secondary">
          Autonomous consumption, a
          <input
            type="number"
            value={a}
            onChange={(e) => {
              setA(Math.max(0, Number(e.target.value) || 0));
              markInteracted();
            }}
            className="w-24 rounded-lg border border-card-border px-2 py-1 font-mono text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-secondary">
          MPC, b (0–0.99)
          <input
            type="number"
            step="0.05"
            min="0"
            max="0.99"
            value={b}
            onChange={(e) => {
              const v = Number(e.target.value);
              setB(Math.max(0, Math.min(0.99, isNaN(v) ? 0 : v)));
              markInteracted();
            }}
            className="w-24 rounded-lg border border-card-border px-2 py-1 font-mono text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-secondary flex-1 min-w-[160px]">
          Current income, Y = {clampedY}
          <input
            type="range"
            min={0}
            max={axisMax}
            value={clampedY}
            onChange={(e) => {
              setY(Number(e.target.value));
              markInteracted();
            }}
            className="w-full accent-[var(--accent)]"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-card-border bg-muted p-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-64">
          <line x1={left} y1={bottom} x2={right} y2={bottom} stroke="var(--secondary)" strokeWidth="1" />
          <line x1={left} y1={bottom} x2={left} y2={top} stroke="var(--secondary)" strokeWidth="1" />

          <path d={fortyFivePath} fill="none" stroke="var(--secondary)" strokeWidth="1.5" strokeDasharray="4 3" />
          <text x={toX(axisMax) - 4} y={toY(axisMax) - 6} textAnchor="end" className="fill-secondary text-[10px] font-mono">
            45° (C = Y)
          </text>

          <path d={consumptionPath} fill="none" stroke="var(--accent)" strokeWidth="2.5" />
          <text x={toX(axisMax) - 4} y={toY(a + b * axisMax) - 8} textAnchor="end" className="fill-accent text-[10px] font-mono font-bold">
            C = {a} + {b}Y
          </text>

          {breakEven > 0 && breakEven <= axisMax && (
            <>
              <line
                x1={toX(breakEven)}
                y1={toY(breakEven)}
                x2={toX(breakEven)}
                y2={bottom}
                stroke="var(--success)"
                strokeWidth="1"
                strokeDasharray="3 2"
              />
              <circle cx={toX(breakEven)} cy={toY(breakEven)} r="3.5" fill="var(--success)" />
              <text x={toX(breakEven)} y={bottom + 16} textAnchor="middle" className="fill-heading text-[10px] font-mono font-bold">
                {breakEven.toFixed(0)}
              </text>
            </>
          )}

          <line x1={toX(clampedY)} y1={toY(cAtY)} x2={toX(clampedY)} y2={bottom} stroke="var(--accent-warm)" strokeWidth="1" strokeDasharray="3 2" />
          <line x1={left} y1={toY(cAtY)} x2={toX(clampedY)} y2={toY(cAtY)} stroke="var(--accent-warm)" strokeWidth="1" strokeDasharray="3 2" />
          <circle cx={toX(clampedY)} cy={toY(cAtY)} r="4" fill="var(--accent-warm)" />
        </svg>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-card border border-card-border p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary">At Y = {clampedY}</p>
          <p className="font-mono text-sm text-body mt-1">C = {cAtY.toFixed(1)}</p>
          <p className="font-mono text-sm text-body">S = {sAtY.toFixed(1)}</p>
        </div>
        <div className="rounded-xl bg-card border border-card-border p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Propensities</p>
          <p className="font-mono text-sm text-body mt-1">MPC = {b.toFixed(2)}</p>
          <p className="font-mono text-sm text-body">MPS = {mps.toFixed(2)}</p>
        </div>
        <div className="rounded-xl bg-card border border-card-border p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Break-even income</p>
          <p className="font-mono text-sm text-body mt-1">Y* = a / (1 − b)</p>
          <p className="font-mono text-sm text-heading font-bold">{breakEven.toFixed(1)}</p>
        </div>
      </div>
    </div>
  );
}
