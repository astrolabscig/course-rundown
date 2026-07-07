"use client";

import { useEffect, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

interface Phase {
  label: string;
  narration: string;
  x: number; // 0-100 position along the wave
}

const phases: Phase[] = [
  { label: "Upturn / Trough", narration: "A contracting or stagnant economy begins to recover. Output starts rising from its lowest point.", x: 10 },
  { label: "Expansion", narration: "Rapid growth — the economy is booming. Output rises quickly, often above its long-term potential.", x: 35 },
  { label: "Peak", narration: "Growth slows down or even ceases as the economy overheats and runs out of spare capacity.", x: 60 },
  { label: "Slowdown / Recession", narration: "Little or no growth, or even a decline in output, as the cycle turns down again.", x: 85 },
];

function wavePath(): string {
  // A smooth sine-like wave across the chart width, for visual context only.
  const points: string[] = [];
  for (let x = 0; x <= 100; x += 2) {
    const y = 50 - 25 * Math.sin((x / 100) * Math.PI * 2);
    points.push(`${x},${y.toFixed(1)}`);
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
  const markerX = phase.x;
  const markerY = 50 - 25 * Math.sin((markerX / 100) * Math.PI * 2);

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
        <svg viewBox="0 0 100 60" className="w-full h-40">
          <line x1="0" y1="50" x2="100" y2="50" stroke="var(--card-border)" strokeWidth="0.5" strokeDasharray="2,2" />
          <path d={wavePath()} fill="none" stroke="var(--accent)" strokeWidth="1.5" />
          <circle cx={markerX} cy={markerY} r="3" fill="var(--accent-warm)" stroke="white" strokeWidth="1" />
        </svg>
        <p className="text-center text-xs text-secondary">National output over time (dashed line = potential output trend)</p>
      </div>

      <div className="rounded-xl bg-card border border-card-border p-4">
        <p className="font-semibold text-heading mb-1">{phase.label}</p>
        <p className="text-sm text-body">{phase.narration}</p>
      </div>
    </div>
  );
}
