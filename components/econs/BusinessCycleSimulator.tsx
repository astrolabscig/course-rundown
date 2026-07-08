"use client";

import { useEffect, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

interface Phase {
  label: string;
  narration: string;
  x: number; // 0-100 position along the wave
  number: number;
}

// One full cycle: x=0/100 is the trough, x=25 the expansion midpoint,
// x=50 the peak, x=75 the slowdown midpoint — chosen to land exactly on
// the curve's own trough/rise/peak/fall so the labels always match what's
// actually drawn.
const phases: Phase[] = [
  { label: "Upturn / Trough", narration: "A contracting or stagnant economy begins to recover. Output starts rising from its lowest point.", x: 4, number: 1 },
  { label: "Expansion", narration: "Rapid growth — the economy is booming. Output rises quickly, often above its long-term potential.", x: 29, number: 2 },
  { label: "Peak", narration: "Growth slows down or even ceases as the economy overheats and runs out of spare capacity.", x: 54, number: 3 },
  { label: "Slowdown / Recession", narration: "Little or no growth, or even a decline in output, as the cycle turns down again.", x: 79, number: 4 },
];

// Plot area in viewBox units, leaving margin for axes and labels.
const plotLeft = 18;
const plotRight = 138;
const plotWidth = plotRight - plotLeft;
const plotTop = 10;
const plotBottom = 72;
const waveCenter = 44;
const waveAmplitude = 20; // curve spans waveCenter ± amplitude, safely inside plotTop/plotBottom

function toPlotX(x: number): number {
  return plotLeft + (x / 100) * plotWidth;
}

// x=0 lands on the trough, matching the phase ordering (trough → expansion → peak → slowdown).
function curveY(x: number): number {
  const theta = (x / 100) * 2 * Math.PI;
  return waveCenter + waveAmplitude * Math.cos(theta);
}

function potentialY(x: number): number {
  // Steadily rising trend line, independent of the actual-output wobble.
  return 62 - (x / 100) * 42;
}

function wavePath(): string {
  const points: string[] = [];
  for (let x = 0; x <= 100; x += 2) {
    points.push(`${toPlotX(x).toFixed(1)},${curveY(x).toFixed(1)}`);
  }
  return `M ${points.join(" L ")}`;
}

export default function BusinessCycleSimulator() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (index >= phases.length - 1) {
      setPlaying(false);
      return;
    }
    timeoutRef.current = setTimeout(() => setIndex((i) => Math.min(phases.length - 1, i + 1)), 1400);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, index]);

  function play() {
    setIndex(0);
    setPlaying(true);
    markInteracted();
  }

  function step(delta: number) {
    setPlaying(false);
    setIndex((i) => Math.min(phases.length - 1, Math.max(0, i + delta)));
    markInteracted();
  }

  const phase = phases[index];
  const markerX = toPlotX(phase.x);
  const markerY = curveY(phase.x);

  return (
    <div className="space-y-4">
      <ExplainerBox title="Why does output wobble instead of growing in a straight line?">
        <p>
          Even though an economy&rsquo;s underlying capacity (potential output) tends to grow
          steadily, what actually gets produced (actual output) wobbles around it — sometimes
          running hot above potential, sometimes falling below it. That repeating wobble is the
          business cycle: upturn, expansion, peak, then slowdown, over and over.
        </p>
      </ExplainerBox>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={play}
          className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          ▶ Play the cycle
        </button>
        <button
          type="button"
          onClick={() => step(-1)}
          className="px-3 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors"
        >
          ◀
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          className="px-3 py-1.5 rounded-full border border-card-border text-sm font-medium text-body hover:border-accent transition-colors"
        >
          ▶
        </button>
      </div>

      <div className="rounded-2xl border border-card-border bg-muted p-4">
        <svg viewBox="0 0 150 90" className="w-full h-56">
          {/* Axes */}
          <line x1={plotLeft} y1={plotTop - 4} x2={plotLeft} y2={plotBottom} stroke="var(--secondary)" strokeWidth="0.6" />
          <line x1={plotLeft} y1={plotBottom} x2={plotRight + 4} y2={plotBottom} stroke="var(--secondary)" strokeWidth="0.6" />
          <text x={plotLeft - 4} y={plotBottom + 6} textAnchor="middle" className="fill-secondary" style={{ fontSize: 5 }}>
            O
          </text>
          <text x={(plotLeft + plotRight) / 2} y={plotBottom + 9} textAnchor="middle" className="fill-secondary" style={{ fontSize: 5 }}>
            Time
          </text>
          <text
            x={0}
            y={0}
            textAnchor="middle"
            className="fill-secondary"
            style={{ fontSize: 5 }}
            transform={`translate(7, ${(plotTop + plotBottom) / 2}) rotate(-90)`}
          >
            National output
          </text>

          {/* Potential output (steady rising trend) */}
          <path
            d={`M ${toPlotX(0)},${potentialY(0)} L ${toPlotX(100)},${potentialY(100)}`}
            fill="none"
            stroke="var(--accent-warm)"
            strokeWidth="1.2"
            strokeDasharray="3,2"
          />
          <text x={plotRight - 32} y={potentialY(80) - 4} className="fill-accent-warm font-semibold" style={{ fontSize: 5.5 }}>
            Potential output
          </text>

          {/* Actual output (the wobble) */}
          <path d={wavePath()} fill="none" stroke="var(--accent)" strokeWidth="1.6" />
          <text x={toPlotX(90)} y={curveY(90) + 9} className="fill-accent font-semibold" style={{ fontSize: 5.5 }}>
            Actual output
          </text>

          {/* Numbered phase points along the curve */}
          {phases.map((p) => (
            <text
              key={p.number}
              x={toPlotX(p.x)}
              y={curveY(p.x) - (index === p.number - 1 ? 0 : 7)}
              textAnchor="middle"
              className={index === p.number - 1 ? "fill-white font-bold" : "fill-secondary font-semibold"}
              style={{ fontSize: 5.5 }}
            >
              {index === p.number - 1 ? "" : p.number}
            </text>
          ))}

          {/* Moving marker — drawn last so it always renders on top */}
          <circle cx={markerX} cy={markerY} r="3.2" fill="var(--accent-warm)" stroke="white" strokeWidth="1" />
        </svg>
        <p className="text-center text-xs text-secondary">National output over time (orange = potential output trend, blue = actual output)</p>
      </div>

      <div className="rounded-xl bg-card border border-card-border p-4">
        <p className="font-semibold text-heading mb-1">
          {phase.number}. {phase.label}
        </p>
        <p className="text-sm text-body">{phase.narration}</p>
      </div>
    </div>
  );
}
