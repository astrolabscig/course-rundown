"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../ExplainerBox";
import { trackInteract } from "@/lib/track";
import { computeUngroupedQuartiles } from "@/lib/statistics/positionModel";

const width = 500;
const height = 160;
const plotLeft = 40;
const plotRight = 460;
const boxY = 60;
const boxHeight = 40;

export default function BoxplotBuilder() {
  const [input, setInput] = useState("12,15,12,18,20,22,15,12,25,30");
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  const data = useMemo(
    () =>
      input
        .split(",")
        .map((s) => Number(s.trim()))
        .filter((n) => !Number.isNaN(n)),
    [input]
  );

  const summary = useMemo(() => {
    if (data.length === 0) return null;
    const q = computeUngroupedQuartiles(data);
    const min = Math.min(...data);
    const max = Math.max(...data);
    return { min, q1: q.q1, median: q.q2, q3: q.q3, max };
  }, [data]);

  const interpretation = useMemo(() => {
    if (!summary) return "";
    const boxCenter = (summary.q1 + summary.q3) / 2;
    const leftWhisker = summary.q1 - summary.min;
    const rightWhisker = summary.max - summary.q3;
    if (Math.abs(summary.median - boxCenter) < (summary.q3 - summary.q1) * 0.1 && Math.abs(leftWhisker - rightWhisker) < Math.max(leftWhisker, rightWhisker) * 0.2) {
      return "The median sits near the box's center and both whiskers are similar lengths — roughly symmetric.";
    }
    if (summary.median < boxCenter || rightWhisker > leftWhisker) {
      return "The median sits toward the left of the box, and/or the right whisker is longer — positively skewed (tail stretches right).";
    }
    return "The median sits toward the right of the box, and/or the left whisker is longer — negatively skewed (tail stretches left).";
  }, [summary]);

  function toX(v: number) {
    if (!summary) return plotLeft;
    return plotLeft + ((v - summary.min) / (summary.max - summary.min || 1)) * (plotRight - plotLeft);
  }

  return (
    <div className="space-y-4">
      <ExplainerBox title="A boxplot packs five numbers into one picture">
        <p>
          Minimum, Q1, median, Q3, maximum — the five-number summary. Draw a box from Q1 to Q3
          (the middle 50% of the data), a line through the median, and whiskers out to the min and
          max. Where the median sits inside the box, and which whisker is longer, tells you the
          skew at a glance — no formula needed.
        </p>
      </ExplainerBox>

      <input
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          markInteracted();
        }}
        className="w-full rounded-full border border-card-border px-4 py-2 text-sm font-mono"
      />

      {summary && (
        <>
          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            <div className="rounded-lg border border-card-border p-2">
              <p className="text-secondary">Min</p>
              <p className="font-mono font-semibold text-heading">{summary.min}</p>
            </div>
            <div className="rounded-lg border border-card-border p-2">
              <p className="text-secondary">Q1</p>
              <p className="font-mono font-semibold text-heading">{summary.q1.toFixed(1)}</p>
            </div>
            <div className="rounded-lg border border-card-border p-2">
              <p className="text-secondary">Median</p>
              <p className="font-mono font-semibold text-heading">{summary.median.toFixed(1)}</p>
            </div>
            <div className="rounded-lg border border-card-border p-2">
              <p className="text-secondary">Q3</p>
              <p className="font-mono font-semibold text-heading">{summary.q3.toFixed(1)}</p>
            </div>
            <div className="rounded-lg border border-card-border p-2">
              <p className="text-secondary">Max</p>
              <p className="font-mono font-semibold text-heading">{summary.max}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-card-border bg-muted p-3">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
              <line x1={toX(summary.min)} y1={boxY + boxHeight / 2} x2={toX(summary.q1)} y2={boxY + boxHeight / 2} stroke="var(--accent)" strokeWidth="2" />
              <line x1={toX(summary.q3)} y1={boxY + boxHeight / 2} x2={toX(summary.max)} y2={boxY + boxHeight / 2} stroke="var(--accent)" strokeWidth="2" />
              <line x1={toX(summary.min)} y1={boxY + 10} x2={toX(summary.min)} y2={boxY + boxHeight - 10} stroke="var(--accent)" strokeWidth="2" />
              <line x1={toX(summary.max)} y1={boxY + 10} x2={toX(summary.max)} y2={boxY + boxHeight - 10} stroke="var(--accent)" strokeWidth="2" />
              <rect x={toX(summary.q1)} y={boxY} width={toX(summary.q3) - toX(summary.q1)} height={boxHeight} fill="var(--accent)" fillOpacity="0.15" stroke="var(--accent)" strokeWidth="2" />
              <line x1={toX(summary.median)} y1={boxY} x2={toX(summary.median)} y2={boxY + boxHeight} stroke="var(--accent-warm)" strokeWidth="2.5" />
              {[summary.min, summary.q1, summary.median, summary.q3, summary.max].map((v, i) => (
                <text key={i} x={toX(v)} y={boxY + boxHeight + 20} textAnchor="middle" className="fill-secondary text-[10px] font-mono">
                  {v}
                </text>
              ))}
            </svg>
          </div>

          <p className="text-sm text-body">{interpretation}</p>
        </>
      )}
    </div>
  );
}
