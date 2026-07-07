"use client";

import { useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

// A bowed-in curve from high-unemployment/low-inflation to low-unemployment/high-inflation.
const points = [
  { u: 9, inf: -1 },
  { u: 7, inf: 1 },
  { u: 5, inf: 3.5 },
  { u: 3.5, inf: 6.5 },
  { u: 2.5, inf: 11 },
];

function toSvg(u: number, inf: number, shiftOut: boolean) {
  // u ranges roughly 2-9 (x, inverted so lower unemployment is to the right)
  // inf ranges roughly -1 to 11 (y, inverted since svg y grows downward)
  const x = 90 - ((u - 2) / 7) * 75;
  const shift = shiftOut ? 3 : 0;
  const y = 62 - ((inf + shift - -1) / 12) * 55;
  return { x, y };
}

export default function PhillipsCurveSimulator() {
  const [index, setIndex] = useState(2);
  const [shiftOut, setShiftOut] = useState(false);
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function selectPoint(i: number) {
    setIndex(i);
    markInteracted();
  }

  function toggleShift() {
    setShiftOut((s) => !s);
    markInteracted();
  }

  const current = points[index];
  const svgPoints = points.map((p) => toSvg(p.u, p.inf, shiftOut));
  const pathD = `M ${svgPoints.map((p) => `${p.x},${p.y}`).join(" L ")}`;
  const marker = svgPoints[index];

  return (
    <div className="space-y-4">
      <ExplainerBox title="Can a government really just choose lower unemployment?">
        <p>
          The original Phillips curve suggested a simple trade-off: accept a bit more inflation
          and you get lower unemployment, or vice versa — just pick a point on the curve. Click
          along the curve below to see the pairs of values. But in the 1970s something broke this
          idea: <strong>stagflation</strong> — high inflation AND high unemployment at the same
          time, meaning the whole curve had shifted outward.
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap gap-2">
        {points.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => selectPoint(i)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              index === i ? "bg-accent text-white" : "bg-muted text-body hover:text-accent"
            }`}
          >
            U={p.u}%
          </button>
        ))}
        <button
          type="button"
          onClick={toggleShift}
          className="px-3 py-1.5 rounded-full bg-accent-warm text-white text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          {shiftOut ? "Undo stagflation shift" : "Shift curve out (stagflation)"}
        </button>
      </div>

      <div className="rounded-2xl border border-card-border bg-muted p-4">
        <svg viewBox="0 0 100 70" className="w-full h-48">
          <line x1="10" y1="5" x2="10" y2="65" stroke="var(--card-border)" strokeWidth="0.5" />
          <line x1="10" y1="65" x2="95" y2="65" stroke="var(--card-border)" strokeWidth="0.5" />
          <text x="0" y="10" fontSize="4" fill="var(--secondary)">Inflation %</text>
          <text x="75" y="70" fontSize="4" fill="var(--secondary)">Unemployment % →</text>
          <path d={pathD} fill="none" stroke="var(--accent)" strokeWidth="1.2" className="transition-all duration-500" />
          <circle cx={marker.x} cy={marker.y} r="3" fill="var(--accent-warm)" stroke="white" strokeWidth="1" />
        </svg>
      </div>

      <div className="rounded-xl bg-card border border-card-border p-4 text-sm text-body">
        <p>
          At <span className="font-mono font-semibold">{current.u}% unemployment</span>, this
          curve implies about{" "}
          <span className="font-mono font-semibold">{(current.inf + (shiftOut ? 3 : 0)).toFixed(1)}%</span> inflation.
        </p>
        {shiftOut && (
          <p className="mt-2">
            <span className="font-semibold text-error">Curve shifted outward:</span> for the same
            unemployment rate, inflation is now higher across the board — this is what
            economists observed breaking down in the 1970s (stagflation), caused by non-demand
            factors like cost-push inflation and rising structural unemployment happening at the
            same time.
          </p>
        )}
      </div>
    </div>
  );
}
