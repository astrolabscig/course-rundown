"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";

interface Series {
  id: string;
  label: string;
  color: string;
  fn: (n: number) => number;
}

const series: Series[] = [
  { id: "log", label: "log₂ n", color: "#2FA86A", fn: (n) => Math.log2(n) },
  { id: "linear", label: "n", color: "#4F7CFF", fn: (n) => n },
  { id: "nlogn", label: "n log₂ n", color: "#9B59B6", fn: (n) => n * Math.log2(n) },
  { id: "quad", label: "n²", color: "#FF7A59", fn: (n) => n * n },
  { id: "exp", label: "2ⁿ", color: "#E0455A", fn: (n) => Math.pow(2, n) },
  { id: "fact", label: "n!", color: "#8B5E3C", fn: (n) => {
      let r = 1;
      for (let i = 2; i <= n; i++) r *= i;
      return r;
    } },
];

const maxN = 10;
const width = 640;
const height = 320;
const padding = 40;

export default function BigOGrowthChart() {
  const [active, setActive] = useState<Set<string>>(new Set(["log", "linear", "nlogn", "quad"]));
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function toggle(id: string) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    markInteracted();
  }

  const maxValue = useMemo(() => {
    let max = 1;
    for (const s of series) {
      if (!active.has(s.id)) continue;
      for (let n = 1; n <= maxN; n++) max = Math.max(max, Math.log(s.fn(n) + 1));
    }
    return max;
  }, [active]);

  function toPoint(n: number, value: number) {
    const x = padding + ((n - 1) / (maxN - 1)) * (width - 2 * padding);
    const logValue = Math.log(value + 1);
    const y = height - padding - (logValue / maxValue) * (height - 2 * padding);
    return `${x},${y}`;
  }

  return (
    <div className="space-y-4">
      <ExplainerBox title="Big-O is about the shape of the curve, not one number">
        <p>
          These six functions all describe how an algorithm's work grows as the input size n
          grows. The y-axis below uses a logarithmic scale — otherwise 2ⁿ and n! would instantly
          shoot off the top of the chart and hide everything else. Toggle functions on/off to
          compare their growth rates directly (mirrors Rosen 3.2, ordering-by-growth-rate style
          exercises).
        </p>
      </ExplainerBox>

      <div className="flex flex-wrap gap-1.5">
        {series.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => toggle(s.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono transition-colors"
            style={{
              borderColor: active.has(s.id) ? s.color : "var(--card-border)",
              color: active.has(s.id) ? s.color : "var(--body)",
              backgroundColor: active.has(s.id) ? "var(--muted)" : "transparent",
            }}
          >
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-card-border bg-background p-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[480px]">
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--card-border)" strokeWidth="1.5" />
          <line x1={padding} y1={padding / 2} x2={padding} y2={height - padding} stroke="var(--card-border)" strokeWidth="1.5" />
          {Array.from({ length: maxN }, (_, i) => i + 1).map((n) => (
            <text key={n} x={padding + ((n - 1) / (maxN - 1)) * (width - 2 * padding)} y={height - padding + 16} textAnchor="middle" className="fill-secondary text-[10px] font-mono">
              {n}
            </text>
          ))}
          <text x={width / 2} y={height - 6} textAnchor="middle" className="fill-secondary text-[10px] font-mono">
            n (input size)
          </text>
          {series
            .filter((s) => active.has(s.id))
            .map((s) => (
              <polyline
                key={s.id}
                points={Array.from({ length: maxN }, (_, i) => toPoint(i + 1, s.fn(i + 1))).join(" ")}
                fill="none"
                stroke={s.color}
                strokeWidth="2.5"
              />
            ))}
        </svg>
      </div>
    </div>
  );
}
