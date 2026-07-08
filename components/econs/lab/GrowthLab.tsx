"use client";

import { useMemo, useRef, useState } from "react";
import ExplainerBox from "../../ExplainerBox";
import { trackInteract } from "@/lib/track";
import { computeGrowthRate, generatePotentialGrowthSeries, GROWTH_YEARS, type GrowthInputs } from "@/lib/econs/lab/growthModel";

const width = 700;
const height = 320;
const plotLeft = 55;
const plotRight = 670;
const plotTop = 30;
const plotBottom = 270;

const sliders: { key: keyof GrowthInputs; label: string; blurb: string }[] = [
  {
    key: "education",
    label: "Education",
    blurb: "A more educated workforce (human capital) can do more with the same hours worked — raising output per person.",
  },
  {
    key: "technology",
    label: "Technology",
    blurb: "Better technology lets the same workers and machines produce more — the single biggest driver of growth over the long run.",
  },
  {
    key: "investment",
    label: "Investment",
    blurb: "More capital (factories, machines, tools) per worker means each worker can produce more output.",
  },
  {
    key: "infrastructure",
    label: "Infrastructure",
    blurb: "Reliable roads, power, and ports lower the cost of doing business economy-wide, letting existing resources be used more productively.",
  },
];

export default function GrowthLab() {
  const [inputs, setInputs] = useState<GrowthInputs>({ education: 0, technology: 0, investment: 0, infrastructure: 0 });
  const interactedRef = useRef(false);

  function markInteracted() {
    if (!interactedRef.current) {
      interactedRef.current = true;
      trackInteract();
    }
  }

  function setSlider(key: keyof GrowthInputs, value: number) {
    setInputs((prev) => ({ ...prev, [key]: value }));
    markInteracted();
  }

  const series = useMemo(() => generatePotentialGrowthSeries(inputs), [inputs]);
  const growthRate = useMemo(() => computeGrowthRate(inputs), [inputs]);

  const { minGdp, maxGdp } = useMemo(() => {
    const values = series.map((p) => p.gdp);
    const min = Math.min(...values, 0);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1;
    return { minGdp: min - padding, maxGdp: max + padding };
  }, [series]);

  function toPlotX(year: number) {
    return plotLeft + (year / GROWTH_YEARS) * (plotRight - plotLeft);
  }
  function toPlotY(gdp: number) {
    return plotBottom - ((gdp - minGdp) / (maxGdp - minGdp)) * (plotBottom - plotTop);
  }

  const pathD = useMemo(
    () => `M ${series.map((p) => `${toPlotX(p.year).toFixed(1)},${toPlotY(p.gdp).toFixed(1)}`).join(" L ")}`,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [series, minGdp, maxGdp]
  );

  return (
    <div className="space-y-4">
      <ExplainerBox title="What makes an economy's ceiling rise over time?">
        <p>
          The business cycle (Module 1) wobbles around a trend — but what determines the trend
          itself? Long-run growth is about raising <strong>potential GDP</strong>: the economy's
          underlying capacity, independent of any short-term boom or bust. Adjust the sliders
          below and watch the trend line get steeper or flatter — no cyclical wobble here, just
          the long-run ceiling.
        </p>
      </ExplainerBox>

      <div className="grid gap-3 sm:grid-cols-2">
        {sliders.map((s) => (
          <div key={s.key} className="rounded-xl border border-card-border bg-card p-3 space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <label htmlFor={`slider-${s.key}`} className="font-semibold text-heading">
                {s.label}
              </label>
              <span className="font-mono text-xs text-secondary">
                {inputs[s.key] > 0 ? `+${inputs[s.key]}` : inputs[s.key]}
              </span>
            </div>
            <input
              id={`slider-${s.key}`}
              type="range"
              min={-2}
              max={2}
              step={1}
              value={inputs[s.key]}
              onChange={(e) => setSlider(s.key, Number(e.target.value))}
              className="w-full accent-[var(--accent)]"
            />
            <p className="text-xs text-secondary">{s.blurb}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-secondary">
          Annual growth rate:{" "}
          <strong className={`font-mono ${growthRate >= 0 ? "text-success" : "text-error"}`}>
            {growthRate.toFixed(1)}%
          </strong>
        </span>
      </div>

      <div className="rounded-2xl border border-card-border bg-muted p-3">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-64">
          <line x1={plotLeft} y1={plotTop - 5} x2={plotLeft} y2={plotBottom} stroke="var(--secondary)" strokeWidth="1" />
          <line x1={plotLeft} y1={plotBottom} x2={plotRight + 5} y2={plotBottom} stroke="var(--secondary)" strokeWidth="1" />
          <text x={(plotLeft + plotRight) / 2} y={plotBottom + 24} textAnchor="middle" className="fill-secondary text-xs">
            Time (years)
          </text>
          <text
            x={0}
            y={0}
            textAnchor="middle"
            className="fill-secondary text-xs"
            transform={`translate(18, ${(plotTop + plotBottom) / 2}) rotate(-90)`}
          >
            Potential GDP
          </text>
          <path d={pathD} fill="none" stroke="var(--success)" strokeWidth="2.5" strokeDasharray="6,3" />
          <text x={toPlotX(GROWTH_YEARS) - 4} y={toPlotY(series[series.length - 1].gdp) - 10} textAnchor="end" className="fill-success font-semibold text-xs">
            Potential GDP
          </text>
        </svg>
      </div>
    </div>
  );
}
